import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MapPin, Zap, Shield, Clock, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      icon: Truck,
      title: "Local Delivery",
      description: "Same-day and next-day delivery within city limits",
      details: [
        "Real-time tracking",
        "Flexible delivery windows",
        "SMS & email notifications",
        "Signature confirmation"
      ],
      image: "/assets/local-delivery.jpg",
      
    },
    {
      icon: MapPin,
      title: "International Shipping",
      description: "Fast and reliable worldwide parcel delivery",
      details: [
        "50+ countries covered",
        "Customs documentation handled",
        "Insurance available",
        "Express & Standard options"
      ],
      image: "/assets/international-shipping.jpg",
      
    },
    {
      icon: Zap,
      title: "Same-Day Express",
      description: "Ultra-fast delivery for urgent shipments",
      details: [
        "2-hour delivery window",
        "Priority handling",
        "Real-time updates",
        "Guaranteed on-time delivery"
      ],
      image: "/assets/same-day-express.jpg",
      
    },
    {
      icon: Shield,
      title: "Diplomatic Delivery",
      description: "Specialized handling for diplomatic shipments and official documents",
      details: [
        "Official document handling",
        "Restricted item compliance",
        "Priority processing",
        "Secure custody"
      ],
      image: "/assets/diplomatic-delivery.jpg",
      
    },
    {
      icon: Shield,
      title: "Fragile Item Handling",
      description: "Specialized care for delicate and valuable items",
      details: [
        "Custom packaging",
        "Shock-absorption padding",
        "Insurance included",
        "Gentle handling guarantee"
      ],
      image: "/assets/fragile-handling.jpg",
      
    },
    {
      icon: Clock,
      title: "Refrigerated Shipping",
      description: "Temperature-controlled delivery for perishables",
      details: [
        "2-8°C temperature control",
        "Real-time temp monitoring",
        "Fresh product guarantee",
        "Specialized handling"
      ],
      image: "/assets/refrigerated-shipping.jpg",
      
    },
    {
      icon: CheckCircle,
      title: "Document Delivery",
      description: "Secure and confidential document shipping",
      details: [
        "Secure sealed envelopes",
        "Signature required",
        "Chain of custody tracking",
        "Legal document certified"
      ],
      image: "/assets/document-delivery.jpg",
     
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Real-Time GPS Tracking",
      description: "Track your package live with GPS coordinates updated every minute",
      image: "/assets/gps-tracking.jpg"
    },
    {
      icon: Clock,
      title: "Estimated Delivery Time",
      description: "Know exactly when your package will arrive with precise time windows",
      image: "/assets/estimated-delivery.jpg"
    },
    {
      icon: Shield,
      title: "24/7 Live Chat Support",
      description: "Round-the-clock customer support ready to help with any questions",
      image: "/assets/live-chat-support.jpg"
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-bg text-white py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-blue-100">Comprehensive parcel delivery solutions for every needAt Nexus Global Parcel, we offer a comprehensive suite of shipping solutions tailored to meet diverse customer needs:
•  Local Delivery: Fast and dependable same-city and regional deliveries that prioritize speed and care for everyday shipping requirements.
•  International Shipping: Expert handling of cross-border shipments with streamlined customs support, ensuring smooth global transit for your parcels.
•  Same-Day Express: Urgent delivery options for time-sensitive items, guaranteeing rapid turnaround without compromising safety or quality.
•  Fragile Item Handling: Specialized packaging and careful transit protocols designed to protect delicate, high-value, or sensitive goods throughout their journey.
•  Refrigerated Shipping: Temperature-controlled solutions for perishable goods, pharmaceuticals, and other climate-sensitive items, maintaining optimal conditions from start to finish.
•  Document Delivery: Secure and confidential courier services for important papers, contracts, and business documents that demand reliability and discretion.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Shipping Solutions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-secondary" />
                          {service.title}
                        </CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {service.details.map((detail, didx) => (
                        <li key={didx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Why Choose Our Services?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx}>
                  <div className="mb-4 rounded-lg overflow-hidden h-48">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Transparent Pricing</h2>
          
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-primary mb-4">Pricing Based On:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Package weight
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Delivery distance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Service type selected
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Insurance (optional)
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-primary mb-4">No Hidden Fees:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Upfront pricing quote
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    No surprise charges
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Discounts for bulk orders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Loyalty rewards program
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ship?</h2>
          <p className="text-xl text-blue-100 mb-8">Get started with Nexus Global Parcel today</p>
          <Link to="/track">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Create Your First Shipment
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
