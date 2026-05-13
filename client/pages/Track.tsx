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

interface TrackingData {
  trackingNumber: string;
  sender: string;
  receiver: string;
  status: "Pending" | "In Transit" | "Out for Delivery" | "Delivered";
  eta: string;
  currentLocation: string;
  weight: string;
  price: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  history: Array<{
    status: string;
    location: string;
    timestamp: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
}

export default function Track() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mockTrackingData: Record<string, TrackingData> = {
    "NEX1234567890": {
      trackingNumber: "NEX1234567890",
      sender: "John Doe",
      receiver: "Jane Smith",
      status: "In Transit",
      eta: "2024-01-25 14:30",
      currentLocation: "Lagos, Nigeria",
      weight: "2.5 kg",
      price: "$5,500",
      coordinates: { lat: 6.5244, lng: 3.3792 }, // Lagos
      history: [
        {
          status: "Pending",
          location: "Port Harcourt, Nigeria",
          timestamp: "2024-01-20 09:00",
          coordinates: { lat: 4.7521, lng: 7.0074 },
        },
        {
          status: "Picked Up",
          location: "Port Harcourt, Nigeria",
          timestamp: "2024-01-20 11:30",
          coordinates: { lat: 4.7521, lng: 7.0074 },
        },
        {
          status: "In Transit",
          location: "Enugu, Nigeria",
          timestamp: "2024-01-21 15:45",
          coordinates: { lat: 6.4381, lng: 7.5021 },
        },
        {
          status: "In Transit",
          location: "Lagos, Nigeria",
          timestamp: "2024-01-22 10:20",
          coordinates: { lat: 6.5244, lng: 3.3792 },
        },
      ],
    },
  };

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
      // Simulate API call
      setTimeout(() => {
        const data = mockTrackingData[trackingNumber.toUpperCase()];
        if (data) {
          setTrackingData(data);
        } else {
          setError("Tracking number not found. Please check and try again.");
        }
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

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
          {/* Search Section */}
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 mb-12 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Track Your Parcel</h1>
            <p className="text-blue-100 mb-8">
              Enter your tracking number to see real-time updates
            </p>

            <form onSubmit={handleTrack} className="flex gap-3 flex-col md:flex-row">
              <Input
                type="text"
                placeholder="Enter tracking number (e.g., NEX1234567890)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 bg-white text-primary hover:bg-gray-100 whitespace-nowrap"
              >
                <Search size={18} /> {loading ? "Searching..." : "Track Now"}
              </Button>
            </form>

            {error && (
              <Alert className="mt-6 bg-red-100/20 border-red-300/30">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-100">{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Tracking Results */}
          {trackingData && (
            <div className="space-y-8">
              {/* Main Status Card */}
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        Tracking Number: {trackingData.trackingNumber}
                      </CardTitle>
                      <CardDescription>
                        Shipped from {trackingData.sender} to {trackingData.receiver}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 ${getStatusColor(trackingData.status)}`}>
                        {getStatusIcon(trackingData.status)}
                        {trackingData.status}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="border-l-2 border-primary/20 pl-4">
                      <p className="text-sm text-gray-600 mb-1">Current Location</p>
                      <p className="font-semibold text-primary">
                        <MapPin className="inline mr-2" size={18} />
                        {trackingData.currentLocation}
                      </p>
                    </div>
                    <div className="border-l-2 border-primary/20 pl-4">
                      <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                      <p className="font-semibold text-primary">
                        <Clock className="inline mr-2" size={18} />
                        {trackingData.eta}
                      </p>
                    </div>
                    <div className="border-l-2 border-primary/20 pl-4">
                      <p className="text-sm text-gray-600 mb-1">Weight</p>
                      <p className="font-semibold text-primary">
                        <Package className="inline mr-2" size={18} />
                        {trackingData.weight}
                      </p>
                    </div>
                    <div className="border-l-2 border-primary/20 pl-4">
                      <p className="text-sm text-gray-600 mb-1">Shipping Cost</p>
                      <p className="font-semibold text-primary">{trackingData.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

                            {/* Status Timeline */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Tracking History</CardTitle>
                  <CardDescription>
                    Complete timeline of your shipment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {trackingData.history.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-primary mb-2" />
                          {idx < trackingData.history.length - 1 && (
                            <div className="w-0.5 h-16 bg-primary/30" />
                          )}
                        </div>
                        <div className="pt-1 pb-6">
                          <p className="font-semibold text-primary">{item.status}</p>
                          <p className="text-gray-600 text-sm">{item.location}</p>
                          <p className="text-gray-500 text-xs mt-1">{item.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If you have questions about your shipment, feel free to contact our support team.
                  </p>
                  <Button className="gap-2 bg-secondary hover:bg-secondary/90">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sample Tracking Number */}
          {!trackingData && !error && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-gray-700 mb-2">
                Try this sample tracking number to see the tracking system in action:
              </p>
              <Button
                onClick={() => {
                  setTrackingNumber("NEX1234567890");
                  handleTrack({
                    preventDefault: () => {},
                  } as React.FormEvent);
                }}
                variant="outline"
                className="gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <Copy size={18} /> Use NEX1234567890
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

// Simple copy icon component since it's not imported
const Copy = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);
