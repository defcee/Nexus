import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ArrowRight } from "lucide-react";

/* FIX LEAFLET MARKER ICONS */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Index() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* =========================
     FIXED TRACK FUNCTION
  ========================= */
  const handleTrack = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trackingNumber.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://nexus-whsr.onrender.com/api/packages/track/${trackingNumber}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Tracking failed");
        return;
      }

      // Save result (optional)
      localStorage.setItem("tracked_package", JSON.stringify(data));

      // Navigate to tracking page (recommended UX)
      navigate(`/track?number=${trackingNumber}`);

    } catch (err) {
      console.error("TRACK ERROR:", err);
      alert("Network error while tracking package");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // SERVICES DATA
  // ============================================
  const services = [
    {
      title: "GPS Tracking",
      image: "/assets/gps-tracking.jpg",
      description: "Track shipments in real-time with live GPS updates.",
    },
    {
      title: "Estimated Delivery",
      image: "/assets/estimated-delivery.jpg",
      description: "AI-powered delivery estimates with precise timing.",
    },
    {
      title: "Live Chat Support",
      image: "/assets/live-chat-support.jpg",
      description: "24/7 customer support for all shipment inquiries.",
    },
    {
      title: "Local Delivery",
      image: "/assets/local-delivery.jpg",
      description: "Fast and secure city-wide parcel delivery services.",
    },
    {
      title: "International Shipping",
      image: "/assets/international-shipping.jpg",
      description: "Reliable worldwide logistics and freight solutions.",
    },
    {
      title: "Same Day Express",
      image: "/assets/same-day-express.jpg",
      description: "Urgent parcel delivery completed within hours.",
    },
    {
      title: "Fragile Handling",
      image: "/assets/fragile-handling.jpg",
      description: "Specialized packaging and handling for delicate items.",
    },
    {
      title: "Refrigerated Shipping",
      image: "/assets/refrigerated-shipping.jpg",
      description: "Temperature-controlled logistics for perishables.",
    },
    {
      title: "Document Delivery",
      image: "/assets/document-delivery.jpg",
      description: "Secure and confidential document transportation.",
    },
  ];

  // ============================================
  // TESTIMONIALS
  // ============================================
  const testimonials = [
    {
      name: "Omar Al-Farsi",
      role: "Import & Export Manager",
      image: "/assets/user2.jpg",
      message:
        "Nexus Global has completely transformed how we manage international cargo deliveries.",
    },
    {
      name: "Sophia Williams",
      role: "E-commerce Entrepreneur",
      image: "/assets/user1.jpg",
      message:
        "The real-time tracking and support system gives my customers complete confidence.",
    },
    {
      name: "Marcus Johnson",
      role: "Supply Chain Coordinator",
      image: "/assets/user3.jpg",
      message:
        "Reliable, fast, and professional. The dashboard makes shipment management seamless.",
    },
  ];

  return (
    <Layout>
      {/* HERO */}
      <section className="hero-bg text-white py-16 md:py-24">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">
              Track Your Parcel in Real-Time
            </h1>

            <p className="mb-6 text-blue-100">
              Global parcel delivery with live GPS tracking, guaranteed safety and 24/7 support.
            </p>

            <Link to="/track">
              <Button size="lg" className="gap-2">
                Start Tracking
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>

          {/* TRACK FORM FIXED */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Track Package
            </h2>

            <form onSubmit={handleTrack} className="space-y-3">
              <Input
                placeholder="Tracking Number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Tracking..." : "Track Now"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Our Logistics Services
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index}>
                <div className="h-52 overflow-hidden">
                  <img src={service.image} className="w-full h-full object-cover" />
                </div>

                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription>
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="container py-16">
        <MapContainer
          {...({
            center: [39.8283, -98.5795] as L.LatLngExpression,
            zoom: 4,
            style: { height: "500px", width: "100%" },
          } as any)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[40.7128, -74.006]}>
            <Popup>New York Coverage</Popup>
          </Marker>
        </MapContainer>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary">
              Trusted by Businesses Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <img src={t.image} className="w-20 h-20 rounded-full mx-auto" />
                  <CardTitle>{t.name}</CardTitle>
                  <CardDescription>{t.role}</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="italic">"{t.message}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}