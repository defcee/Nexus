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

import {
  Package,
  Truck,
  Globe,
  Clock,
  Shield,
  Zap,
  MapPin,
  MessageCircle,
  ArrowRight,
  Star,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Index() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const services = [
    {
      icon: Truck,
      title: "Local Delivery",
      description: "Same-day delivery within city limits",
      image: "/assets/local-delivery.jpg",
    },
    {
      icon: Globe,
      title: "International Shipping",
      description: "Worldwide parcel delivery service",
      image: "/assets/international-shipping.jpg",
    },
    {
      icon: Clock,
      title: "Same-Day Express",
      description: "Ultra-fast express delivery options",
      image: "/assets/same-day-express.jpg",
    },
    {
      icon: Package,
      title: "Fragile Item Handling",
      description: "Specialized care for delicate packages",
      image: "/assets/fragile-handling.jpg",
    },
    {
      icon: Shield,
      title: "Refrigerated Shipping",
      description: "Temperature-controlled delivery",
      image: "/assets/refrigerated-shipping.jpg",
    },
    {
      icon: Zap,
      title: "Document Delivery",
      description: "Secure important document shipping",
      image: "/assets/document-delivery.jpg",
    },
  ];

  const testimonials = [
    {
      name: "Vanessa Williams",
      role: "E-Commerce Manager",
      text: "Nexus Global has transformed our shipping operations. The real-time tracking and customer support are unmatched.",
      avatar: "/assets/user1.jpg",
      rating: 5,
    },
    {
      name: "Ahmed Hassan",
      role: "Logistics Coordinator",
      text: "We switched to Nexus Global 6 months ago and haven't looked back. Reliable, fast, and their team is always helpful.",
      avatar: "/assets/user2.jpg",
      rating: 5,
    },
    {
      name: "Gareth Johnson",
      role: "Business Owner",
      text: "The most professional parcel delivery service I've used. My customers love the tracking notifications.",
      avatar: "/assets/user3.jpg",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Real-Time GPS Tracking",
      description: "Track your package with live location updates",
      image: "/assets/gps-tracking.jpg",
    },
    {
      icon: Clock,
      title: "Estimated Delivery Time",
      description: "Know exactly when your package arrives",
      image: "/assets/estimated-delivery.jpg",
    },
    {
      icon: MessageCircle,
      title: "24/7 Live Chat Support",
      description: "Always available to help you",
      image: "/assets/live-chat-support.jpg",
    },
  ];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();

    if (trackingNumber.trim()) {
      console.log("Tracking:", trackingNumber);
    }
  };

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/hero-courier.jpg')",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-secondary/80" />
        </div>

        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Track Your Parcel in Real-Time
              </h1>

              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Global parcel delivery with live GPS tracking, guaranteed
                safety, and 24/7 support
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/track">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Start Tracking
                    <ArrowRight size={20} />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white text-white hover:bg-white/10"
                >
                  Create Shipment
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>

            {/* Tracking Card */}
            <div>
              <div className="bg-white/95 backdrop-blur rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Track Your Package
                </h2>

                <form onSubmit={handleTrack} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number
                    </label>

                    <Input
                      type="text"
                      placeholder="e.g., NEX1234567890"
                      value={trackingNumber}
                      onChange={(e) =>
                        setTrackingNumber(e.target.value)
                      }
                      className="border-2 border-primary/30 focus:border-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full gap-2 bg-secondary hover:bg-secondary/90"
                  >
                    Track Now
                    <ArrowRight size={18} />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Why Choose Nexus Global?
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the future of parcel delivery with our
              cutting-edge technology and dedicated service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-8">
                    <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="text-secondary" size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-primary mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Services
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive delivery solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;

              return (
                <Card
                  key={idx}
                  className="border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg group cursor-pointer overflow-hidden"
                >
                  <div className="h-40 overflow-hidden bg-gray-200">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="text-secondary" size={24} />
                    </div>

                    <CardTitle className="text-primary">
                      {service.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Service Coverage
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Operating across major U.S. states with expanding coverage
            </p>
          </div>

          <CoverageMap />

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-primary mb-2">
                Search by City
              </h3>

              <Input
                placeholder="Enter city name..."
                className="mb-3"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />

              <Button className="w-full bg-secondary hover:bg-secondary/90">
                Search
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-primary mb-2">
                Search by Zip Code
              </h3>

              <Input
                placeholder="Enter zip code..."
                className="mb-3"
              />

              <Button className="w-full bg-secondary hover:bg-secondary/90">
                Search
              </Button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-primary mb-2">
                Coverage Stats
              </h3>

              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-bold text-primary">180+</span>{" "}
                  Countries
                </p>

                <p className="text-sm">
                  <span className="font-bold text-primary">500+</span>{" "}
                  Cities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Success Stories & Testimonials
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Hear from our satisfied customers about their experience
              with Nexus Global
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card
                key={idx}
                className="border-primary/20 hover:border-primary/50 transition-all"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold text-primary">
                        {testimonial.name}
                      </p>

                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 italic">
                    "{testimonial.text}"
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

/* =========================
   COVERAGE MAP COMPONENT
========================= */

function CoverageMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    const existingCSS = document.querySelector(
      'link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]'
    );

    if (!existingCSS) {
      const leafletCSS = document.createElement("link");

      leafletCSS.rel = "stylesheet";
      leafletCSS.href =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

      document.head.appendChild(leafletCSS);
    }

    const initializeMap = () => {
      const L = (window as any).L;

      if (!L || !mapContainer.current) return;

      map.current = L.map(mapContainer.current).setView(
        [37.0902, -95.7129],
        4
      );

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }
      ).addTo(map.current);

      const coverageAreas = [
        {
          lat: 40.7128,
          lng: -74.006,
          name: "New York",
          state: "New York",
        },
        {
          lat: 31.9686,
          lng: -99.9018,
          name: "Texas",
          state: "Texas",
        },
        {
          lat: 36.7783,
          lng: -119.4179,
          name: "California",
          state: "California",
        },
      ];

      coverageAreas.forEach((location) => {
        L.circleMarker([location.lat, location.lng], {
          radius: 10,
          fillColor: "#00a8e8",
          color: "#001a4d",
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.8,
        })
          .bindPopup(`
            <strong>${location.name}</strong><br/>
            ${location.state}<br/>
            <em>Service Available</em>
          `)
          .addTo(map.current);
      });

      const bounds = coverageAreas.map((loc) => [
        loc.lat,
        loc.lng,
      ]);

      map.current.fitBounds(bounds, {
        padding: [80, 80],
      });
    };

    if ((window as any).L) {
      initializeMap();
    } else {
      const leafletScript = document.createElement("script");

      leafletScript.src =
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

      leafletScript.async = true;
      leafletScript.onload = initializeMap;

      document.body.appendChild(leafletScript);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div
        ref={mapContainer}
        className="aspect-video bg-gray-200 w-full"
        style={{ minHeight: "450px" }}
      />
    </div>
  );
}