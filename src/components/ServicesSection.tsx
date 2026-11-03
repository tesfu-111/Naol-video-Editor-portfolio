import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ServiceItem } from '../types';
import {
  Sparkles,
  ArrowRight,
  Check,
  Video,
  Film,
  Music,
  Palette,
  Volume2,
  Tv,
  Smartphone,
  PlaySquare,
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForInquiry }) => {
  const { services } = usePortfolio();

  const getServiceIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('short-form') || t.includes('tiktok') || t.includes('reel')) return Smartphone;
    if (t.includes('youtube')) return PlaySquare;
    if (t.includes('social')) return Tv;
    if (t.includes('cinematic') || t.includes('story')) return Film;
    if (t.includes('color')) return Palette;
    if (t.includes('sound') || t.includes('audio')) return Volume2;
    if (t.includes('motion') || t.includes('graphic')) return Sparkles;
    return Video;
  };

  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E8EAF0]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#635BFF] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#15171C] tracking-tight">
            Post-Production Services
          </h2>
          <p className="mt-2 text-base text-[#737783] max-w-2xl">
            High-caliber creative and technical execution tailored for commercial brands, YouTube creators, and independent narrative productions.
          </p>
        </div>

        <div className="hidden md:block">
          <span className="text-xs font-mono text-[#737783] bg-white border border-[#E8EAF0] px-3.5 py-1.5 rounded-full shadow-2xs">
            {services.length} Specialized Offerings
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const IconComponent = getServiceIcon(service.title);
          const featuresList = Array.isArray(service.features)
            ? service.features
            : typeof service.features === 'string'
            ? service.features.split(',').map((f) => f.trim()).filter(Boolean)
            : [];

          return (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E8EAF0] p-6 shadow-xs hover:border-[#635BFF] hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8F9FB] border border-[#E8EAF0] text-[#635BFF] group-hover:bg-[#635BFF] group-hover:text-white transition-colors">
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-bold text-[#15171C] tracking-tight group-hover:text-[#635BFF] transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-[#737783] leading-relaxed">
                  {service.description}
                </p>

                {/* Pricing (Optional) */}
                {service.showPricing && service.priceEstimate && (
                  <div className="mt-4 rounded-lg bg-[#F8F9FB] px-3 py-2 border border-[#E8EAF0]">
                    <span className="block text-[10px] font-mono uppercase text-[#737783]">
                      Estimate
                    </span>
                    <span className="text-sm font-bold text-[#15171C]">
                      {service.priceEstimate}
                    </span>
                  </div>
                )}

                {/* Features List */}
                {featuresList.length > 0 && (
                  <ul className="mt-4 space-y-1.5 pt-3 border-t border-[#E8EAF0]">
                    {featuresList.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-[#15171C]">
                        <Check className="h-3.5 w-3.5 text-[#B9F45A] bg-[#15171C] rounded-full p-0.5 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Inquire Action Button (Preselects Service in Contact form!) */}
              <div className="mt-6 pt-4 border-t border-[#E8EAF0]">
                <button
                  onClick={() => onSelectServiceForInquiry(service.title)}
                  className="w-full flex items-center justify-between rounded-xl bg-[#F8F9FB] group-hover:bg-[#635BFF] group-hover:text-white py-2.5 px-4 text-xs font-bold text-[#15171C] transition-all"
                >
                  <span>Inquire Service</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
