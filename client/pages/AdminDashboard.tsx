console.log("🔥 NEW ADMIN DASHBOARD LOADED");

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Package,
  Users,
  BarChart3,
  MessageSquare,
  FileText,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  TrendingUp,
} from "lucide-react";

import { adminAPI, packageAPI } from "@/lib/api";

// ✅ SAFE LOGO (works in production)
const logoUrl = "/logo.png";

// =======================================
// PDF GENERATION (INVOICE)
// =======================================
const downloadInvoice = (invoice: any) => {
  const win = window.open("", "_blank");

  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; padding: 40px; }
          .header { display:flex; justify-content:space-between; align-items:center; }
          .logo { width:120px; }
          .box { margin-top:20px; padding:20px; border:1px solid #ddd; }
          .row { margin:10px 0; }
          .total { font-size:20px; font-weight:bold; margin-top:20px; }
        </style>
      </head>
      <body>

        <div class="header">
          <img class="logo" src="${logoUrl}" />
          <h2>INVOICE</h2>
        </div>

        <div class="box">
          <div class="row"><b>Tracking:</b> ${invoice.tracking_number}</div>
          <div class="row"><b>User ID:</b> ${invoice.user_id ?? "N/A"}</div>
          <div class="row"><b>Date:</b> ${new Date(invoice.created_at).toLocaleString()}</div>
        </div>

        <div class="box">
          <div class="row"><b>Total Amount:</b> $${invoice.total_amount}</div>
        </div>

        <script>
          window.print();
        </script>

      </body>
    </html>
  `);

  win.document.close();
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [packages, setPackages] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalShipments: 0,
    deliveredShipments: 0,
    pendingShipments: 0,
    totalUsers: 0,
    revenueToday: 0,
  });

  const [formData, setFormData] = useState({
    sender_name: "",
    receiver_name: "",
    receiver_address: "",
    receiver_phone: "",
    package_type: "",
    weight: "",
    price: "",
  });

  const [editingPackage, setEditingPackage] = useState<any>(null);

  const [editForm, setEditForm] = useState({
    status: "",
    location: "",
  });

  const allowedStatuses = [
    "Pending",
    "On Transit",
    "On Hold",
    "Arrived",
    "Delivered",
  ];

  // ===============================
  // AUTH
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin");
  }, [navigate]);

  // ===============================
  // LOAD DATA
  // ===============================
  useEffect(() => {
    const load = async () => {
      try {
        const statsRes = await adminAPI.getStats();
        const pkgRes = await packageAPI.getAll();
        const invoiceRes = await adminAPI.getInvoices();

        setStats(statsRes || {});
        setPackages(pkgRes?.packages || []);
        setInvoices(invoiceRes?.invoices || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  // ===============================
  // CREATE PACKAGE + AUTO INVOICE
  // ===============================
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await packageAPI.create(formData);
      const newPkg = res?.package;

      if (newPkg) {
        setPackages((prev) => [newPkg, ...prev]);

        // AUTO INVOICE (backend)
        const invoice = await adminAPI.createInvoice({
          trackingNumber: newPkg.tracking_number,
          userId: null, // ✅ FIX: optional
          totalAmount: newPkg.price,
        });

        if (invoice?.invoice) {
          setInvoices((prev) => [invoice.invoice, ...prev]);

          // Auto download invoice
          downloadInvoice(invoice.invoice);
        }
      }

      setFormData({
        sender_name: "",
        receiver_name: "",
        receiver_address: "",
        receiver_phone: "",
        package_type: "",
        weight: "",
        price: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id: number) => {
    await packageAPI.delete(id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const submitEdit = async () => {
    const trackingNumber =
      editingPackage.tracking_number || editingPackage.trackingNumber;

    const res = await packageAPI.updateStatus(trackingNumber, {
      status: editForm.status,
      location: editForm.location,
    });

    setPackages((prev) =>
      prev.map((p) =>
        (p.tracking_number || p.trackingNumber) === trackingNumber
          ? res.package
          : p
      )
    );

    setEditingPackage(null);
  };

  return (
    <Layout>
      <section className="py-8">
        <div className="container">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img src={logoUrl} className="w-10 h-10" />
              <h1>Admin Dashboard</h1>
            </div>

            <Button onClick={() => {
              localStorage.clear();
              navigate("/admin");
            }}>
              <LogOut className="mr-2" />
              Logout
            </Button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card><CardContent>Total: ${stats.totalShipments}</CardContent></Card>
            <Card><CardContent>Delivered: ${stats.deliveredShipments}</CardContent></Card>
            <Card><CardContent>Pending: ${stats.pendingShipments}</CardContent></Card>
            <Card><CardContent>Users: ${stats.totalUsers}</CardContent></Card>
            <Card><CardContent>Revenue: ${stats.revenueToday}</CardContent></Card>
          </div>

          {/* CREATE PACKAGE */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Create Package</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleCreatePackage} className="grid gap-3">

                <Input placeholder="Sender Name"
                  value={formData.sender_name}
                  onChange={(e) =>
                    setFormData({ ...formData, sender_name: e.target.value })
                  }
                />

                <Input placeholder="Receiver Name"
                  value={formData.receiver_name}
                  onChange={(e) =>
                    setFormData({ ...formData, receiver_name: e.target.value })
                  }
                />

                <Input placeholder="Price ($)"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />

                <Button type="submit">
                  <Plus className="mr-2" />
                  Create + Invoice
                </Button>

              </form>
            </CardContent>
          </Card>

          {/* PACKAGES */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Packages</CardTitle>
            </CardHeader>

            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Tracking</th>
                    <th>Sender</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {packages.map((p) => (
                    <tr key={p.id}>
                      <td>{p.tracking_number}</td>
                      <td>{p.sender_name}</td>
                      <td>{p.status}</td>
                      <td className="flex gap-2">
                        <button onClick={() => setEditingPackage(p)}>
                          <Edit2 />
                        </button>

                        <button onClick={() => handleDelete(p.id)}>
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* USERS SAFE EMPTY STATE */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500">
                No users yet (safe render)
              </p>
            </CardContent>
          </Card>

        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;