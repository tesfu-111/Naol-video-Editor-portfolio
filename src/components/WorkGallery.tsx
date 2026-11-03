import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioProject, ProjectCategory, ALL_CATEGORIES } from '../types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { Play, Search, Filter, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

interface WorkGalleryProps {
  onInquireService?: (serviceName: string) => void;
}

export const WorkGallery: React.FC<WorkGalleryProps> = ({ onInquireService }) => {
  const { projects, isAdmin } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);

  // Filter projects by publication status (public only sees published), category, and search query
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // If not admin, hide drafts
      if (!isAdmin && !p.published) return false;

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchSoftware = p.editingSoftware?.toLowerCase().includes(query);
        const matchClient = p.clientName?.toLowerCase().includes(query);
        return matchTitle || matchDesc || matchSoftware || matchClient;
      }

      return true;
    });
  }, [projects, isAdmin, selectedCategory, searchQuery]);

  return (
    <section id="work" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#E8EAF0]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#635BFF] mb-2">
            <Layers className="h-3.5 w-3.5" />
            <span>Curated Portfolio</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#15171C] tracking-tight">
            Selected Works
          </h2>
          <p className="mt-2 text-base text-[#737783] max-w-xl">
            A spectrum of commercial cuts, high-velocity creator edits, long-form narratives, and color finishing.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737783]" />
          <input
            type="text"
            placeholder="Search by title, tool, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-[#E8EAF0] bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-[#15171C] shadow-xs outline-none transition-all focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20"
          />
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
            selectedCategory === 'All'
              ? 'bg-[#15171C] text-white shadow-md'
              : 'bg-white text-[#737783] border border-[#E8EAF0] hover:text-[#15171C] hover:border-[#15171C]/30'
          }`}
        >
          All Projects ({projects.filter((p) => isAdmin || p.published).length})
        </button>

        {ALL_CATEGORIES.map((cat) => {
          const count = projects.filter(
            (p) => (isAdmin || p.published) && p.category === cat
          ).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === cat
                  ? 'bg-[#635BFF] text-white shadow-md'
                  : 'bg-white text-[#737783] border border-[#E8EAF0] hover:text-[#15171C] hover:border-[#635BFF]/40'
              }`}
            >
              {cat} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="mt-16 text-center py-20 bg-white rounded-2xl border border-[#E8EAF0] p-8">
          <SlidersHorizontal className="mx-auto h-12 w-12 text-[#A0A4AE] mb-3" />
          <h3 className="text-lg font-bold text-[#15171C]">No projects found</h3>
          <p className="text-sm text-[#737783] mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No works matched "${searchQuery}". Try a broader term or select another category.`
              : 'No projects currently published in this category.'}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248e5]"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const isVertical =
              project.category === 'Reels and TikTok' || project.category === 'Short-Form Content';

            return (
              <div
                key={project.id}
                onClick={() => setActiveProject(project)}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[#E8EAF0] shadow-xs hover:shadow-xl hover:border-[#635BFF]/30 transition-all duration-300 cursor-pointer"
              >
                {/* Media Thumbnail Container */}
                <div
                  className={`relative w-full overflow-hidden bg-black ${
                    isVertical ? 'aspect-[4/5]' : 'aspect-video'
                  }`}
                >
                  <img
                    src={
                      project.thumbnail ||
                      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#15171C] shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#635BFF] group-hover:text-white">
                      <Play className="h-6 w-6 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-black/60 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="rounded-md bg-[#B9F45A] px-2 py-1 text-[11px] font-black text-[#15171C]">
                        Featured
                      </span>
                    )}
                    {!project.published && (
                      <span className="rounded-md bg-amber-500/90 px-2 py-1 text-[11px] font-bold text-white">
                        Draft
                      </span>
                    )}
                  </div>

                  {project.editingSoftware && (
                    <div className="absolute bottom-3 left-3 text-[11px] font-mono text-white/80 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded">
                      {project.editingSoftware}
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#15171C] group-hover:text-[#635BFF] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#737783] line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8EAF0] flex items-center justify-between text-xs text-[#737783]">
                    <span>{project.clientName || 'Editorial Showcase'}</span>
                    <span className="font-mono">{project.projectDate || '2025'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Video Modal */}
      {activeProject && (
        <ProjectDetailModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
          onSelectProject={(proj) => setActiveProject(proj)}
          allProjects={filteredProjects}
          onInquireService={onInquireService}
        />
      )}
    </section>
  );
};
