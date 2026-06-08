import { Building2, ShieldCheck, Twitter, Github, MessageSquare, Send, Cpu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const footerLinks = {
    Products: [
      { label: 'Metaverse Lobby', href: '/metaverse' },
      { label: 'Asset Marketplace', href: '/properties' },
      { label: 'Investor Dashboard', href: '/dashboard' },
      { label: 'Tokenization Suite', href: '/dashboard' },
    ],
    Resources: [
      { label: 'Verified Listings', href: '/properties' },
      { label: 'Solana Devnet Explorer', href: 'https://explorer.solana.com/?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899', isExternal: true },
      { label: 'R1X Token Schema', href: '/dashboard' },
      { label: 'WebXR / VR Setup', href: '/metaverse' },
    ],
  };

  return (
    <footer className="relative mt-28 border-t border-cyan-500/15 bg-slate-950/75 backdrop-blur-2xl overflow-hidden shadow-[0_-10px_50px_rgba(6,182,212,0.05)]">
      {/* Cinematic animated background lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>
      
      <div className="relative container mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Left: Brand Identity Card */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:scale-105 group-hover:shadow-cyan-500/20 transition-all duration-300">
                <Building2 className="w-6 h-6 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent group-hover:to-white transition-colors duration-300">
                  RealityOneX
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-cyan-400/80 -mt-0.5">
                  Next Gen Ownership
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Revolutionizing real estate investment through secure Solana blockchain tokenization and immersive WebXR metaverse digital twins.
            </p>
            {/* Social Links Panel */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: MessageSquare, href: 'https://discord.com', label: 'Discord' },
                { icon: Send, href: 'https://telegram.org', label: 'Telegram' },
                { icon: Github, href: 'https://github.com', label: 'GitHub' }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-100 uppercase tracking-[0.24em] mb-6">
              Products
            </h3>
            <ul className="space-y-4">
              {footerLinks.Products.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group flex items-center text-sm text-slate-400 hover:text-cyan-300 transition-all duration-200"
                  >
                    {/* Hover indicator dot */}
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-0 opacity-0 group-hover:mr-2.5 group-hover:opacity-100 transition-all duration-300" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-100 uppercase tracking-[0.24em] mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              {footerLinks.Resources.map((link) => (
                <li key={link.label}>
                  {link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center text-sm text-slate-400 hover:text-cyan-300 transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-0 opacity-0 group-hover:mr-2.5 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200 flex items-center gap-1.5">
                        {link.label}
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="group flex items-center text-sm text-slate-400 hover:text-cyan-300 transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-0 opacity-0 group-hover:mr-2.5 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: High-Tech Network Status Monitor */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-100 uppercase tracking-[0.24em] mb-6">
              Prototype Network
            </h3>
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 space-y-4 shadow-inner">
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Secure transaction ledger and asset vault contracts are fully validated against local or devnet Solana RPC.
              </p>
              
              <div className="pt-2 space-y-2.5 border-t border-white/5">
                {/* Active contract status */}
                <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-mono">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Contracts: Active</span>
                  </div>
                </div>

                {/* Local RPC status */}
                <div className="flex items-center gap-2.5 text-xs text-cyan-400 font-mono">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Solana RPC: Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & meta info row */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-light">
            © {new Date().getFullYear()} RealityOneX. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-light">
            <span className="hover:text-cyan-400 cursor-pointer transition-colors duration-200">Security Audit</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="hover:text-cyan-400 cursor-pointer transition-colors duration-200">Legal Terms</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-slate-400">Educational MVP Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
