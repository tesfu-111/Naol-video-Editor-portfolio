import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ALL_CATEGORIES } from '../types';
import {
  Send,
  Mail,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Globe,
  Share2,
  ArrowUpRight,
} from 'lucide-react';

interface ContactSectionProps {
  preselectedService?: string;
  onClearPreselectedService?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  preselectedService,
  onClearPreselectedService,
}) => {
  const { settings, services, submitInquiry } = usePortfolio();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [requestedService, setRequestedService] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  // Spam honeypot
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync preselectedService prop
  useEffect(() => {
    if (preselectedService) {
      setRequestedService(preselectedService);
    }
  }, [preselectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Spam honeypot check
    if (honeypot) {
      console.warn('Spam submission filtered.');
      setSubmitSuccess(true);
      return;
    }

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMessage('Please provide a project description with at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await submitInquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        requestedService: requestedService.trim() || 'General Video Production',
        budget: budget.trim() || undefined,
        deadline: deadline.trim() || undefined,
        description: description.trim(),
        referenceLink: referenceLink.trim() || undefined,
      });

      if (success) {
        setSubmitSuccess(true);
        setFullName('');
        setEmail('');
        setCompany('');
        setBudget('');
        setDeadline('');
        setDescription('');
        setReferenceLink('');
        onClearPreselectedService?.();
      } else {
        setErrorMessage('Failed to submit your inquiry. Please try again or email directly.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred submitting the inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { label: 'Email', value: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    { label: 'WhatsApp', value: settings.contactWhatsapp, href: `https://wa.me/${settings.contactWhatsapp?.replace(/[^0-9]/g, '')}` },
    { label: 'Telegram', value: settings.contactTelegram, href: `https://t.me/${settings.contactTelegram?.replace('@', '')}` },
    { label: 'Instagram', value: settings.contactInstagram, href: `https://instagram.com/${settings.contactInstagram?.replace('@', '')}` },
    { label: 'TikTok', value: settings.contactTiktok, href: `https://tiktok.com/@${settings.contactTiktok?.replace('@', '')}` },
    { label: 'YouTube', value: settings.contactYoutube, href: settings.contactYoutube?.startsWith('http') ? settings.contactYoutube : `https://youtube.com/@${settings.contactYoutube}` },
    { label: 'LinkedIn', value: settings.contactLinkedin, href: settings.contactLinkedin?.startsWith('http') ? settings.contactLinkedin : `https://linkedin.com/in/${settings.contactLinkedin}` },
  ].filter((item) => Boolean(item.value));

  return (
    <section id="contact" className="py-24 bg-[#F8F9FB] border-t border-[#E8EAF0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Contact Handles */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#635BFF] mb-2">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Initiate Collaboration</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#15171C] tracking-tight">
              Let's Bring Your Footage To Life
            </h2>
            <p className="mt-4 text-base text-[#737783] leading-relaxed">
              Whether you need high-retention short-form reels, a cinematic brand documentary, or full color finishing, share your project scope below.
            </p>

            {/* Direct Channels */}
            <div className="mt-10 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737783]">
                Direct Contact & Verified Channels
              </h3>

              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-3 rounded-xl bg-white border border-[#E8EAF0] p-4 text-sm font-semibold text-[#15171C] shadow-2xs hover:border-[#635BFF] hover:shadow-md transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#635BFF]/10 text-[#635BFF] group-hover:bg-[#635BFF] group-hover:text-white transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#737783] font-normal">Primary Email</span>
                    <span>{settings.contactEmail}</span>
                  </div>
                </a>
              )}

              {/* Social Channels List */}
              {socialLinks.length > 0 && (
                <div className="rounded-xl bg-white border border-[#E8EAF0] p-4 shadow-2xs">
                  <span className="block text-xs font-bold text-[#737783] mb-3">
                    Active Handles
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#F8F9FB] border border-[#E8EAF0] px-3 py-1.5 text-xs font-semibold text-[#15171C] hover:bg-[#635BFF] hover:text-white transition-colors"
                      >
                        <span>{s.label}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-60" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white border border-[#E8EAF0] p-8 sm:p-10 shadow-lg">
              {submitSuccess ? (
                <div className="text-center py-12 animate-in fade-in duration-300">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#B9F45A]/20 text-[#15171C] mb-4">
                    <CheckCircle2 className="h-8 w-8 text-[#635BFF]" />
                  </div>
                  <h3 className="text-2xl font-black text-[#15171C]">Inquiry Received</h3>
                  <p className="mt-2 text-sm text-[#737783] max-w-md mx-auto">
                    Thank you! Your project details have been securely logged in the system. I will review your footage specs and reply within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#15171C] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#252830]"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field (hidden) */}
                  <input
                    type="text"
                    name="contact_honeypot"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-medium text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#15171C] uppercase tracking-wider mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Naol Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-[#E8EAF0] bg-[#F8F9FB] px-4 py-3 text-sm text-[#15171C] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-[#15171C] uppercase tracking-wider mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="naol@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-[#E8EAF0] bg-[#F8F9FB] px-4 py-3 text-sm text-[#15171C] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Company / Brand */}
                    <div>
                      <label className="block text-xs font-bold text-[#15171C] uppercase tracking-wider mb-2">
                        Company or Channel <span className="text-[#737783] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Naol Media or YouTube Channel"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl border border-[#E8EAF0] bg-[#F8F9FB] px-4 py-3 text-sm text-[#15171C] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition-all"
                      />
                    </div>

                    {/* Requested Service */}
                    <div>
                      <label className="block text-xs font-bold text-[#15171C] uppercase tracking-wider mb-2">
                        Requested Service
                      </label>
                      <select
                        value={requestedService}
                        onChange={(e) => setRequestedService(e.target.value)}
                        className="w-full rounded-xl border border-[#E8EAF0] bg-[#F8F9FB] px-4 py-3 text-sm text-[#15171C] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition-all"
                      >
                        <option value="">Select a Service / Inquiry Type</option>
                        {services.map((srv) => (
                          <option key={srv.id} value={srv.title}>
                            {srv.title}
                          </option>
                        ))}
                        {ALL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Budget */}
                    <div>
                      <label className="block text-xs font-bold text-[#15171C] uppercase tracking-wider mb-2">
                        Estimated Budget <span className="text-[#737783] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. $100 - $300 or Monthly Retainer"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full rounded-xl border border-[#E8EAF0] bg-[#F8F9FB] px-4 py-3 text-sm text-[#15171C] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition-all"
                      />
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-xs font-bold text-[#15171C] uppercase tracking-wider mb-2">
                        Target Deadline <span className="text-[#737783] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Days / End of weeks"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full rounded-xl border border-[#E8EAF0] bg-[#F8F9FB] px-4 py-3 text-sm text-[#15171C] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Reference Link */}
                  <div>
                    <label className="block text-xs font-bold text-[#15171C] uppercase tracking-wider mb-2">
                      Reference Video or Raw Footage Link <span className="text-[#737783] font-normal">(Drive, Dropbox, YouTube)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or reference video link"
                      value={referenceLink}
                      onChange={(e) => setReferenceLink(e.target.value)}
                      className="w-full rounded-xl border border-[#E8EAF0] bg-[#F8F9FB] px-4 py-3 text-sm text-[#15171C] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition-all"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-[#15171C] uppercase tracking-wider mb-2">
                      Project Brief & Narrative Needs <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your footage, the desired pacing, reference creators/moodboards, and target deliverables..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-[#E8EAF0] bg-[#F8F9FB] px-4 py-3 text-sm text-[#15171C] outline-none focus:border-[#635BFF] focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15 transition-all resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white py-4 px-6 text-sm font-bold shadow-lg shadow-[#635BFF]/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting Inquiry...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Project Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
