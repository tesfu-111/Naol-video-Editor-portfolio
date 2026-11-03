import React from 'react';
import { PortfolioProject } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { X, Calendar, MonitorPlay, User, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onSelectProject?: (proj: PortfolioProject) => void;
  allProjects?: PortfolioProject[];
  onInquireService?: (serviceName: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects = [],
  onInquireService,
}) => {
  if (!project) return null;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const isVertical = project.category === 'Reels and TikTok' || project.category === 'Short-Form Content';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#15171C] border border-[#2B2E38] shadow-2xl text-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2B2E38]">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-[#635BFF]/20 px-2.5 py-1 text-xs font-semibold text-[#635BFF] border border-[#635BFF]/30">
              {project.category}
            </span>
            {project.featured && (
              <span className="rounded-md bg-[#B9F45A]/20 px-2.5 py-1 text-xs font-semibold text-[#B9F45A] border border-[#B9F45A]/30">
                Featured
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {prevProject && (
              <button
                onClick={() => onSelectProject?.(prevProject)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Previous Project"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {nextProject && (
              <button
                onClick={() => onSelectProject?.(nextProject)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Next Project"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-2"
              title="Close Modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="mt-6">
          <VideoPlayer
            url={project.fullVideoSource}
            thumbnail={project.thumbnail}
            title={project.title}
            autoplay={true}
            aspectRatio={isVertical ? 'vertical' : 'video'}
            className="shadow-2xl"
          />
        </div>

        {/* Details Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {project.title}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#C5CAD4] leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Metadata Card */}
          <div className="rounded-xl bg-[#1C1F26] border border-[#2B2E38] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#737783]">
              Project Specifications
            </h3>

            {project.clientName && (
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-[#635BFF] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#737783]">Client</span>
                  <span className="text-sm font-semibold text-white">{project.clientName}</span>
                </div>
              </div>
            )}

            {project.editingSoftware && (
              <div className="flex items-start gap-3">
                <MonitorPlay className="h-4 w-4 text-[#B9F45A] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#737783]">Editing Software</span>
                  <span className="text-sm font-semibold text-white">{project.editingSoftware}</span>
                </div>
              </div>
            )}

            {project.projectDate && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-[#D0D4DF] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs text-[#737783]">Release / Date</span>
                  <span className="text-sm font-semibold text-white">{project.projectDate}</span>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#2B2E38]">
              <button
                onClick={() => {
                  onClose();
                  onInquireService?.(project.category);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#635BFF] hover:bg-[#5248e5] py-2.5 px-4 text-xs font-bold text-white shadow-md transition-colors"
              >
                <span>Request Similar Edit</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
