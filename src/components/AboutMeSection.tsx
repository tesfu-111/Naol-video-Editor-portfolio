import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  User,
  MapPin,
  Clock,
  Download,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Camera,
  Upload,
} from 'lucide-react';

interface AboutMeSectionProps {
  onWorkTogether: () => void;
}

export const AboutMeSection: React.FC<AboutMeSectionProps> = ({ onWorkTogether }) => {
  const { settings, isAdmin, updateSettings, uploadFile } = usePortfolio();
  const [isUploading, setIsUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);

  // Split skills string into array
  const skillsList = settings.aboutSkills
    ? settings.aboutSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : ['DaVinci Resolve', 'Adobe Premiere Pro', 'After Effects', 'Cinema 4D', 'Frame.io'];

  // Parse creative process steps
  const processSteps = settings.aboutCreativeProcess
    ? settings.aboutCreativeProcess
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    : [
        '1. Ingestion & Script Breakdown — Organizing multi-cam takes and locating the emotional anchor.',
        '2. The Structural Assembly — Constructing narrative arc before music or effects.',
        '3. Pacing & Retention Flow — Eliminating dead air, micro-cutting, and shaping visual tempo.',
        '4. Sound & Foley Design — Layering multi-track audio to give every cut physical weight.',
        '5. Precision Color Grading & Delivery — Mastering in DaVinci Resolve for multi-platform delivery.',
      ];

  return (
    <section id="about" className="py-24 bg-white border-y border-[#E8EAF0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#635BFF] mb-2">
            <User className="h-3.5 w-3.5" />
            <span>Behind The Timeline</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#15171C] tracking-tight">
            Creative Director & Lead Editor
          </h2>
        </div>

        {/* Top Grid: Portrait + Biography + Availability */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-2xl bg-[#15171C] border border-[#E8EAF0] shadow-xl aspect-[3/4]">
              <img
                src={
                  settings.aboutPortraitUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'
                }
                alt="Video Editor Portrait"
                className="h-full w-full object-cover grayscale-25 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15171C]/80 via-transparent to-transparent" />

              {/* Quick Admin Photo Change Button */}
              {isAdmin && (
                <div className="absolute top-3 right-3 z-20">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[#15171C]/85 hover:bg-[#635BFF] text-white border border-white/20 px-3 py-1.5 text-xs font-bold shadow-xl backdrop-blur-md transition-all active:scale-95">
                    <Camera className="h-3.5 w-3.5 text-[#B9F45A]" />
                    <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsUploading(true);
                          try {
                            const res = await uploadFile(file);
                            if (res?.url) {
                              await updateSettings({ aboutPortraitUrl: res.url });
                              setPhotoMessage('Portrait updated successfully!');
                              setTimeout(() => setPhotoMessage(null), 3000);
                            }
                          } catch (err) {
                            alert(err instanceof Error ? err.message : 'Photo upload failed');
                          } finally {
                            setIsUploading(false);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              )}

              {photoMessage && (
                <div className="absolute top-12 right-3 z-20 rounded-lg bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-1 shadow-lg animate-in fade-in">
                  {photoMessage}
                </div>
              )}

              {/* Status Banner at bottom of portrait */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 backdrop-blur-md p-3.5 text-xs text-[#15171C] shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#635BFF] animate-ping" />
                  <span className="font-bold">Status:</span>
                  <span className="text-[#635BFF] font-semibold">
                    {settings.aboutAvailability || 'Available Worldwide'}
                  </span>
                </div>
                <MapPin className="h-4 w-4 text-[#737783]" />
              </div>
            </div>

            {/* Resume / CV Download Card */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              {settings.aboutResumeUrl ? (
                <a
                  href={settings.aboutResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#15171C] hover:bg-[#252830] text-white py-3 px-5 text-xs font-semibold shadow-md transition-colors"
                >
                  <Download className="h-4 w-4 text-[#B9F45A]" />
                  <span>Download CV / Experience PDF</span>
                </a>
              ) : (
                <button
                  onClick={onWorkTogether}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#15171C] hover:bg-[#252830] text-white py-3 px-5 text-xs font-semibold shadow-md transition-colors"
                >
                  <Download className="h-4 w-4 text-[#B9F45A]" />
                  <span>Request Full Resume / Showreel</span>
                </button>
              )}

              <button
                onClick={onWorkTogether}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-[#E8EAF0] hover:border-[#635BFF] bg-white py-3 px-5 text-xs font-semibold text-[#15171C] transition-colors"
              >
                <span>Book Call</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#635BFF]" />
              </button>
            </div>
          </div>

          {/* Bio & Experience Column */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            {/* Bio Text */}
            <div className="space-y-4 text-base sm:text-lg text-[#15171C] leading-relaxed">
              <p className="font-medium text-[#15171C] text-xl leading-relaxed">
                {settings.aboutBio}
              </p>
            </div>

            {/* Experience / Track Record Block */}
            <div className="rounded-2xl bg-[#F8F9FB] border border-[#E8EAF0] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737783] mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#635BFF]" />
                <span>Career Track Record & Impact</span>
              </h3>
              <p className="text-sm sm:text-base font-semibold text-[#15171C] leading-relaxed">
                {settings.aboutExperience}
              </p>
            </div>

            {/* Specialties */}
            <div className="rounded-2xl bg-[#F8F9FB] border border-[#E8EAF0] p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737783] mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B9F45A]" />
                <span>Core Editing Specialties</span>
              </h3>
              <p className="text-sm sm:text-base text-[#15171C] leading-relaxed">
                {settings.aboutSpecialties}
              </p>
            </div>

            {/* Skills & Software Badges */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#737783] mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#635BFF]" />
                <span>Primary Software & Production Tools</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#E8EAF0] px-3.5 py-1.5 text-xs font-semibold text-[#15171C] shadow-2xs hover:border-[#635BFF]/40 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#635BFF]" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Creative Process Breakdown */}
        <div className="mt-20 pt-16 border-t border-[#E8EAF0]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#635BFF]">
              Workflow Architecture
            </span>
            <h3 className="text-3xl font-black text-[#15171C] tracking-tight mt-1">
              The Post-Production Process
            </h3>
            <p className="text-xs sm:text-sm text-[#737783] mt-2">
              From raw footage ingest to mastered exports, every frame follows a disciplined 5-stage timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {processSteps.map((stepText, idx) => {
              // Extract step title and description if contains delimiter
              const parts = stepText.split('—');
              const title = parts[0]?.trim() || `Stage ${idx + 1}`;
              const desc = parts[1]?.trim() || '';

              return (
                <div
                  key={idx}
                  className="relative rounded-2xl bg-[#F8F9FB] border border-[#E8EAF0] p-5 flex flex-col justify-between hover:border-[#635BFF] transition-all hover:-translate-y-1"
                >
                  <div>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#635BFF] text-white font-black text-xs">
                      {idx + 1}
                    </span>
                    <h4 className="mt-4 font-bold text-sm text-[#15171C]">{title}</h4>
                    {desc && <p className="mt-2 text-xs text-[#737783] leading-relaxed">{desc}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
