console.log("🔥 NEW ADMIN DASHBOARD LOADED");

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

/* =========================
   INVOICE DOWNLOAD
========================= */
const downloadInvoice = (invoice: any) => {
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`...`); // unchanged (trimmed for clarity)
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

  const [stats, setStats] = useState({
    totalShipments: 0,
    deliveredShipments: 0,
    pendingShipments: 0,
    totalUsers: 0,
    revenueToday: 0,
  });

  const [formData, setFormData] = useState({
    sender_name: "",
    sender_address: "",
    receiver_name: "",
    receiver_address: "",
    receiver_phone: "",
    package_type: "",
    weight: "",
    price: "",
    recipient_email: "", // ✅ ADDED
  });

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

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin");
  }, [navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const statsRes = await adminAPI.getStats();
        const pkgRes = await packageAPI.getAll();
        const invRes = await adminAPI.getInvoices();
        const chatRes = await adminAPI.getChatMessages();

        setStats(statsRes || {});
        setPackages(pkgRes?.packages || []);
        setInvoices(invRes?.invoices || []);
        setMessages(chatRes?.messages || []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);

  const sendChat = async () => {
    if (!chatInput.trim()) return;

    try {
      const res = await adminAPI.saveChatMessage({
        userId: null,
        message: chatInput,
        sender: "admin",
      });

      setMessages((prev) => [...prev, res.data]);
      setChatInput("");
    } catch (err) {
      console.error("CHAT SEND ERROR:", err);
    }
  };

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
        receiver_phone: "",
        package_type: "",
        weight: "",
        price: "",
        recipient_email: "", // reset
      });
    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  };

  const handleDelete = async (id: number) => {
    await packageAPI.delete(id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const submitEdit = async () => {
    if (!editingPackage) return;

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

          {/* ===== UI unchanged ===== */}

          {activeTab === "overview" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create Package + Invoice</CardTitle>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={handleCreatePackage}
                  className="grid md:grid-cols-2 gap-4"
                >
                  {/* existing inputs unchanged */}

                  <Input
                    placeholder="Recipient Email"
                    value={formData.recipient_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipient_email: e.target.value,
                      })
                    }
                  />

                  <Button className="md:col-span-2" type="submit">
                    <Plus className="mr-2" />
                    Create Package + Invoice
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* rest UI unchanged */}
        </div>
      </section>
    </Layout>
  );
}