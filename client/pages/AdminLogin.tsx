import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/admin/dashboard");
      } else {
        setErrors({ submit: "Invalid username or password" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-8rem)] py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Admin Badge */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Lock size={32} className="text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Admin Portal</h1>
              <p className="text-gray-600 text-sm">Restricted Access - Administrators Only</p>
            </div>

            {errors.submit && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {errors.submit}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="admin"
                    className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                {loading ? "Authenticating..." : "Login to Admin Panel"} <ArrowRight size={18} />
              </Button>
            </form>

            {/* Default Credentials Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 bg-blue-50 p-4 rounded-lg text-xs text-gray-600">
              <p className="font-semibold text-gray-700 mb-2">Demo Credentials:</p>
              <p>Username: <span className="font-mono text-gray-700">admin</span></p>
              <p>Password: <span className="font-mono text-gray-700">admin123</span></p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
