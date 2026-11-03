import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, Shield, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, onOpenAdmin }) => {
  const { settings, isAdmin } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'My Work' },
    { id: 'about', label: 'About Me' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#15171C]/95 backdrop-blur-md border-b border-[#2B2E38] shadow-lg py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand / Logo */}
        <button
          onClick={() => handleLinkClick('home')}
          className="group flex items-center gap-2.5 text-left text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635BFF] text-white font-black text-sm tracking-tighter shadow-md group-hover:scale-105 transition-transform">
            N
          </span>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-white text-base leading-none">
              {settings.logoText || settings.siteName || 'NAOL / EDITS'}
            </span>
            <span className="text-[10px] font-medium tracking-widest text-[#B9F45A] uppercase mt-0.5">
              Post-Production
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#D0D4DF] hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B9F45A] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Admin */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={() => handleLinkClick('contact')}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#B9F45A]" />
          </button>

          <button
            onClick={onOpenAdmin}
            title={isAdmin ? 'Admin Dashboard (Active)' : 'Admin Login'}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              isAdmin
                ? 'bg-[#B9F45A]/15 text-[#B9F45A] border border-[#B9F45A]/30'
                : 'text-[#A0A4AE] hover:text-white hover:bg-white/10'
            }`}
          >
            
            
            
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onOpenAdmin}
            className={`p-2 rounded-lg text-xs ${
              isAdmin ? 'text-[#B9F45A]' : 'text-[#D0D4DF]'
            }`}
            aria-label="Admin"
          >
            <Shield className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[60px] bg-[#15171C] border-b border-[#2B2E38] p-6 shadow-2xl md:hidden animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left text-lg font-medium transition-colors ${
                  activeSection === link.id ? 'text-[#B9F45A] font-bold' : 'text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-[#2B2E38] flex flex-col gap-3">
              <button
                onClick={() => handleLinkClick('contact')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] py-3 text-sm font-semibold text-white shadow-lg"
              >
                <span>Book a Consultation</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 py-2.5 text-xs text-[#D0D4DF]"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>{isAdmin ? 'Open Admin CMS' : 'Editor Admin Login'}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
