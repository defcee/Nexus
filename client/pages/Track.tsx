import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import {
  MapPin,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import TrackingMap from "@/components/TrackingMap";

import { packageAPI } from "@/lib/api";

interface TrackingHistory {
  status: string;
  location: string;
  timestamp: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface TrackingData {
  trackingNumber: string;
  sender: string;
  receiver: string;
  status: string;
  eta: string;
  currentLocation: string;
  weight: string;
  price: string;

  coordinates: {
    lat: number;
    lng: number;
  };

  history: TrackingHistory[];
}

export default function Track() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // TRACK PACKAGE (REAL API)
  // ==============================
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setTrackingData(null);

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    setLoading(true);

    try {
      const res = await packageAPI.track(trackingNumber.trim());

      // backend returns raw package row → normalize safely
      const pkg = res;

      if (!pkg) {
        setError("Tracking number not found. Please try again.");
        setLoading(false);
        return;
      }

      // build history from available fields (DB-safe fallback)
    const history: TrackingHistory[] = [
  {
    status: pkg.status,
    location: pkg.current_location || "In Transit",
    timestamp: pkg.updated_at || pkg.created_at || new Date().toISOString(),
  },
];

      const mapped: TrackingData = {
        trackingNumber: pkg.tracking_number,
        sender: pkg.sender_name,
        receiver: pkg.receiver_name,
        status: pkg.status,
        eta: pkg.eta,
        currentLocation: pkg.current_location,
        weight: `${pkg.weight} kg`,
        price: `$${pkg.price}`, // ✅ FIXED CURRENCY

        coordinates: pkg.lat && pkg.lng
  ? {
      lat: Number(pkg.lat),
      lng: Number(pkg.lng),
    }
  : {
      lat: 39.8283,
      lng: -98.5795,
    },

        history,
      };

      setTrackingData(mapped);
    } catch (err: any) {
      setError(err.message || "Tracking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UI HELPERS (UNCHANGED STYLE)
  // ==============================
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="text-green-600" size={24} />;
      case "In Transit":
        return <Truck className="text-blue-600" size={24} />;
      case "Out for Delivery":
        return <Truck className="text-orange-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="container">

          {/* SEARCH */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 mb-12 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Track Your Parcel
            </h1>

            <p className="text-blue-100 mb-8">
              Enter your tracking number to see real-time updates
            </p>

            <form onSubmit={handleTrack} className="flex gap-3 flex-col md:flex-row">
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                placeholder="Enter tracking number (e.g., NEX1234567890)"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />

              <Button
                type="submit"
                disabled={loading}
                className="gap-2 bg-white text-primary hover:bg-gray-100"
              >
                <Search size={18} />
                {loading ? "Searching..." : "Track Now"}
              </Button>
            </form>

            {error && (
              <Alert className="mt-6 bg-red-100/20 border-red-300/30">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-100">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* RESULTS */}
          {trackingData && (
            <div className="space-y-8">

              {/* STATUS CARD */}
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>
                        Tracking: {trackingData.trackingNumber}
                      </CardTitle>
                      <CardDescription>
                        {trackingData.sender} → {trackingData.receiver}
                      </CardDescription>
                    </div>

                    <div className={`px-4 py-2 rounded-lg ${getStatusColor(trackingData.status)}`}>
                      {getStatusIcon(trackingData.status)}
                      {trackingData.status}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">
                      <MapPin size={16} className="inline mr-1" />
                      {trackingData.currentLocation}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">ETA</p>
                    <p className="font-semibold">
                      <Clock size={16} className="inline mr-1" />
                      {trackingData.eta}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-semibold">{trackingData.weight}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold">{trackingData.price}</p>
                  </div>
                </CardContent>
              </Card>

              {/* MAP */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Tracking</CardTitle>
                </CardHeader>

                <CardContent>
                  <TrackingMap
                    currentLocation={trackingData.coordinates}
                    locationName={trackingData.currentLocation}
                    routeHistory={trackingData.history.map((h) => ({
                      lat: h.coordinates?.lat || trackingData.coordinates.lat,
                      lng: h.coordinates?.lng || trackingData.coordinates.lng,
                      location: h.location,
                      status: h.status,
                    }))}
                  />
                </CardContent>
              </Card>

              {/* HISTORY */}
              <Card>
                <CardHeader>
                  <CardTitle>Tracking History</CardTitle>
                </CardHeader>

                <CardContent>
                  {trackingData.history.map((h, i) => (
                    <div key={i} className="mb-4">
                      <p className="font-semibold">{h.status}</p>
                      <p className="text-gray-600">{h.location}</p>
                      <p className="text-xs text-gray-400">{h.timestamp}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}