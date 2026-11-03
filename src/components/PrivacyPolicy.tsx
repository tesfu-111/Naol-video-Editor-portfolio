import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const { settings } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#F8F9FB] pt-28 pb-20 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-[#E8EAF0] px-4 py-2 text-xs font-bold text-[#15171C] shadow-2xs hover:border-[#635BFF] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </button>

        <div className="rounded-2xl bg-white border border-[#E8EAF0] p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#15171C] tracking-tight">Privacy Policy</h1>
              <span className="text-xs text-[#737783]">Last updated: October 2026</span>
            </div>
          </div>

          <div className="space-y-6 text-sm text-[#15171C] leading-relaxed">
            <p>
              This Privacy Policy explains how <strong>{settings.siteName || 'KINETIC'}</strong> collects, uses, and safeguards the information you provide when using this video editor portfolio and project inquiry service.
            </p>

            <h2 className="text-lg font-bold text-[#15171C] pt-2 border-t border-[#E8EAF0]">
              1. Information We Collect
            </h2>
            <p>
              When you submit a project inquiry or contact request through the portfolio, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#737783]">
              <li>Your full name and contact email address.</li>
              <li>Company or channel name (if provided).</li>
              <li>Requested video editing service, project timeline, and estimated budget.</li>
              <li>Project description, narrative goals, and any raw footage links (e.g., Google Drive, Dropbox).</li>
            </ul>

            <h2 className="text-lg font-bold text-[#15171C] pt-2 border-t border-[#E8EAF0]">
              2. How Your Information Is Used
            </h2>
            <p>
              The submitted information is used exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#737783]">
              <li>Evaluate project feasibility and prepare post-production quotes.</li>
              <li>Communicate directly regarding editing turnaround, scheduling, and asset transfer.</li>
              <li>Maintain client communication records within our secure administrative dashboard.</li>
            </ul>
            <p>
              We do not sell, rent, or lease your contact information or footage links to third parties or marketing brokers.
            </p>

            <h2 className="text-lg font-bold text-[#15171C] pt-2 border-t border-[#E8EAF0]">
              3. Data Storage & Security
            </h2>
            <p>
              Inquiries and portfolio metadata are stored securely using Google Cloud Firestore and protected through role-based access rules. Only authenticated administrators have permission to review client submissions.
            </p>

            <h2 className="text-lg font-bold text-[#15171C] pt-2 border-t border-[#E8EAF0]">
              4. Media & Third-Party Embeds
            </h2>
            <p>
              This portfolio embeds video showcases from YouTube, Vimeo, and direct media storage. Interacting with third-party video players is subject to the respective privacy policies of those providers.
            </p>

            <h2 className="text-lg font-bold text-[#15171C] pt-2 border-t border-[#E8EAF0]">
              5. Contact Information
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy or wish to have your contact inquiry removed from our database, please contact:
              <br />
              <strong className="text-[#635BFF]">{settings.contactEmail || 'tesfukebe000@gmail.com'}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
