import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authAPI } from "@/lib/api"; // or your api file

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      await authAPI.updateUser("me", {
        currentPassword,
        newPassword,
      });

      setMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error updating password");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-bold">Change Password</h2>

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

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </Button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}