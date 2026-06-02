import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";

import { adminAPI, packageAPI } from "@/lib/api";

const logoUrl = "/assets/logo.png";

/* ========================= INVOICE DOWNLOAD ========================= */
const downloadInvoice = (invoice: any) => {
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding: 40px; background:#f5f5f5; }
          .invoice { background:#fff; padding:30px; border-radius:10px; max-width:900px; margin:auto; }
          .header { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:15px; }
          .logo { width:120px; }
          .section { margin-top:20px; padding:15px; border:1px solid #eee; border-radius:8px; }
          .grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
          .title { font-size:28px; font-weight:bold; }
          table { width:100%; margin-top:20px; border-collapse:collapse; }
          th, td { border:1px solid #ddd; padding:10px; }
          th { background:#f3f3f3; }
          .total { text-align:right; font-size:20px; margin-top:20px; font-weight:bold; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <img src="${logoUrl}" class="logo" />
            <div class="title">INVOICE</div>
          </div>

          <div class="grid">
            <div class="section">
              <h3>Sender</h3>
              <p><b>Name:</b> ${invoice.sender_name || "N/A"}</p>
              <p><b>Address:</b> ${invoice.sender_address || "N/A"}</p>
            </div>

            <div class="section">
              <h3>Receiver</h3>
              <p><b>Name:</b> ${invoice.receiver_name || "N/A"}</p>
              <p><b>Email:</b> ${invoice.receiver_email || "N/A"}</p>
              <p><b>Address:</b> ${invoice.receiver_address || "N/A"}</p>
            </div>
          </div>

          <div class="section">
            <p><b>Tracking:</b> ${invoice.tracking_number}</p>
            <p><b>Date:</b> ${new Date(invoice.created_at).toLocaleString()}</p>
            <p><b>Status:</b> ${invoice.status || "Pending"}</p>
            <p><b>ETA:</b> ${invoice.eta || "Not set"}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Shipping Fee</td>
                <td>$${invoice.total_amount}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            TOTAL: $${invoice.total_amount}
          </div>
        </div>
      </body>
    </html>
  `);

  win.document.close();
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "overview" | "packages" | "invoices" | "users" | "chat"
  >("overview");

  const [packages, setPackages] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [editingPackage, setEditingPackage] = useState<any>(null);

  const [formData, setFormData] = useState({
    sender_name: "",
    sender_address: "",
    receiver_name: "",
    receiver_address: "",
    receiver_email: "",   // ✅ ADDED
    receiver_phone: "",
    package_type: "",
    weight: "",
    price: "",
    eta: "",
  });

  const [editForm, setEditForm] = useState({
    status: "",
    location: "",
    eta: "",
  });

  /* ========================= AUTH ========================= */
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin");
  }, [navigate]);

  /* ========================= LOAD DATA ========================= */
  useEffect(() => {
    const load = async () => {
      try {
        const pkgRes = await packageAPI.getAll();
        const invRes = await adminAPI.getInvoices();
        const chatRes = await adminAPI.getChatMessages();

        setPackages(pkgRes?.packages || []);
        setInvoices(invRes?.invoices || []);
        setMessages(chatRes?.messages || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  /* ========================= CREATE PACKAGE ========================= */
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await packageAPI.create(formData);
      const newPkg = res?.package;

      if (!newPkg) return;

      setPackages((prev) => [newPkg, ...prev]);

      const invoiceRes = await adminAPI.createInvoice({
        trackingNumber: newPkg.tracking_number,
        userId: null,
        totalAmount: Number(newPkg.price),

        sender_name: formData.sender_name,
        sender_address: formData.sender_address,

        receiver_name: formData.receiver_name,
        receiver_address: formData.receiver_address,
        receiver_email: formData.receiver_email, // ✅ ADDED
        eta: formData.eta,
      });

      if (invoiceRes?.invoice) {
        setInvoices((prev) => [invoiceRes.invoice, ...prev]);
        downloadInvoice(invoiceRes.invoice);
      }

      setFormData({
        sender_name: "",
        sender_address: "",
        receiver_name: "",
        receiver_address: "",
        receiver_email: "",
        receiver_phone: "",
        package_type: "",
        weight: "",
        price: "",
        eta: "",
      });

    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  };

  /* ========================= UI ========================= */
  return (
    <Layout>
      <section className="py-8">
        <div className="container">

          {/* HEADER */}
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>

            <Button onClick={() => {
              localStorage.clear();
              navigate("/admin");
            }}>
              <LogOut className="mr-2" />
              Logout
            </Button>
          </div>

          {/* TABS */}
          <div className="flex gap-3 mb-6">
            <Button onClick={() => setActiveTab("overview")}>Overview</Button>
            <Button onClick={() => setActiveTab("packages")}>Packages</Button>
            <Button onClick={() => setActiveTab("invoices")}>Invoices</Button>
            <Button onClick={() => setActiveTab("users")}>Users</Button>
            <Button onClick={() => setActiveTab("chat")}>Chat</Button>
          </div>

          {/* FORM */}
          {activeTab === "overview" && (
            <Card>
              <CardHeader>
                <CardTitle>Create Package + Invoice</CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleCreatePackage} className="grid md:grid-cols-2 gap-4">

                  <Input placeholder="Sender Name"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })} />

                  <Input placeholder="Sender Address"
                    value={formData.sender_address}
                    onChange={(e) => setFormData({ ...formData, sender_address: e.target.value })} />

                  <Input placeholder="Receiver Name"
                    value={formData.receiver_name}
                    onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })} />

                  <Input placeholder="Receiver Email"   // ✅ ADDED
                    value={formData.receiver_email}
                    onChange={(e) => setFormData({ ...formData, receiver_email: e.target.value })} />

                  <Input placeholder="Receiver Address"
                    value={formData.receiver_address}
                    onChange={(e) => setFormData({ ...formData, receiver_address: e.target.value })} />

                  <Input placeholder="Receiver Phone"
                    value={formData.receiver_phone}
                    onChange={(e) => setFormData({ ...formData, receiver_phone: e.target.value })} />

                  <Input placeholder="Package Type"
                    value={formData.package_type}
                    onChange={(e) => setFormData({ ...formData, package_type: e.target.value })} />

                  <Input placeholder="Weight"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />

                  <Input placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} />

                  <Input placeholder="ETA"
                    value={formData.eta}
                    onChange={(e) => setFormData({ ...formData, eta: e.target.value })} />

                  <Button className="md:col-span-2" type="submit">
                    <Plus className="mr-2" />
                    Create Package + Invoice
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

        </div>
      </section>
    </Layout>
  );
}