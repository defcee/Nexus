import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "react-router-dom";
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [packages, setPackages] = useState([
    { id: 1, tracking: "NEX1234567890", sender: "John Doe", receiver: "Jane Smith", status: "In Transit" },
    { id: 2, tracking: "NEX1234567891", sender: "ABC Corp", receiver: "XYZ Inc", status: "Pending" },
  ]);

  const [formData, setFormData] = useState({
    senderName: "",
    receiverName: "",
    receiverAddress: "",
    receiverPhone: "",
    packageType: "",
    weight: "",
    price: "",
  });

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senderName && formData.receiverName) {
      const newPackage = {
        id: packages.length + 1,
        tracking: `NEX${Math.random().toString().slice(2, 12)}`,
        sender: formData.senderName,
        receiver: formData.receiverName,
        status: "Pending",
      };
      setPackages([...packages, newPackage]);
      setFormData({
        senderName: "",
        receiverName: "",
        receiverAddress: "",
        receiverPhone: "",
        packageType: "",
        weight: "",
        price: "",
      });
    }
  };

  const stats = [
    { label: "Total Shipments", value: "5,234", icon: Package, color: "text-primary" },
    { label: "Delivered", value: "4,892", icon: TrendingUp, color: "text-green-600" },
    { label: "Pending", value: "342", icon: Package, color: "text-yellow-600" },
    { label: "Total Users", value: "1,203", icon: Users, color: "text-secondary" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "packages", label: "Packages", icon: Package },
    { id: "users", label: "Users", icon: Users },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "messages", label: "Chat Messages", icon: MessageSquare },
  ];

  return (
    <Layout>
      <section className="py-8">
        <div className="container">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-gray-600">Manage all operations and shipments</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <LogOut size={18} /> Logout
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <div className={`p-3 bg-gray-100 rounded-lg ${stat.color}`}>
                        <Icon size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-600 hover:text-primary"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Revenue Today</span>
                        <span className="font-bold text-primary">$24,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Active Deliveries</span>
                        <span className="font-bold text-primary">342</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Avg Delivery Time</span>
                        <span className="font-bold text-primary">2.4 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Satisfaction Rate</span>
                        <span className="font-bold text-green-600">98.7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Package NEX1234567890 delivered</p>
                          <p className="text-gray-500">5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">New user registered</p>
                          <p className="text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Chat message from user</p>
                          <p className="text-gray-500">30 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Packages Tab */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Create New Shipment</CardTitle>
                    <CardDescription>Add a new package to the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreatePackage} className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-primary mb-4">Sender Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Sender Name"
                            value={formData.senderName}
                            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                            className="border-primary/30"
                            required
                          />
                          <Input
                            placeholder="Sender Phone"
                            type="tel"
                            className="border-primary/30"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-primary mb-4">Receiver Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Receiver Name"
                            value={formData.receiverName}
                            onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                            className="border-primary/30"
                            required
                          />
                          <Input
                            placeholder="Receiver Phone"
                            value={formData.receiverPhone}
                            onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                            className="border-primary/30"
                            required
                          />
                          <Input
                            placeholder="Receiver Address"
                            value={formData.receiverAddress}
                            onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                            className="border-primary/30 md:col-span-2"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-primary mb-4">Package Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Package Type (Electronics, Documents, etc.)"
                            value={formData.packageType}
                            onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                            className="border-primary/30"
                            required
                          />
                          <Input
                            type="number"
                            placeholder="Weight (kg)"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="border-primary/30"
                            step="0.01"
                            required
                          />
                          <Input
                            type="number"
                            placeholder="Price ($)"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="border-primary/30"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="gap-2 bg-secondary hover:bg-secondary/90 w-full">
                        <Plus size={18} /> Create Shipment
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>All Packages</CardTitle>
                    <CardDescription>Manage and track all shipments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-semibold">Tracking</th>
                            <th className="text-left py-3 px-2 font-semibold">Sender</th>
                            <th className="text-left py-3 px-2 font-semibold">Receiver</th>
                            <th className="text-left py-3 px-2 font-semibold">Status</th>
                            <th className="text-left py-3 px-2 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {packages.map((pkg) => (
                            <tr key={pkg.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-2 font-mono text-xs">{pkg.tracking}</td>
                              <td className="py-3 px-2">{pkg.sender}</td>
                              <td className="py-3 px-2">{pkg.receiver}</td>
                              <td className="py-3 px-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  pkg.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : pkg.status === "In Transit"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {pkg.status}
                                </span>
                              </td>
                              <td className="py-3 px-2 flex gap-2">
                                <button className="p-2 hover:bg-gray-200 rounded">
                                  <Edit2 size={16} />
                                </button>
                                <button className="p-2 hover:bg-red-100 rounded text-red-600">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>View and manage registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-semibold">Name</th>
                          <th className="text-left py-3 px-2 font-semibold">Email</th>
                          <th className="text-left py-3 px-2 font-semibold">Phone</th>
                          <th className="text-left py-3 px-2 font-semibold">Joined</th>
                          <th className="text-left py-3 px-2 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-2">John Doe</td>
                          <td className="py-3 px-2">john@example.com</td>
                          <td className="py-3 px-2">08012345678</td>
                          <td className="py-3 px-2">2024-01-15</td>
                          <td className="py-3 px-2 flex gap-2">
                            <button className="p-2 hover:bg-gray-200 rounded">
                              <Edit2 size={16} />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>View and manage generated invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 py-8 text-center">Invoices will be listed here</p>
                </CardContent>
              </Card>
            )}

            {/* Chat Messages Tab */}
            {activeTab === "messages" && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Chat Messages</CardTitle>
                  <CardDescription>View customer support messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 py-8 text-center">Chat messages will be displayed here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
