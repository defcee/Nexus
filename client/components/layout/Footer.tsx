import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/logo.png"
                alt="Nexus Global Parcel Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to generated logo if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div
                className="w-8 h-8 bg-white rounded flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <div className="w-4 h-4 bg-primary rounded-sm transform -rotate-45" />
              </div>
              <div>
                <div className="text-lg font-bold">NEXUS</div>
                <div className="text-xs font-semibold text-blue-100">GLOBAL PARCEL</div>
              </div>
            </div>
            <p className="text-sm text-blue-100">
              Your trusted global parcel delivery partner
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Parcel
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>Local Delivery</li>
              <li>Diplomatic Delivery</li>
              <li>International Shipping</li>
              <li>Express Delivery</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-blue-100">
              <div className="flex items-start gap-2">
                <a
                  href="https://wa.me/19094967913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>+1 (909) 496-7913</span>
                </a>
              </div>
              <div className="flex items-start gap-2">
                <a
                  href="mailto:support@nexusglog.com"
                  className="flex items-start gap-2 hover:text-white transition-colors"
                >
                  <Mail size={16} className="mt-0.5 flex-shrink-0" />
                  <span>support@nexusglog.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-400/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-100">
            <p>&copy; 2024 Nexus Global Parcel Services. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
