import React from 'react';
import { Home, ArrowLeft, Film } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-[#15171C] text-white flex items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#635BFF] mb-6">
          <Film className="h-10 w-10 text-[#B9F45A]" />
        </div>
        <h1 className="text-6xl font-black tracking-tight text-white">404</h1>
        <h2 className="text-2xl font-bold text-white mt-2">Cut Not Found</h2>
        <p className="mt-3 text-sm text-[#737783] leading-relaxed">
          The project timeline or page you are searching for does not exist or has been archived from the portfolio.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] px-6 py-3 text-xs font-bold text-white shadow-lg transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
