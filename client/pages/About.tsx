import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Globe, Users, TrendingUp } from "lucide-react";

export default function About() {
  const stats = [
    { icon: Globe, label: "Countries Served", value: "50+" },
    { icon: Users, label: "Happy Customers", value: "100K+" },
    { icon: TrendingUp, label: "Deliveries", value: "1M+" },
    { icon: Award, label: "Awards Won", value: "15+" },
  ];

  const team = [
    {
      name: "CEO & Founder",
      role: "Vision & Leadership",
      image: "/assets/team-ceo.jpg"
    },
    {
      name: "Operations Manager",
      role: "Logistics Excellence",
      image: "/assets/team-operations.jpg"
    },
    {
      name: "Customer Care Head",
      role: "24/7 Support",
      image: "/assets/team-support.jpg"
    },
    {
      name: "Technology Director",
      role: "Innovation",
      image: "/assets/team-technology.jpg"
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-bg text-white py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Nexus Global Parcel</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Why Nexus Global Parcel” (or “Trusted by Businesses & Individuals Worldwide”)
We stand apart through our unwavering commitment to reliability, innovation, and customer satisfaction. With a robust global network, state-of-the-art tracking, and a dedicated support team available 24/7, Nexus Global Parcel transforms complex logistics into a simple, stress-free experience. Whether you are an individual sending a personal package or a business managing high-volume shipments, we deliver excellence with every parcel.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2020, Nexus Global Parcel started with a simple mission: to make parcel delivery fast, reliable, and transparent for everyone. What began as a local delivery service has grown into an international logistics powerhouse.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Today, we serve over 100,000 customers across 50 countries, delivering more than 1 million parcels annually. Our commitment to excellence hasn't changed—it's only grown stronger.
              </p>
            </div>
            <img
              src="/assets/warehouse.jpg"
              alt="Nexus Global Warehouse"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-16">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className="w-12 h-12 text-secondary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Why Choose Nexus Global?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="/assets/fast-delivery.jpg"
              alt="Fast Delivery"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-primary mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Same-day delivery in major cities with express options available</p>
            </div>

            <div className="text-center">
              <img
                src="/assets/secure-delivery.jpg"
              alt="Secure Delivery"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-primary mb-2">100% Secure</h3>
              <p className="text-gray-600">Insurance, GPS tracking, and real-time updates on every delivery</p>
            </div>

            <div className="text-center">
              <img
                src="/assets/customer-support.jpg"
              alt="Customer Support"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-primary mb-2">Expert Support</h3>
              <p className="text-gray-600">24/7 multilingual customer support ready to help anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Leadership Team</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-primary">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Excellence?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of satisfied customers using Nexus Global Parcel</p>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            Get Started Today
          </Button>
        </div>
      </section>
    </Layout>
  );
}
