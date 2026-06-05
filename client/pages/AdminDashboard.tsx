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

  const [packages, setPackages] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 const [activeTab, setActiveTab] = useState<
  "overview" | "packages" | "invoices" | "users" | "chat" | "password"
>("overview");

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
 const handleCreatePackage = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  console.log("FORM DATA:", formData);

  try {
    const res = await packageAPI.create(formData);

    const newPkg = res?.package;
    const invoice = res?.invoice;

    if (!newPkg) return;

    // Add new package instantly
    setPackages((prev) => [
      newPkg,
      ...prev,
    ]);

    // Add invoice instantly
    if (invoice) {
      setInvoices((prev) => [
        invoice,
        ...prev,
      ]);

      // Auto open invoice
      downloadInvoice(invoice);
    }

    // Reset form
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
    console.error(
      "CREATE ERROR:",
      err
    );
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
            <Button onClick={() => setActiveTab("password")}>
  Change Password
</Button>
          </div>

          {/* CHANGE PASSWORD */}
{activeTab === "password" && (
  <Card>
    <CardHeader>
      <CardTitle>Change Password</CardTitle>
    </CardHeader>

    <CardContent className="space-y-4 max-w-md">
      <Input
  type="password"
  placeholder="Current Password"
  value={currentPassword}
  onChange={(e) => setCurrentPassword(e.target.value)}
/>

<Input
  type="password"
  placeholder="New Password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
/>

<Input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
/>

      <Button
  onClick={async () => {
    const token = localStorage.getItem("admin_token");

    if (!currentPassword || !newPassword) {
      alert("Fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      alert("Password updated successfully");

      // clear fields after success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message);
    }
  }}
>
  Update Password
</Button>
    </CardContent>
  </Card>
)}

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
{/* PACKAGES */}
{activeTab === "packages" && (
  <Card>
    <CardHeader>
      <CardTitle>Created Packages</CardTitle>
    </CardHeader>

    <CardContent>
      {packages.length === 0 ? (
        <p className="text-center text-gray-500">
          No packages found
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Tracking</th>
              <th className="text-left py-3">Sender</th>
              <th className="text-left py-3">Receiver</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">ETA</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {packages.map((p) => (
              <tr key={p.id} className="border-b">
                <td>{p.tracking_number}</td>
                <td>{p.sender_name}</td>
                <td>{p.receiver_name}</td>
                <td>{p.status}</td>
                <td>{p.eta || "Not set"}</td>

                <td className="flex gap-2 py-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingPackage(p);

                      setEditForm({
                        status: p.status || "",
                        location: p.current_location || "",
                        eta: p.eta || "",
                      });
                    }}
                  >
                    <Edit2 size={16} />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      await packageAPI.delete(p.id);

                      setPackages((prev) =>
                        prev.filter((x) => x.id !== p.id)
                      );
                    }}
                  >
                    <Trash2 size={16} />
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

{/* INVOICES */}
{activeTab === "invoices" && (
  <Card>
    <CardHeader>
      <CardTitle>Invoices</CardTitle>
    </CardHeader>

    <CardContent>
      {invoices.length === 0 ? (
        <p className="text-center text-gray-500">
          No invoices yet
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Invoice No.</th>
              <th>Tracking</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b">
                <td>{inv.invoice_number}</td>
                <td>{inv.tracking_number}</td>
                <td>{inv.receiver_name}</td>
                <td>${inv.total_amount}</td>
                <td>{inv.status || "Pending"}</td>

                <td>
                  <Button
                    size="sm"
                    onClick={() => downloadInvoice(inv)}
                  >
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

{/* USERS */}
{activeTab === "users" && (
  <Card>
    <CardContent className="py-10">
      <p className="text-center text-gray-500">
        No users available yet
      </p>
    </CardContent>
  </Card>
)}

{/* CHAT */}
{activeTab === "chat" && (
  <Card>
    <CardHeader>
      <CardTitle>Admin Chat Support</CardTitle>
    </CardHeader>

    <CardContent>
      <div className="h-80 overflow-y-auto border rounded p-4 mb-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">
            No messages
          </p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="mb-2">
              <b>{m.sender}</b>: {m.message}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={chatInput}
          onChange={(e) =>
            setChatInput(e.target.value)
          }
          placeholder="Type message..."
        />

        <Button
          onClick={async () => {
            if (!chatInput.trim()) return;

            const res =
              await adminAPI.saveChatMessage({
                userId: null,
                message: chatInput,
                sender: "admin",
              });

            setMessages((prev) => [
              ...prev,
              res.data,
            ]);

            setChatInput("");
          }}
        >
          Send
        </Button>
      </div>
    </CardContent>
  </Card>
)}

{/* EDIT PACKAGE */}
{editingPackage && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-[400px]">
      <h2 className="text-lg font-bold mb-4">
        Update Package
      </h2>

      <Input
        placeholder="Status"
        className="mb-3"
        value={editForm.status}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            status: e.target.value,
          })
        }
      />

      <Input
        placeholder="Current Location"
        className="mb-3"
        value={editForm.location}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            location: e.target.value,
          })
        }
      />

      <Input
        placeholder="ETA"
        className="mb-4"
        value={editForm.eta}
        onChange={(e) =>
          setEditForm({
            ...editForm,
            eta: e.target.value,
          })
        }
      />

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() =>
            setEditingPackage(null)
          }
        >
          Cancel
        </Button>

        <Button
          onClick={async () => {
            const res =
              await packageAPI.update(
                editingPackage.id,
                {
                  status: editForm.status,
                  current_location:
                    editForm.location,
                  eta: editForm.eta,
                }
              );

            setPackages((prev) =>
              prev.map((p) =>
                p.id === editingPackage.id
                  ? res.package
                  : p
              )
            );

            setEditingPackage(null);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  </div>
)}


        </div>
      </section>
    </Layout>
  );
}