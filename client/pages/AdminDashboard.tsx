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
              <p><b>Address:</b> ${invoice.receiver_address || "N/A"}</p>
            </div>

          </div>

          <div class="section">
            <p><b>Tracking:</b> ${invoice.tracking_number}</p>
            <p><b>Date:</b> ${new Date(invoice.created_at).toLocaleString()}</p>
            <p><b>Status:</b> ${invoice.status || "Pending"}</p>
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

        <script>window.print();</script>
      </body>
    </html>
  `);

  win.document.close();
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "overview" | "packages" | "invoices" | "users"
  >("overview");

  const [packages, setPackages] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

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

        setStats(statsRes || {});
        setPackages(pkgRes?.packages || []);
        setInvoices(invRes?.invoices || []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };

    load();
  }, []);

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

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img src={logoUrl} className="w-10 h-10" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>

            <Button
              onClick={() => {
                localStorage.clear();
                navigate("/admin");
              }}
            >
              <LogOut className="mr-2" />
              Logout
            </Button>
          </div>

          <div className="flex gap-3 mb-6">
            <Button onClick={() => setActiveTab("overview")}>Overview</Button>
            <Button onClick={() => setActiveTab("packages")}>Packages</Button>
            <Button onClick={() => setActiveTab("invoices")}>Invoices</Button>
            <Button onClick={() => setActiveTab("users")}>Users</Button>
          </div>

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
                  <Input placeholder="Sender Name"
                    value={formData.sender_name}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_name: e.target.value })
                    }
                  />

                  <Input placeholder="Sender Address"
                    value={formData.sender_address}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_address: e.target.value })
                    }
                  />

                  <Input placeholder="Receiver Name"
                    value={formData.receiver_name}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_name: e.target.value })
                    }
                  />

                  <Input placeholder="Receiver Address"
                    value={formData.receiver_address}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_address: e.target.value })
                    }
                  />

                  <Input placeholder="Receiver Phone"
                    value={formData.receiver_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_phone: e.target.value })
                    }
                  />

                  <Input placeholder="Package Type"
                    value={formData.package_type}
                    onChange={(e) =>
                      setFormData({ ...formData, package_type: e.target.value })
                    }
                  />

                  <Input placeholder="Weight"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />

                  <Input placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
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

          {activeTab === "packages" && (
            <Card>
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
                            <Edit2 size={16} />
                          </button>

                          <button onClick={() => handleDelete(p.id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {activeTab === "invoices" && (
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>

              <CardContent>
                {invoices.length === 0 ? (
                  <p className="text-center text-gray-500">No invoices yet</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th>Tracking</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td>{inv.tracking_number}</td>
                          <td>${inv.total_amount}</td>
                          <td>
                            <Button onClick={() => downloadInvoice(inv)}>
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-center text-gray-500">
                  No users available yet
                </p>
              </CardContent>
            </Card>
          )}

          {editingPackage && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white p-6 rounded w-[400px]">

                <select
                  className="w-full border p-2"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  {allowedStatuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <Input
                  className="mt-2"
                  placeholder="Location"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                />

                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={() => setEditingPackage(null)}>
                    Cancel
                  </Button>
                  <Button onClick={submitEdit}>Update</Button>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}