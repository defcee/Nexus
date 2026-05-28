import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <section className="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</p>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
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
};

export default NotFound;
