import { Building2, Twitter, Linkedin, Github, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing! (Mock)');
  };

  const footerLinks = {
    Products: [
      { label: 'Metaverse', href: '/metaverse' },
      { label: 'Properties', href: '/properties' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Tokenization', href: '#' },
    ],
    Resources: [
      { label: 'Documentation', href: '#' },
      { label: 'Whitepaper', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Support', href: '#' },
    ],
  };

  return (
    <footer className="relative mt-20 border-t border-cyan-500/30 bg-gradient-to-b from-slate-900 via-slate-950 to-black backdrop-blur-md">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-teal-500/8 to-blue-500/10 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Left: Logo + Description */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold gradient-text-primary">
                  RealityOneX
                </span>
                <span className="text-xs text-gray-400 -mt-1">
                  Next Gen Ownership.
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 max-w-xs leading-relaxed">
              Revolutionizing real estate investment through blockchain tokenization 
              and immersive metaverse experiences.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500/30 backdrop-blur-md border border-slate-600/60 hover:border-cyan-400/70 flex items-center justify-center transition-all duration-300 group shadow-lg shadow-black/20"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-gray-300 group-hover:text-cyan-300 transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500/30 backdrop-blur-md border border-slate-600/60 hover:border-cyan-400/70 flex items-center justify-center transition-all duration-300 group shadow-lg shadow-black/20"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-300 group-hover:text-cyan-300 transition-colors" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-cyan-500/30 backdrop-blur-md border border-slate-600/60 hover:border-cyan-400/70 flex items-center justify-center transition-all duration-300 group shadow-lg shadow-black/20"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-gray-300 group-hover:text-cyan-300 transition-colors" />
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h3 className="font-display text-sm font-semibold text-gray-100 mb-5">
              Products
            </h3>
            <ul className="space-y-3.5">
              {footerLinks.Products.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-display text-sm font-semibold text-gray-100 mb-5">
              Resources
            </h3>
            <ul className="space-y-3.5">
              {footerLinks.Resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Newsletter */}
          <div>
            <h3 className="font-display text-sm font-semibold text-gray-100 mb-5">
              Newsletter
            </h3>
            <p className="text-sm text-gray-300 mb-5 leading-relaxed">
              Stay updated with the latest property listings and investment opportunities.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-slate-800/80 backdrop-blur-md border-slate-600/60 text-gray-100 placeholder:text-gray-500 focus:border-cyan-400/70 focus:ring-cyan-400/30"
                  required
                />
                <Button
                  type="submit"
                  variant="default"
                  size="icon"
                  className="shrink-0 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-10 border-t border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} RealityOneX. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-cyan-300 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-cyan-300 transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="hover:text-cyan-300 transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

