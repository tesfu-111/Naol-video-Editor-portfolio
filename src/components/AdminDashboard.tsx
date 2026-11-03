import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioProject, ServiceItem, ALL_CATEGORIES, ProjectCategory } from '../types';
import {
  LayoutDashboard,
  Film,
  Image as ImageIcon,
  Home,
  User,
  Sparkles,
  Phone,
  Inbox,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  Eye,
  EyeOff,
  Upload,
  ArrowUp,
  ArrowDown,
  Copy,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

type TabType =
  | 'overview'
  | 'projects'
  | 'media'
  | 'homepage'
  | 'about'
  | 'services'
  | 'contact'
  | 'inquiries'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const {
    settings,
    projects,
    services,
    inquiries,
    mediaAssets,
    updateSettings,
    saveProject,
    deleteProject,
    saveService,
    deleteService,
    updateInquiryStatus,
    deleteInquiry,
    uploadFile,
    deleteMedia,
    logout,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // PROJECT EDIT MODAL STATE
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // SERVICE EDIT MODAL STATE
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // HOMEPAGE FORM STATE
  const [homeForm, setHomeForm] = useState({ ...settings });

  // ABOUT FORM STATE
  const [aboutForm, setAboutForm] = useState({ ...settings });

  // CONTACT FORM STATE
  const [contactForm, setContactForm] = useState({ ...settings });

  // GENERAL SETTINGS FORM STATE
  const [generalForm, setGeneralForm] = useState({ ...settings });

  // Sync forms whenever settings update
  React.useEffect(() => {
    setHomeForm({ ...settings });
    setAboutForm({ ...settings });
    setContactForm({ ...settings });
    setGeneralForm({ ...settings });
  }, [settings]);

  // Media Picker modal target
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'heroImage' | 'heroVideo' | 'aboutPortrait' | null>(null);

  // MEDIA FILTER
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');

  // Trigger feedback banner
  const notifySaved = (msg = 'Changes saved successfully to Firestore') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Generic file uploader handler
  const handleGenericUpload = async (
    file: File,
    onSuccess: (url: string) => void
  ) => {
    setUploadLoading(true);
    setUploadError(null);
    try {
      const res = await uploadFile(file);
      if (res?.url) {
        onSuccess(res.url);
        notifySaved('File uploaded and saved successfully!');
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#15171C] text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#2B2E38] bg-[#1C1F26] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635BFF] text-white font-black text-sm">
            K
          </span>
          <div>
            <h1 className="text-base font-bold text-white leading-none">
              KINETIC CMS
            </h1>
            <span className="text-[11px] font-mono text-[#B9F45A]">
              Editor Production Suite
            </span>
          </div>
        </div>

        {/* Global Save Feedback Alert */}
        {saveStatus && (
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-[#B9F45A]/20 border border-[#B9F45A]/30 px-3 py-1.5 text-xs font-semibold text-[#B9F45A] animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>{saveStatus}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            Preview Live Site
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 px-3.5 py-2 text-xs font-semibold text-red-400 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#2B2E38] bg-[#181A20] p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'projects', label: 'Portfolio Works', icon: Film, badge: projects.length },
            { id: 'media', label: 'Media Library', icon: ImageIcon, badge: mediaAssets.length },
            { id: 'homepage', label: 'Hero & Background', icon: Home },
            { id: 'about', label: 'About Me', icon: User },
            { id: 'services', label: 'Services', icon: Sparkles, badge: services.length },
            { id: 'contact', label: 'Contact Details', icon: Phone },
            {
              id: 'inquiries',
              label: 'Client Inquiries',
              icon: Inbox,
              badge: inquiries.filter((i) => i.status === 'new').length || undefined,
              badgeColor: 'bg-[#635BFF]',
            },
            { id: 'settings', label: 'Site Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#635BFF] text-white shadow-md'
                    : 'text-[#C5CAD4] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeColor
                        ? 'bg-[#635BFF] text-white'
                        : 'bg-white/10 text-[#C5CAD4]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-6xl overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white">Editorial Studio Overview</h2>
                <p className="text-xs text-[#737783] mt-1">
                  Summary of published video projects, pending inquiries, and active storage.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-5">
                  <span className="text-xs font-mono uppercase text-[#737783]">Total Works</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-3xl font-black text-white">{projects.length}</span>
                    <Film className="h-5 w-5 text-[#635BFF]" />
                  </div>
                  <span className="text-[11px] text-[#A0A4AE] mt-2 block">
                    {projects.filter((p) => p.published).length} published • {projects.filter((p) => !p.published).length} drafts
                  </span>
                </div>

                <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-5">
                  <span className="text-xs font-mono uppercase text-[#737783]">New Inquiries</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-3xl font-black text-[#B9F45A]">
                      {inquiries.filter((i) => i.status === 'new').length}
                    </span>
                    <Inbox className="h-5 w-5 text-[#B9F45A]" />
                  </div>
                  <span className="text-[11px] text-[#A0A4AE] mt-2 block">
                    {inquiries.length} total client submissions
                  </span>
                </div>

                <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-5">
                  <span className="text-xs font-mono uppercase text-[#737783]">Media Assets</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-3xl font-black text-white">{mediaAssets.length}</span>
                    <ImageIcon className="h-5 w-5 text-[#635BFF]" />
                  </div>
                  <span className="text-[11px] text-[#A0A4AE] mt-2 block">
                    Direct uploads & thumbnails
                  </span>
                </div>

                <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-5">
                  <span className="text-xs font-mono uppercase text-[#737783]">Hero Mode</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xl font-bold uppercase text-[#B9F45A]">
                      {settings.heroBgMode}
                    </span>
                    <Home className="h-5 w-5 text-[#B9F45A]" />
                  </div>
                  <span className="text-[11px] text-[#A0A4AE] mt-2 block">
                    {settings.heroBgMode === 'video' ? 'Muted Looping MP4' : 'Editorial Photography'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6">
                <h3 className="text-sm font-bold text-white mb-4">Quick Studio Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setIsCreatingProject(true);
                      setEditingProject({
                        id: `proj-${Date.now()}`,
                        title: '',
                        description: '',
                        category: 'Short-Form Content',
                        thumbnail: '',
                        fullVideoSource: '',
                        videoType: 'direct',
                        published: true,
                        featured: false,
                        order: projects.length + 1,
                        editingSoftware: 'DaVinci Resolve',
                        projectDate: new Date().getFullYear().toString(),
                      });
                      setActiveTab('projects');
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#5248e5]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Project Cut</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('homepage')}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    <Home className="h-4 w-4" />
                    <span>Switch Hero Background</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('media')}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Raw Media</span>
                  </button>
                </div>
              </div>

              {/* Recent Inquiries List */}
              <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Recent Inquiries</h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-[#B9F45A] hover:underline"
                  >
                    View All ({inquiries.length})
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <p className="text-xs text-[#737783] py-4">No client inquiries received yet.</p>
                ) : (
                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className="flex items-center justify-between rounded-xl bg-[#15171C] p-4 border border-[#2B2E38]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{inq.fullName}</span>
                            {inq.status === 'new' && (
                              <span className="rounded-full bg-[#635BFF] px-2 py-0.5 text-[10px] font-bold text-white">
                                New
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#737783] block mt-0.5">
                            {inq.requestedService} • {inq.email}
                          </span>
                        </div>
                        <button
                          onClick={() => setActiveTab('inquiries')}
                          className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs text-white"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Portfolio Projects</h2>
                  <p className="text-xs text-[#737783] mt-1">
                    Manage project cards, upload videos, configure YouTube/Vimeo embeds, and adjust order.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsCreatingProject(true);
                    setEditingProject({
                      id: `proj-${Date.now()}`,
                      title: '',
                      description: '',
                      category: 'Short-Form Content',
                      thumbnail: '',
                      fullVideoSource: '',
                      videoType: 'direct',
                      published: true,
                      featured: false,
                      order: projects.length + 1,
                      editingSoftware: 'DaVinci Resolve Studio',
                      projectDate: new Date().getFullYear().toString(),
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#5248e5]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Project</span>
                </button>
              </div>

              {/* Projects Table / Cards */}
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl bg-[#1C1F26] border border-[#2B2E38] p-4 hover:border-[#635BFF]/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Thumbnail preview */}
                      <div className="h-16 w-24 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                        {proj.thumbnail ? (
                          <img
                            src={proj.thumbnail}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-[#737783]">
                            No Thumb
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                          {proj.featured && (
                            <span className="rounded bg-[#B9F45A] px-1.5 py-0.5 text-[10px] font-black text-[#15171C]">
                              Featured
                            </span>
                          )}
                          {!proj.published && (
                            <span className="rounded bg-amber-500/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              Draft
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#737783] block mt-0.5">
                          {proj.category} • {proj.editingSoftware || 'Editor'} •{' '}
                          {proj.videoType.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Order Controls */}
                      <button
                        disabled={idx === 0}
                        onClick={() => {
                          const prev = projects[idx - 1];
                          saveProject({ ...proj, order: idx });
                          saveProject({ ...prev, order: idx + 1 });
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 text-white"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={idx === projects.length - 1}
                        onClick={() => {
                          const next = projects[idx + 1];
                          saveProject({ ...proj, order: idx + 2 });
                          saveProject({ ...next, order: idx + 1 });
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 text-white"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      {/* Publish / Draft Toggle */}
                      <button
                        onClick={() => {
                          saveProject({ ...proj, published: !proj.published });
                          notifySaved(proj.published ? 'Project set to Draft' : 'Project Published');
                        }}
                        className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
                          proj.published
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-[#737783]'
                        }`}
                        title={proj.published ? 'Published (Click to unpublish)' : 'Draft (Click to publish)'}
                      >
                        {proj.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setIsCreatingProject(false);
                          setEditingProject({ ...proj });
                        }}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                        title="Edit Project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${proj.title}" permanently?`)) {
                            deleteProject(proj.id);
                            notifySaved('Project deleted');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PROJECT EDIT / CREATE MODAL */}
              {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                  <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-[#2B2E38] pb-4">
                      <h3 className="text-lg font-bold text-white">
                        {isCreatingProject ? 'Create Portfolio Project' : 'Edit Project Specifications'}
                      </h3>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="text-xs text-[#737783] hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Title */}
                      <div>
                        <label className="block text-[#C5CAD4] font-medium mb-1">Project Title *</label>
                        <input
                          type="text"
                          required
                          value={editingProject.title}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, title: e.target.value })
                          }
                          className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                          placeholder="e.g. Apex Summer Reel Cut"
                        />
                      </div>

                      {/* Category & Video Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#C5CAD4] font-medium mb-1">Category *</label>
                          <select
                            value={editingProject.category}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                category: e.target.value as ProjectCategory,
                              })
                            }
                            className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                          >
                            {ALL_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#C5CAD4] font-medium mb-1">Video Provider</label>
                          <select
                            value={editingProject.videoType}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                videoType: e.target.value as any,
                              })
                            }
                            className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                          >
                            <option value="direct">Direct File Upload</option>
                            <option value="youtube">YouTube (URL or ID)</option>
                            <option value="vimeo">Vimeo (URL or ID)</option>
                            <option value="mp4">Direct MP4 / WebM Link</option>
                            <option value="drive">Google Drive Embed</option>
                          </select>
                        </div>
                      </div>

                      {/* Video Source */}
                      <div>
                        <label className="block text-[#C5CAD4] font-medium mb-1">
                          Full Video Source (Direct File or Hosted URL) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={editingProject.fullVideoSource}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                fullVideoSource: e.target.value,
                              })
                            }
                            className="flex-1 rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                            placeholder="https://... or upload below"
                          />
                        </div>
                        {/* Direct File Upload helper */}
                        <div className="mt-2 flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload Video File (MP4/WebM)</span>
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleGenericUpload(file, (url) => {
                                    setEditingProject({
                                      ...editingProject,
                                      fullVideoSource: url,
                                      videoType: 'direct',
                                    });
                                  });
                                }
                              }}
                            />
                          </label>
                          {uploadLoading && <span className="text-[11px] text-[#B9F45A] animate-pulse">Uploading file to storage...</span>}
                        </div>
                      </div>

                      {/* Thumbnail URL & Uploader */}
                      <div>
                        <label className="block text-[#C5CAD4] font-medium mb-1">Thumbnail Image</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingProject.thumbnail}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, thumbnail: e.target.value })
                            }
                            className="flex-1 rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                            placeholder="Image URL or upload"
                          />
                        </div>
                        <div className="mt-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload Thumbnail Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleGenericUpload(file, (url) => {
                                    setEditingProject({ ...editingProject, thumbnail: url });
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Client & Editing Software & Date */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[#C5CAD4] font-medium mb-1">Client Name</label>
                          <input
                            type="text"
                            value={editingProject.clientName || ''}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, clientName: e.target.value })
                            }
                            className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                            placeholder="e.g. Red Bull or Creator"
                          />
                        </div>

                        <div>
                          <label className="block text-[#C5CAD4] font-medium mb-1">Software Used</label>
                          <input
                            type="text"
                            value={editingProject.editingSoftware || ''}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                editingSoftware: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                            placeholder="e.g. DaVinci Resolve"
                          />
                        </div>

                        <div>
                          <label className="block text-[#C5CAD4] font-medium mb-1">Release Date / Year</label>
                          <input
                            type="text"
                            value={editingProject.projectDate || ''}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, projectDate: e.target.value })
                            }
                            className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                            placeholder="2025"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[#C5CAD4] font-medium mb-1">Project Description</label>
                        <textarea
                          rows={3}
                          value={editingProject.description}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, description: e.target.value })
                          }
                          className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-white outline-none focus:border-[#635BFF]"
                          placeholder="Narrative breakdown, pacing approach, and client objective..."
                        />
                      </div>

                      {/* Toggles */}
                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.published}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, published: e.target.checked })
                            }
                            className="h-4 w-4 rounded accent-[#635BFF]"
                          />
                          <span className="text-white font-medium">Published (Visible to Visitors)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.featured}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, featured: e.target.checked })
                            }
                            className="h-4 w-4 rounded accent-[#B9F45A]"
                          />
                          <span className="text-white font-medium">Featured Showcase</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2B2E38]">
                      <button
                        onClick={() => setEditingProject(null)}
                        className="rounded-xl px-4 py-2 text-xs font-semibold text-[#737783] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!editingProject.title || !editingProject.fullVideoSource) {
                            alert('Title and Full Video Source are required.');
                            return;
                          }
                          saveProject(editingProject);
                          setEditingProject(null);
                          notifySaved('Project saved successfully');
                        }}
                        className="rounded-xl bg-[#635BFF] hover:bg-[#5248e5] px-6 py-2.5 text-xs font-bold text-white shadow-md"
                      >
                        Save Project
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Media Library & Cloud Storage</h2>
                  <p className="text-xs text-[#737783] mt-1">
                    Upload, organize, and inspect raw video clips, editorial photography, and documents.
                  </p>
                </div>

                {/* Upload Action */}
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] px-4 py-2.5 text-xs font-bold text-white shadow-md">
                  <Upload className="h-4 w-4" />
                  <span>Upload Media File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleGenericUpload(file, () => {});
                      }
                    }}
                  />
                </label>
              </div>

              {uploadLoading && (
                <div className="rounded-xl bg-[#635BFF]/15 border border-[#635BFF]/30 p-4 text-xs text-[#B9F45A] flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#B9F45A] animate-ping" />
                  <span>Uploading media asset to server storage adapter...</span>
                </div>
              )}

              {uploadError && (
                <div className="rounded-xl bg-red-500/15 border border-red-500/30 p-4 text-xs text-red-400">
                  {uploadError}
                </div>
              )}

              {/* Filter Tabs */}
              <div className="flex gap-2 border-b border-[#2B2E38] pb-3 text-xs">
                {(['all', 'image', 'video', 'document'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMediaCategoryFilter(cat)}
                    className={`capitalize px-3 py-1.5 rounded-lg transition-colors ${
                      mediaCategoryFilter === cat
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-[#737783] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaAssets
                  .filter((m) => mediaCategoryFilter === 'all' || m.category === mediaCategoryFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl bg-[#1C1F26] border border-[#2B2E38] overflow-hidden flex flex-col justify-between"
                    >
                      <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                        {item.category === 'image' ? (
                          <img
                            src={item.url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : item.category === 'video' ? (
                          <video src={item.url} className="h-full w-full object-cover" />
                        ) : (
                          <FileText className="h-8 w-8 text-[#635BFF]" />
                        )}
                      </div>

                      <div className="p-3">
                        <span className="block text-xs font-semibold text-white truncate" title={item.name}>
                          {item.name}
                        </span>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-[#737783]">
                          <span className="uppercase font-mono">{item.category}</span>
                          <span>{(item.size / (1024 * 1024)).toFixed(1)} MB</span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#2B2E38] flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.url);
                              notifySaved('Copied media URL to clipboard');
                            }}
                            className="flex-1 flex items-center justify-center gap-1 rounded-md bg-white/5 hover:bg-white/15 py-1 text-[11px] text-white"
                          >
                            <Copy className="h-3 w-3" />
                            <span>Copy URL</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('Delete this media asset?')) {
                                deleteMedia(item.id, item.name);
                                notifySaved('Media deleted');
                              }
                            }}
                            className="p-1 text-red-400 hover:text-red-300"
                            title="Delete File"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: HOMEPAGE SETTINGS */}
          {activeTab === 'homepage' && (
            <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white">Hero & Background Photo / Video</h2>
                <p className="text-xs text-[#737783] mt-1">
                  Choose between your own photography or a looping background video. Uploaded photos are saved and applied automatically.
                </p>
              </div>

              {/* Mode Status & Selector */}
              <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Current Active Background Mode
                  </label>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    homeForm.heroBgMode === 'image'
                      ? 'bg-[#635BFF]/20 text-[#635BFF] border border-[#635BFF]/30'
                      : 'bg-[#B9F45A]/20 text-[#B9F45A] border border-[#B9F45A]/30'
                  }`}>
                    {homeForm.heroBgMode === 'image' ? '● Image Mode (Active on Homepage)' : '● Video Mode (Active on Homepage)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...homeForm, heroBgMode: 'image' as const };
                      setHomeForm(updated);
                      updateSettings({ heroBgMode: 'image' });
                      notifySaved('Switched homepage background to Image Mode!');
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all relative ${
                      homeForm.heroBgMode === 'image'
                        ? 'border-[#635BFF] bg-[#635BFF]/15 ring-2 ring-[#635BFF]/40 text-white shadow-lg'
                        : 'border-[#2B2E38] bg-[#15171C] text-[#737783] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">1. Image Mode</span>
                      {homeForm.heroBgMode === 'image' && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#635BFF] text-white text-xs">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#A0A4AE] mt-2 block leading-relaxed">
                      Displays your full-screen editorial photo or portrait with a cinematic contrast overlay.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...homeForm, heroBgMode: 'video' as const };
                      setHomeForm(updated);
                      updateSettings({ heroBgMode: 'video' });
                      notifySaved('Switched homepage background to Video Mode!');
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all relative ${
                      homeForm.heroBgMode === 'video'
                        ? 'border-[#B9F45A] bg-[#B9F45A]/15 ring-2 ring-[#B9F45A]/40 text-white shadow-lg'
                        : 'border-[#2B2E38] bg-[#15171C] text-[#737783] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">2. Video Mode</span>
                      {homeForm.heroBgMode === 'video' && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B9F45A] text-[#15171C] text-xs">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#A0A4AE] mt-2 block leading-relaxed">
                      Displays a muted, looping video stream. (The photo is automatically used as a mobile fallback).
                    </span>
                  </button>
                </div>
              </div>

              {/* Photo Section */}
              <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#635BFF]" />
                    <span>Hero Background Photo</span>
                  </h3>
                  <p className="text-xs text-[#737783] mt-1">
                    Upload your high-res portrait, film still, or background photograph.
                  </p>
                </div>

                {/* Live Photo Preview Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#15171C] p-4 rounded-xl border border-[#2B2E38]">
                  <div className="md:col-span-5 relative aspect-video md:aspect-[16/10] rounded-lg overflow-hidden bg-black border border-white/10 group">
                    <img
                      src={homeForm.heroImageUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=2000&q=80'}
                      alt="Hero Background Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded">
                        Live Preview
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Status:</span>
                      {homeForm.heroBgMode === 'image' ? (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Visible right now on Homepage
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400 font-medium">
                          Saved as fallback (Video mode is currently active)
                        </span>
                      )}
                    </div>

                    {/* Instant File Upload Button */}
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95">
                        <Upload className="h-4 w-4" />
                        <span>Upload & Apply Photo Now</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleGenericUpload(file, (url) => {
                                const updated = { ...homeForm, heroImageUrl: url, heroBgMode: 'image' as const };
                                setHomeForm(updated);
                                updateSettings({ heroImageUrl: url, heroBgMode: 'image' });
                                notifySaved('Hero photo uploaded, applied, and switched to Image Mode!');
                              });
                            }
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setMediaPickerTarget('heroImage')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-3.5 py-2.5 text-xs font-semibold text-white transition-all"
                      >
                        <ImageIcon className="h-3.5 w-3.5 text-[#B9F45A]" />
                        <span>Choose from Media Library</span>
                      </button>
                    </div>

                    {/* Direct Image URL input with Apply button */}
                    <div className="pt-2">
                      <label className="block text-[11px] text-[#A0A4AE] mb-1">
                        Or enter direct Image URL (Unsplash, Cloud, etc.):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={homeForm.heroImageUrl}
                          onChange={(e) => setHomeForm({ ...homeForm, heroImageUrl: e.target.value })}
                          className="flex-1 rounded-xl border border-[#2B2E38] bg-[#181A20] px-3 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                          placeholder="https://images.unsplash.com/..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateSettings({ heroImageUrl: homeForm.heroImageUrl, heroBgMode: 'image' });
                            setHomeForm({ ...homeForm, heroBgMode: 'image' });
                            notifySaved('Hero photo updated and set as active!');
                          }}
                          className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-colors"
                        >
                          Apply URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Background Section */}
                <div className="pt-6 border-t border-[#2B2E38] space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Film className="h-4 w-4 text-[#B9F45A]" />
                    <span>Hero Looping Video (For Video Mode)</span>
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={homeForm.heroVideoUrl}
                      onChange={(e) => setHomeForm({ ...homeForm, heroVideoUrl: e.target.value })}
                      className="flex-1 rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                      placeholder="https://.../video.mp4"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateSettings({ heroVideoUrl: homeForm.heroVideoUrl, heroBgMode: 'video' });
                        setHomeForm({ ...homeForm, heroBgMode: 'video' });
                        notifySaved('Hero video updated and set to Video Mode!');
                      }}
                      className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition-colors"
                    >
                      Apply & Play
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Video File (MP4/WebM)</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericUpload(file, (url) => {
                              const updated = { ...homeForm, heroVideoUrl: url, heroBgMode: 'video' as const };
                              setHomeForm(updated);
                              updateSettings({ heroVideoUrl: url, heroBgMode: 'video' });
                              notifySaved('Video uploaded and set as active!');
                            });
                          }
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setMediaPickerTarget('heroVideo')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 px-3 py-1.5 text-[11px] text-[#C5CAD4]"
                    >
                      <Film className="h-3 w-3" />
                      <span>Select Video from Library</span>
                    </button>
                  </div>
                </div>

                {/* Headline & Subtitle */}
                <div className="pt-6 border-t border-[#2B2E38] space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={homeForm.heroHeadline}
                      onChange={(e) => setHomeForm({ ...homeForm, heroHeadline: e.target.value })}
                      className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                      Hero Subtitle
                    </label>
                    <input
                      type="text"
                      value={homeForm.heroSubtitle}
                      onChange={(e) => setHomeForm({ ...homeForm, heroSubtitle: e.target.value })}
                      className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                    />
                  </div>

                  {/* Button Labels */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                        Primary Button Label
                      </label>
                      <input
                        type="text"
                        value={homeForm.primaryBtnText}
                        onChange={(e) => setHomeForm({ ...homeForm, primaryBtnText: e.target.value })}
                        className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                        Secondary Button Label
                      </label>
                      <input
                        type="text"
                        value={homeForm.secondaryBtnText}
                        onChange={(e) =>
                          setHomeForm({ ...homeForm, secondaryBtnText: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    updateSettings(homeForm);
                    notifySaved('All homepage & hero settings saved successfully!');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white py-3.5 text-xs font-bold shadow-md transition-all active:scale-[0.99]"
                >
                  <Save className="h-4 w-4" />
                  <span>Save All Hero Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT ME */}
          {activeTab === 'about' && (
            <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white">About Me Editor</h2>
                <p className="text-xs text-[#737783] mt-1">
                  Update biography, portrait, career highlights, skills list, process, and downloadable resume.
                </p>
              </div>

              <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 space-y-5">
                {/* Portrait */}
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-[#635BFF]" />
                    <span>Editorial Portrait Photo</span>
                  </h3>
                  <p className="text-xs text-[#737783] mb-4">
                    Your professional photo displayed in the About Me section.
                  </p>

                  {/* Live Portrait Preview Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-[#15171C] p-4 rounded-xl border border-[#2B2E38]">
                    <div className="sm:col-span-4 relative aspect-[3/4] max-w-[180px] rounded-lg overflow-hidden bg-black border border-white/10 group">
                      <img
                        src={
                          aboutForm.aboutPortraitUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt="About Me Portrait Preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded">
                          Live Portrait
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-8 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">Status:</span>
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Visible on About Me page
                        </span>
                      </div>

                      {/* Instant Upload Button */}
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95">
                          <Upload className="h-4 w-4" />
                          <span>Upload & Save New Portrait</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleGenericUpload(file, (url) => {
                                  const updated = { ...aboutForm, aboutPortraitUrl: url };
                                  setAboutForm(updated);
                                  updateSettings({ aboutPortraitUrl: url });
                                  notifySaved('About Me portrait uploaded and saved!');
                                });
                              }
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setMediaPickerTarget('aboutPortrait')}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-3.5 py-2.5 text-xs font-semibold text-white transition-all"
                        >
                          <ImageIcon className="h-3.5 w-3.5 text-[#B9F45A]" />
                          <span>Choose from Media Library</span>
                        </button>
                      </div>

                      {/* Direct Portrait URL input with Apply button */}
                      <div className="pt-2">
                        <label className="block text-[11px] text-[#A0A4AE] mb-1">
                          Or enter direct Image URL:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={aboutForm.aboutPortraitUrl}
                            onChange={(e) => setAboutForm({ ...aboutForm, aboutPortraitUrl: e.target.value })}
                            className="flex-1 rounded-xl border border-[#2B2E38] bg-[#181A20] px-3 py-2 text-xs text-white outline-none focus:border-[#635BFF]"
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateSettings({ aboutPortraitUrl: aboutForm.aboutPortraitUrl });
                              notifySaved('Portrait photo updated and saved!');
                            }}
                            className="rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-bold text-white transition-colors"
                          >
                            Apply URL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Biography */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Professional Biography
                  </label>
                  <textarea
                    rows={4}
                    value={aboutForm.aboutBio}
                    onChange={(e) => setAboutForm({ ...aboutForm, aboutBio: e.target.value })}
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                {/* Experience & Goals */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Career Track Record & Highlights
                  </label>
                  <input
                    type="text"
                    value={aboutForm.aboutExperience}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, aboutExperience: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                {/* Editing Specialties */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Editing Specialties
                  </label>
                  <input
                    type="text"
                    value={aboutForm.aboutSpecialties}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, aboutSpecialties: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                {/* Skills & Software (comma-separated) */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Skills & Software (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={aboutForm.aboutSkills}
                    onChange={(e) => setAboutForm({ ...aboutForm, aboutSkills: e.target.value })}
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                {/* Creative Process */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Creative Process Steps (One step per line)
                  </label>
                  <textarea
                    rows={5}
                    value={aboutForm.aboutCreativeProcess}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, aboutCreativeProcess: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                {/* Location & Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={aboutForm.aboutLocation}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, aboutLocation: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                      Availability Status
                    </label>
                    <input
                      type="text"
                      value={aboutForm.aboutAvailability}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, aboutAvailability: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                    />
                  </div>
                </div>

                {/* Downloadable Resume / CV */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Downloadable Resume / CV Document (PDF URL or File Upload)
                  </label>
                  <input
                    type="text"
                    value={aboutForm.aboutResumeUrl}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, aboutResumeUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                    placeholder="https://... or upload PDF"
                  />
                  <div className="mt-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[11px] font-semibold text-white">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Resume PDF</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleGenericUpload(file, (url) => {
                              setAboutForm({ ...aboutForm, aboutResumeUrl: url });
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => {
                    updateSettings(aboutForm);
                    notifySaved('About Me content updated successfully');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white py-3 text-xs font-bold shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>Save About Me Details</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Post-Production Services</h2>
                  <p className="text-xs text-[#737783] mt-1">
                    Create and update service offerings, toggle price estimates, and edit features.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsCreatingService(true);
                    setEditingService({
                      id: `srv-${Date.now()}`,
                      title: '',
                      description: '',
                      showPricing: false,
                      priceEstimate: '',
                      features: [],
                      order: services.length + 1,
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#635BFF] px-4 py-2 text-xs font-bold text-white hover:bg-[#5248e5]"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    className="rounded-xl bg-[#1C1F26] border border-[#2B2E38] p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-white">{srv.title}</h4>
                        {srv.showPricing && (
                          <span className="rounded bg-[#B9F45A]/20 px-2 py-0.5 text-[10px] font-bold text-[#B9F45A]">
                            {srv.priceEstimate || 'Priced'}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-[#737783] leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2B2E38] flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsCreatingService(false);
                          setEditingService({ ...srv });
                        }}
                        className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete service "${srv.title}"?`)) {
                            deleteService(srv.id);
                            notifySaved('Service removed');
                          }
                        }}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service Edit Modal */}
              {editingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                  <div className="w-full max-w-lg rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 space-y-4">
                    <h3 className="text-base font-bold text-white">
                      {isCreatingService ? 'Create Service Card' : 'Edit Service Card'}
                    </h3>

                    <div>
                      <label className="block text-xs text-[#C5CAD4] mb-1">Service Title *</label>
                      <input
                        type="text"
                        value={editingService.title}
                        onChange={(e) =>
                          setEditingService({ ...editingService, title: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#C5CAD4] mb-1">Description *</label>
                      <textarea
                        rows={3}
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({ ...editingService, description: e.target.value })
                        }
                        className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                        <input
                          type="checkbox"
                          checked={editingService.showPricing}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              showPricing: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded accent-[#635BFF]"
                        />
                        <span>Display Pricing Estimate</span>
                      </label>
                    </div>

                    {editingService.showPricing && (
                      <div>
                        <label className="block text-xs text-[#C5CAD4] mb-1">Price Estimate</label>
                        <input
                          type="text"
                          value={editingService.priceEstimate || ''}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              priceEstimate: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                          placeholder="e.g. Starting at $800 / project"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-3 border-t border-[#2B2E38]">
                      <button
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 text-xs text-[#737783] hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (!editingService.title) return;
                          saveService(editingService);
                          setEditingService(null);
                          notifySaved('Service saved');
                        }}
                        className="rounded-xl bg-[#635BFF] px-5 py-2 text-xs font-bold text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CONTACT SETTINGS */}
          {activeTab === 'contact' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white">Contact & Channels</h2>
                <p className="text-xs text-[#737783] mt-1">
                  Manage email address, direct messaging handles, and social profile links.
                </p>
              </div>

              <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 space-y-4">
                {[
                  { field: 'contactEmail', label: 'Primary Contact Email' },
                  { field: 'contactWhatsapp', label: 'WhatsApp Number / Link' },
                  { field: 'contactTelegram', label: 'Telegram Handle' },
                  { field: 'contactInstagram', label: 'Instagram Profile' },
                  { field: 'contactTiktok', label: 'TikTok Channel' },
                  { field: 'contactYoutube', label: 'YouTube Channel' },
                  { field: 'contactLinkedin', label: 'LinkedIn Profile' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={(contactForm as any)[field] || ''}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, [field]: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                    />
                  </div>
                ))}

                <button
                  onClick={() => {
                    updateSettings(contactForm);
                    notifySaved('Contact settings saved');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white py-3 text-xs font-bold shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Contact Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white">Client Project Inquiries</h2>
                <p className="text-xs text-[#737783] mt-1">
                  Incoming contact submissions, footage briefs, budget specs, and status tracking.
                </p>
              </div>

              {inquiries.length === 0 ? (
                <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-12 text-center">
                  <Inbox className="mx-auto h-12 w-12 text-[#737783] mb-3" />
                  <h3 className="font-bold text-white">No inquiries yet</h3>
                  <p className="text-xs text-[#737783] mt-1">
                    When visitors submit the contact form, inquiries will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B2E38] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white">{inq.fullName}</h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                inq.status === 'new'
                                  ? 'bg-[#635BFF] text-white'
                                  : inq.status === 'reviewed'
                                  ? 'bg-[#B9F45A]/20 text-[#B9F45A]'
                                  : 'bg-white/10 text-[#737783]'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </div>
                          <span className="text-xs text-[#737783]">
                            {inq.email} {inq.company && `• ${inq.company}`} •{' '}
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              updateInquiryStatus(inq.id, e.target.value as any)
                            }
                            className="rounded-lg border border-[#2B2E38] bg-[#15171C] px-2 py-1 text-xs text-white"
                          >
                            <option value="new">Mark New</option>
                            <option value="reviewed">Mark Reviewed</option>
                            <option value="archived">Mark Archived</option>
                          </select>

                          <a
                            href={`mailto:${inq.email}?subject=Re: Video Editing Inquiry (${inq.requestedService})`}
                            className="rounded-lg bg-[#635BFF] px-3 py-1 text-xs font-bold text-white hover:bg-[#5248e5]"
                          >
                            Reply Email
                          </a>

                          <button
                            onClick={() => {
                              if (confirm('Delete this inquiry?')) {
                                deleteInquiry(inq.id);
                                notifySaved('Inquiry deleted');
                              }
                            }}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-[#737783] block">Requested Service</span>
                          <span className="font-semibold text-white">{inq.requestedService}</span>
                        </div>
                        <div>
                          <span className="text-[#737783] block">Budget</span>
                          <span className="font-semibold text-white">{inq.budget || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-[#737783] block">Target Deadline</span>
                          <span className="font-semibold text-white">{inq.deadline || 'Flexible'}</span>
                        </div>
                      </div>

                      {inq.referenceLink && (
                        <div className="text-xs">
                          <span className="text-[#737783] block">Footage / Reference Link:</span>
                          <a
                            href={inq.referenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#635BFF] hover:underline break-all"
                          >
                            <span>{inq.referenceLink}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        </div>
                      )}

                      <div className="rounded-xl bg-[#15171C] p-4 text-xs text-[#C5CAD4] leading-relaxed whitespace-pre-line border border-[#2B2E38]">
                        {inq.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-black text-white">Website & Branding Settings</h2>
                <p className="text-xs text-[#737783] mt-1">
                  Brand name, logo text, SEO metadata, and primary accent color.
                </p>
              </div>

              <div className="rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={generalForm.siteName}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, siteName: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Logo / Wordmark Text
                  </label>
                  <input
                    type="text"
                    value={generalForm.logoText}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, logoText: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={generalForm.seoTitle}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, seoTitle: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={generalForm.seoDescription}
                    onChange={(e) =>
                      setGeneralForm({ ...generalForm, seoDescription: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none focus:border-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Accent Color Hex Code
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={generalForm.accentColor || '#635BFF'}
                      onChange={(e) =>
                        setGeneralForm({ ...generalForm, accentColor: e.target.value })
                      }
                      className="h-10 w-10 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={generalForm.accentColor}
                      onChange={(e) =>
                        setGeneralForm({ ...generalForm, accentColor: e.target.value })
                      }
                      className="w-32 rounded-xl border border-[#2B2E38] bg-[#15171C] p-3 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    updateSettings(generalForm);
                    notifySaved('Branding & SEO updated');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white py-3 text-xs font-bold shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Brand Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* Media Picker Modal */}
          {mediaPickerTarget && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#1C1F26] border border-[#2B2E38] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#2B2E38] pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#635BFF]" />
                    <span>
                      Select {mediaPickerTarget === 'heroVideo' ? 'Video' : 'Photo'} from Media Library
                    </span>
                  </h3>
                  <button
                    onClick={() => setMediaPickerTarget(null)}
                    className="text-xs text-[#737783] hover:text-white"
                  >
                    Close
                  </button>
                </div>

                {/* Upload New in modal */}
                <div className="flex items-center justify-between bg-[#15171C] p-3 rounded-xl border border-[#2B2E38]">
                  <span className="text-xs text-[#A0A4AE]">Want to upload a new file from your device?</span>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] hover:bg-[#5248e5] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Now</span>
                    <input
                      type="file"
                      accept={mediaPickerTarget === 'heroVideo' ? 'video/*' : 'image/*'}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleGenericUpload(file, (url) => {
                            if (mediaPickerTarget === 'heroImage') {
                              setHomeForm((prev) => ({ ...prev, heroImageUrl: url, heroBgMode: 'image' }));
                              updateSettings({ heroImageUrl: url, heroBgMode: 'image' });
                              notifySaved('Hero background photo uploaded and applied!');
                            } else if (mediaPickerTarget === 'heroVideo') {
                              setHomeForm((prev) => ({ ...prev, heroVideoUrl: url, heroBgMode: 'video' }));
                              updateSettings({ heroVideoUrl: url, heroBgMode: 'video' });
                              notifySaved('Hero video uploaded and applied!');
                            } else if (mediaPickerTarget === 'aboutPortrait') {
                              setAboutForm((prev) => ({ ...prev, aboutPortraitUrl: url }));
                              updateSettings({ aboutPortraitUrl: url });
                              notifySaved('About Me portrait photo uploaded and saved!');
                            }
                            setMediaPickerTarget(null);
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Grid of existing media */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaAssets
                    .filter((m) => (mediaPickerTarget === 'heroVideo' ? m.category === 'video' : m.category === 'image'))
                    .map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => {
                          if (mediaPickerTarget === 'heroImage') {
                            setHomeForm((prev) => ({ ...prev, heroImageUrl: asset.url, heroBgMode: 'image' }));
                            updateSettings({ heroImageUrl: asset.url, heroBgMode: 'image' });
                            notifySaved('Hero background photo updated!');
                          } else if (mediaPickerTarget === 'heroVideo') {
                            setHomeForm((prev) => ({ ...prev, heroVideoUrl: asset.url, heroBgMode: 'video' }));
                            updateSettings({ heroVideoUrl: asset.url, heroBgMode: 'video' });
                            notifySaved('Hero video updated!');
                          } else if (mediaPickerTarget === 'aboutPortrait') {
                            setAboutForm((prev) => ({ ...prev, aboutPortraitUrl: asset.url }));
                            updateSettings({ aboutPortraitUrl: asset.url });
                            notifySaved('About Me portrait photo updated!');
                          }
                          setMediaPickerTarget(null);
                        }}
                        className="group cursor-pointer rounded-xl bg-[#15171C] border border-[#2B2E38] hover:border-[#635BFF] overflow-hidden p-2 transition-all hover:scale-102"
                      >
                        <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                          {asset.category === 'image' ? (
                            <img src={asset.url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <video src={asset.url} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span className="block text-[11px] font-medium text-white truncate mt-1.5">
                          {asset.name}
                        </span>
                      </div>
                    ))}
                </div>

                {mediaAssets.filter((m) => (mediaPickerTarget === 'heroVideo' ? m.category === 'video' : m.category === 'image')).length === 0 && (
                  <div className="text-center py-8 text-xs text-[#737783]">
                    No {mediaPickerTarget === 'heroVideo' ? 'videos' : 'photos'} in your media library yet. Use the upload button above to add one.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
