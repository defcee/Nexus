console.log("🔥 NEW ADMIN DASHBOARD LOADED");

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { adminAPI, packageAPI } from "@/lib/api";

// ✅ SAFE LOGO (Vite + production safe)
const logoUrl = "/logo.png";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [packages, setPackages] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  // ===============================
  // AUTH CHECK
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
        setLoading(true);

        const statsRes = await adminAPI.getStats();
        const pkgRes = await packageAPI.getAll();
        const invoiceRes = await adminAPI.getInvoices();

        setStats(statsRes || {});
        setPackages(pkgRes?.packages || []);
        setInvoices(invoiceRes?.invoices || []);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ===============================
  // CREATE PACKAGE + INVOICE
  // ===============================
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await packageAPI.create(formData);
      const newPkg = res?.package;

      if (!newPkg) return;

      setPackages((prev) => [newPkg, ...prev]);

      // 🔥 CREATE INVOICE (FIXED)
      try {
        const invoiceRes = await adminAPI.createInvoice({
          trackingNumber: newPkg.tracking_number,
          userId: null, // optional FIXED
          totalAmount: newPkg.price,
          invoiceFile: `invoice-${newPkg.tracking_number}.pdf`,
        });

        if (invoiceRes?.invoice) {
          setInvoices((prev) => [invoiceRes.invoice, ...prev]);
        }
      } catch (invoiceErr) {
        console.error("❌ INVOICE FAILED:", invoiceErr);
      }

      // reset form
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
      console.error("CREATE PACKAGE ERROR:", err);
    }
  };

  // ===============================
  // DELETE PACKAGE
  // ===============================
  const handleDelete = async (id: number) => {
    await packageAPI.delete(id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
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

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img src={logoUrl} className="w-10 h-10" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
            <Card><CardContent>Total: {stats.totalShipments}</CardContent></Card>
            <Card><CardContent>Delivered: {stats.deliveredShipments}</CardContent></Card>
            <Card><CardContent>Pending: {stats.pendingShipments}</CardContent></Card>
            <Card><CardContent>Users: {stats.totalUsers}</CardContent></Card>
            <Card><CardContent>Revenue: ${stats.revenueToday}</CardContent></Card>
          </div>

          {/* CREATE PACKAGE */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Create Package + Invoice</CardTitle>
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

                <Input placeholder="Receiver Address"
                  value={formData.receiver_address}
                  onChange={(e) =>
                    setFormData({ ...formData, receiver_address: e.target.value })
                  }
                />

                <Input placeholder="Phone"
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

        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;