import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =========================================
  // FIXED: NOW SENDS TO BACKEND + SMTP
  // =========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      setSubmitted(true);

      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("CONTACT ERROR:", err);
      alert("Message failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (909) 496-7913",
      image: "/assets/contact-phone.jpg",
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@nexusglog.com",
      image: "/assets/contact-email.jpg",
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Available 24/7/365",
      image: "/assets/contact-hours.jpg",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 md:py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-blue-100">
            We'd love to hear from you. Send us a message!
          </p>
        </div>
      </section>

      <div className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />

              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />

              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                required
                rows={5}
                className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-primary focus:outline-none"
              />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-secondary hover:bg-secondary/90"
                disabled={loading}
              >
                {submitted
                  ? "Message Sent! ✓"
                  : loading
                  ? "Sending..."
                  : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Info Image */}
          <div>
            <img
              src="/assets/contact-support.jpg"
              alt="Contact Support"
              className="rounded-lg shadow-lg w-full h-96 object-cover mb-6"
            />
            <p className="text-gray-600 text-sm">
              Our dedicated support team is ready to assist you with any questions or concerns.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        {/* Contact Cards */}
<div className="mb-16">
  <h2 className="text-3xl font-bold text-primary text-center mb-12">
    Other Ways to Reach Us
  </h2>

  <div className="grid md:grid-cols-4 gap-6 justify-items-center">
    {contactInfo.map((info, idx) => {
      const Icon = info.icon;

      return (
        <div
          key={idx}
          className="group flex flex-col items-center text-center max-w-xs"
        >
          <div className="mb-4 overflow-hidden rounded-lg h-40 w-full">
            <img
              src={info.image}
              alt={info.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col items-center">
            <Icon className="w-6 h-6 text-secondary mb-2" />

            <div>
              <h3 className="font-semibold text-primary">
                {info.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {info.details}
              </p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
        {/* FAQ */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-primary mb-2">
                How long does delivery take?
              </h3>
              <p className="text-gray-600">
                Local: 1–2 days, International: 7–14 days.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary mb-2">
                Can I track my package?
              </h3>
              <p className="text-gray-600">
                Yes, real-time tracking is available for all shipments.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600">
                30-day returns for eligible shipments.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-primary mb-2">
                Do you offer insurance?
              </h3>
              <p className="text-gray-600">
                Yes, optional shipment insurance is available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}