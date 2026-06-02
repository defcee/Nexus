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
    receiver_phone: "",
    receiver_email: "", // ✅ ADDED EMAIL FIELD
    package_type: "",
    weight: "",
    price: "",
    eta: "", // ✅ MANUAL ETA FIELD
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin");
  }, [navigate]);

  /* =========================
     CREATE PACKAGE (FIXED)
  ========================= */
  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await packageAPI.create(formData);
      const newPkg = res?.package;

      if (!newPkg) return;

      setPackages((prev) => [newPkg, ...prev]);

      // ================================
      // CREATE INVOICE
      // ================================
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
      }

      // ================================
      // 🔥 SEND EMAIL (IMPORTANT FIX)
      // ================================
     await adminAPI.sendEmail({
  to: formData.receiver_email, // MUST EXIST
  subject: `Package Created - ${newPkg.tracking_number}`,
  message: `
    Hello ${formData.receiver_name},

    Your package has been created successfully.

    Tracking Number: ${newPkg.tracking_number}
    Status: Pending
    ETA: ${formData.eta || newPkg.eta}

    Nexus Logistics
  `,
});

      // RESET FORM
      setFormData({
        sender_name: "",
        sender_address: "",
        receiver_name: "",
        receiver_address: "",
        receiver_phone: "",
        receiver_email: "",
        package_type: "",
        weight: "",
        price: "",
        eta: "",
      });

    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  };

  return (
    <Layout>
      <section className="py-8">
        <div className="container">

          {/* =========================
              CREATE PACKAGE FORM
          ========================= */}
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
                  <Input
                    placeholder="Sender Name"
                    value={formData.sender_name}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_name: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Sender Address"
                    value={formData.sender_address}
                    onChange={(e) =>
                      setFormData({ ...formData, sender_address: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Receiver Name"
                    value={formData.receiver_name}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_name: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Receiver Address"
                    value={formData.receiver_address}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_address: e.target.value })
                    }
                  />

                  {/* ✅ EMAIL FIELD ADDED */}
                  <Input
                    placeholder="Receiver Email"
                    value={formData.receiver_email}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_email: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Receiver Phone"
                    value={formData.receiver_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, receiver_phone: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Package Type"
                    value={formData.package_type}
                    onChange={(e) =>
                      setFormData({ ...formData, package_type: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Weight"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />

                  {/* ✅ ETA FIELD ADDED */}
                  <Input
                    placeholder="ETA (e.g. 2026-06-10 or 5 Days)"
                    value={formData.eta}
                    onChange={(e) =>
                      setFormData({ ...formData, eta: e.target.value })
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

        </div>
      </section>
    </Layout>
  );
}