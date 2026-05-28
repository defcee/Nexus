import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <Layout>
      <section className="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="text-secondary" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
            <p className="text-gray-600 mb-8">
              This page is coming soon! We're building something amazing here. Please check back shortly or continue exploring other sections of our site.
            </p>
            <Link to="/">
              <Button className="gap-2 bg-secondary hover:bg-secondary/90">
                <ArrowLeft size={18} /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
