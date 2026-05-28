import { useState } from "react";
import { Link } from "react-router-dom";

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

  const handleTrack = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!trackingNumber.trim()) return;

    console.log("Tracking:", trackingNumber);
  };

  // ============================================
  // SERVICES DATA
  // ============================================

  const services = [
    {
      title: "GPS Tracking",
      image: "/assets/gps-tracking.jpg",
      description:
        "Track shipments in real-time with live GPS updates.",
    },
    {
      title: "Estimated Delivery",
      image: "/assets/estimated-delivery.jpg",
      description:
        "AI-powered delivery estimates with precise timing.",
    },
    {
      title: "Live Chat Support",
      image: "/assets/live-chat-support.jpg",
      description:
        "24/7 customer support for all shipment inquiries.",
    },
    {
      title: "Local Delivery",
      image: "/assets/local-delivery.jpg",
      description:
        "Fast and secure city-wide parcel delivery services.",
    },
    {
      title: "International Shipping",
      image: "/assets/international-shipping.jpg",
      description:
        "Reliable worldwide logistics and freight solutions.",
    },
    {
      title: "Same Day Express",
      image: "/assets/same-day-express.jpg",
      description:
        "Urgent parcel delivery completed within hours.",
    },
    {
      title: "Fragile Handling",
      image: "/assets/fragile-handling.jpg",
      description:
        "Specialized packaging and handling for delicate items.",
    },
    {
      title: "Refrigerated Shipping",
      image: "/assets/refrigerated-shipping.jpg",
      description:
        "Temperature-controlled logistics for perishables.",
    },
    {
      title: "Document Delivery",
      image: "/assets/document-delivery.jpg",
      description:
        "Secure and confidential document transportation.",
    },
  ];

  // ============================================
  // TESTIMONIALS
  // ============================================

  const testimonials = [
    {
      name: "Omar Al-Farsi",
      role: "Import & Export Manager",
      image: "/assets/user2.jpg", // Arabian Male
      message:
        "Nexus Global has completely transformed how we manage international cargo deliveries.",
    },
    {
      name: "Sophia Williams",
      role: "E-commerce Entrepreneur",
      image: "/assets/user1.jpg", // Caucasian Female
      message:
        "The real-time tracking and support system gives my customers complete confidence.",
    },
    {
      name: "Marcus Johnson",
      role: "Supply Chain Coordinator",
      image: "/assets/user3.jpg", // Black American Male
      message:
        "Reliable, fast, and professional. The dashboard makes shipment management seamless.",
    },
  ];

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/hero-courier.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-secondary/80" />
        </div>

        <div className="container relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">
              Track Your Parcel in Real-Time
            </h1>

            <p className="mb-6 text-blue-100">
              Global parcel delivery with live GPS tracking
            </p>

            <Link to="/track">
              <Button size="lg" className="gap-2">
                Start Tracking
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Track Package
            </h2>

            <form
              onSubmit={handleTrack}
              className="space-y-3"
            >
              <Input
                placeholder="Tracking Number"
                value={trackingNumber}
                onChange={(e) =>
                  setTrackingNumber(e.target.value)
                }
              />

              <Button
                type="submit"
                className="w-full"
              >
                Track Now
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

            <p className="text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade logistics solutions for
              local and international deliveries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <CardHeader>
                  <CardTitle>
                    {service.title}
                  </CardTitle>
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

      {/* MAP SECTION */}
      <section className="container py-16">
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="h-[500px] w-full">
            <MapContainer
              center={[39.8283, -98.5795]}
              zoom={4}
              scrollWheelZoom={false}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[40.7128, -74.006]}>
                <Popup>New York Coverage</Popup>
              </Marker>

              <Marker position={[34.0522, -118.2437]}>
                <Popup>California Coverage</Popup>
              </Marker>

              <Marker position={[29.7604, -95.3698]}>
                <Popup>Texas Coverage</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Trusted by Businesses Worldwide
            </h2>

            <p className="text-gray-600">
              Hear from clients using Nexus Global
              Logistics daily.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg"
              >
                <CardHeader className="items-center">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary/10 mb-4"
                  />

                  <CardTitle>{t.name}</CardTitle>

                  <CardDescription>
                    {t.role}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 italic">
                    "{t.message}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}