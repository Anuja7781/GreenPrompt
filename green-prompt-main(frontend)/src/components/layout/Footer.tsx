import { Link } from "react-router-dom";
import { Leaf, Linkedin, Instagram } from "lucide-react";

const footerLinks = [
  { name: "About", path: "/about" },
  { name: "Features", path: "/analyzer" },
  { name: "Contact", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy" },
];

export const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-sage-100">
      <div className="eco-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-sage-50">
                Green<span className="text-primary">Prompt</span> AI
              </span>
            </Link>
            <p className="text-sm text-sage-200/70 text-center md:text-left">
              Building a Sustainable AI Future
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-sage-200/70 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-800 text-sage-200/70 hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-800 text-sage-200/70 hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-charcoal-700 text-center">
          <p className="text-xs text-sage-200/50">
            © {new Date().getFullYear()} GreenPrompt AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
