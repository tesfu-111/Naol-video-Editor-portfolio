import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUp, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPrivacy: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPrivacy, onOpenAdmin }) => {
  const { settings, isAdmin } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#15171C] text-white border-t border-[#2B2E38] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#2B2E38]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#635BFF] text-white font-black text-xs">
                K
              </span>
              <span className="font-extrabold text-xl tracking-tight text-white">
                {settings.siteName || 'KINETIC'}
              </span>
            </div>
            <p className="mt-2 text-xs text-[#A0A4AE] max-w-sm">
              High-end post-production, dynamic short-form pacing, narrative rhythm, and color grading.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#C5CAD4]">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate('work')} className="hover:text-white transition-colors">
              My Work
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
              About Me
            </button>
            <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
              Services
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Contact
            </button>
            <button onClick={onOpenPrivacy} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-white hover:bg-white/10 transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="h-3.5 w-3.5 text-[#B9F45A]" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737783]">
          <div>
            © {currentYear} {settings.siteName || 'KINETIC'}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>Production-Grade Cloud Firestore & Storage Adapter</span>
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 transition-colors ${
                isAdmin ? 'text-[#B9F45A] font-semibold' : 'text-[#737783] hover:text-white'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>{isAdmin ? 'Admin Portal (Active)' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
