import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiFetch } from "@/lib/api";

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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data?.token) {
        // ================================
        // STORE JWT TOKEN
        // ================================
        localStorage.setItem("admin_token", data.token);

        // Optional: store admin info
        localStorage.setItem(
          "admin_user",
          JSON.stringify(data.admin)
        );

        navigate("/admin/dashboard");
      } else {
        setErrors({
          submit:
            data?.error ||
            data?.message ||
            "Invalid username or password",
        });
      }
    } catch (err: any) {
      setErrors({
        submit:
          err.message ||
          "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-8rem)] py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-lg">

            {/* ICON */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Lock size={32} className="text-white" />
              </div>
            </div>

            {/* TITLE */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-600 text-sm">
                JWT Secure Access
              </p>
            </div>

            {/* ERROR */}
            {errors.submit && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  {errors.submit}
                </AlertDescription>
              </Alert>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* USERNAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>

                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 ${
                      errors.username ? "border-red-500" : ""
                    }`}
                  />
                </div>

                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                </div>

                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                {loading ? "Authenticating..." : "Login to Admin Panel"}
                <ArrowRight size={18} />
              </Button>

            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}