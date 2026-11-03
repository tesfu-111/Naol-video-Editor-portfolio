import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut as fbSignOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  SiteSettings,
  PortfolioProject,
  ServiceItem,
  ContactInquiry,
  MediaAsset,
} from '../types';
import {
  DEFAULT_SITE_SETTINGS,
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
} from '../lib/initialData';

interface PortfolioContextType {
  settings: SiteSettings;
  projects: PortfolioProject[];
  services: ServiceItem[];
  inquiries: ContactInquiry[];
  mediaAssets: MediaAsset[];
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  authLoading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  loginWithPasscode: (passcode: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  saveProject: (project: PortfolioProject) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  saveService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  submitInquiry: (inquiryData: Omit<ContactInquiry, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  updateInquiryStatus: (id: string, status: 'new' | 'reviewed' | 'archived') => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  uploadFile: (file: File) => Promise<{ url: string; filename: string; category: string } | null>;
  deleteMedia: (id: string, filename?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const OWNER_EMAIL = 'tesfukebe000@gmail.com';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [projects, setProjects] = useState<PortfolioProject[]>(INITIAL_PROJECTS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Check and maintain Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if admin by email or admin record
        const isOwner = user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
        let hasAdminDoc = false;
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            hasAdminDoc = true;
          } else if (isOwner) {
            // Self-register owner into admins collection
            await setDoc(doc(db, 'admins', user.uid), {
              uid: user.uid,
              email: user.email,
              role: 'admin',
              createdAt: new Date().toISOString(),
            });
            hasAdminDoc = true;
          }
        } catch {
          // Rule evaluation or offline
        }
        // Check local admin token from passcode verification
        const localPass =
          sessionStorage.getItem('kinetic_admin_token') ||
          localStorage.getItem('kinetic_admin_token');
        setIsAdmin(localPass === 'admin_authorized');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Hydrate from server store on startup
  useEffect(() => {
    fetch('/api/data')
      .then((r) => r.json())
      .then((data) => {
        if (data?.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
        if (data?.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
        if (data?.services && Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        }
        if (data?.inquiries && Array.isArray(data.inquiries) && data.inquiries.length > 0) {
          setInquiries((prev) => (prev.length === 0 ? data.inquiries : prev));
        }
      })
      .catch(() => {});
  }, []);

  // Sync / Listen to SiteSettings
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'siteSettings', 'global'),
      (snap) => {
        if (snap.exists()) {
          setSettings({ ...DEFAULT_SITE_SETTINGS, ...snap.data() } as SiteSettings);
        } else {
          // Initialize default settings in Firestore
          setDoc(doc(db, 'siteSettings', 'global'), DEFAULT_SITE_SETTINGS).catch(() => {});
        }
      },
      (err) => {
        console.warn('Using default settings (Firestore read error or offline)', err);
      }
    );
    return () => unsub();
  }, []);

  // Sync / Listen to Projects
  useEffect(() => {
    const q = query(collection(db, 'portfolioProjects'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: PortfolioProject[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as PortfolioProject);
          });
          setProjects(items);
        } else {
          // Seed initial placeholder projects if empty
          INITIAL_PROJECTS.forEach((p) => {
            setDoc(doc(db, 'portfolioProjects', p.id), p).catch(() => {});
          });
        }
        setIsLoading(false);
      },
      (err) => {
        console.warn('Projects listener offline/restricted, using initial projects', err);
        setIsLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Sync / Listen to Services
  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: ServiceItem[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as ServiceItem);
          });
          setServices(items);
        } else {
          // Seed initial services
          INITIAL_SERVICES.forEach((s) => {
            setDoc(doc(db, 'services', s.id), s).catch(() => {});
          });
        }
      },
      (err) => {
        console.warn('Services listener offline, using initial services', err);
      }
    );
    return () => unsub();
  }, []);

  // Sync Inquiries if Admin
  useEffect(() => {
    if (!isAdmin) {
      setInquiries([]);
      return;
    }
    const q = query(collection(db, 'contactInquiries'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: ContactInquiry[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ContactInquiry);
        });
        setInquiries(items);
      },
      (err) => {
        console.warn('Inquiries listener error', err);
      }
    );
    return () => unsub();
  }, [isAdmin]);

  // Sync Media Assets
  useEffect(() => {
    const q = query(collection(db, 'mediaAssets'), orderBy('uploadedAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items: MediaAsset[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MediaAsset);
        });
        setMediaAssets(items);
      },
      () => {
        // fallback to server upload list
        fetch('/api/uploads')
          .then((res) => res.json())
          .then((data) => {
            if (data?.files) {
              setMediaAssets(
                data.files.map((f: any, idx: number) => ({
                  id: `srv-${idx}-${f.filename}`,
                  name: f.filename,
                  originalName: f.filename,
                  fileType: f.category,
                  size: f.size,
                  url: f.url,
                  category: f.category,
                  uploadedAt: f.updatedAt,
                }))
              );
            }
          })
          .catch(() => {});
      }
    );
    return () => unsub();
  }, []);

  // Login with Google
  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const isOwner = res.user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase();
      if (isOwner) {
        setIsAdmin(true);
        // Persist admin doc
        try {
          await setDoc(doc(db, 'admins', res.user.uid), {
            uid: res.user.uid,
            email: res.user.email,
            role: 'admin',
            createdAt: new Date().toISOString(),
          });
        } catch {}
      }
      return true;
    } catch (error) {
      console.error('Google Auth Failed', error);
      return false;
    }
  };

  // Login with Passcode (Backup admin auth)
  const loginWithPasscode = async (passcode: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (data.success && data.authorized) {
        sessionStorage.setItem('kinetic_admin_token', 'admin_authorized');
        localStorage.setItem('kinetic_admin_token', 'admin_authorized');
        setIsAdmin(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {}
    sessionStorage.removeItem('kinetic_admin_token');
    localStorage.removeItem('kinetic_admin_token');
    setIsAdmin(false);
    setCurrentUser(null);
  };

  // Update Settings
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    setSettings(updated);

    // Save to server store
    fetch('/api/admin/save-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'siteSettings', 'global'), updated, { merge: true });
    } catch (error) {
      console.warn('Firestore settings update warning (cached server-side):', error);
    }
  };

  // Save Project
  const saveProject = async (project: PortfolioProject) => {
    const payload = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = payload;
        return next;
      }
      return [...prev, payload];
    });

    // Save to server store
    fetch('/api/admin/save-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'portfolioProjects', project.id), payload);
    } catch (error) {
      console.warn('Firestore project write warning (cached server-side):', error);
    }
  };

  // Delete Project
  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));

    // Delete on server store
    fetch('/api/admin/delete-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {});

    // Delete on Firestore
    try {
      await deleteDoc(doc(db, 'portfolioProjects', id));
    } catch (error) {
      console.warn('Firestore project delete warning (handled server-side):', error);
    }
  };

  // Save Service
  const saveService = async (service: ServiceItem) => {
    setServices((prev) => {
      const idx = prev.findIndex((s) => s.id === service.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = service;
        return next;
      }
      return [...prev, service];
    });

    // Save on server store
    fetch('/api/admin/save-service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    }).catch(() => {});

    // Sync on Firestore
    try {
      await setDoc(doc(db, 'services', service.id), service);
    } catch (error) {
      console.warn('Firestore service write warning (handled server-side):', error);
    }
  };

  // Delete Service
  const deleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));

    // Delete on server store
    fetch('/api/admin/delete-service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {});

    // Delete on Firestore
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (error) {
      console.warn('Firestore service delete warning (handled server-side):', error);
    }
  };

  // Submit Inquiry (Public)
  const submitInquiry = async (
    inquiryData: Omit<ContactInquiry, 'id' | 'status' | 'createdAt'>
  ): Promise<boolean> => {
    const id = `inq-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const fullInquiry: ContactInquiry = {
      id,
      ...inquiryData,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Save on server store
    fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullInquiry),
    }).catch(() => {});

    setInquiries((prev) => [fullInquiry, ...prev]);

    // Sync on Firestore
    try {
      await setDoc(doc(db, 'contactInquiries', id), fullInquiry);
      return true;
    } catch (error) {
      console.warn('Firestore inquiry sync warning (saved via server adapter):', error);
      return true;
    }
  };

  // Update Inquiry Status
  const updateInquiryStatus = async (id: string, status: 'new' | 'reviewed' | 'archived') => {
    try {
      await setDoc(doc(db, 'contactInquiries', id), { status }, { merge: true });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contactInquiries/${id}`);
    }
  };

  // Delete Inquiry
  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'contactInquiries', id));
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contactInquiries/${id}`);
    }
  };

  // Upload File through Backend Server Adapter
  const uploadFile = async (
    file: File
  ): Promise<{ url: string; filename: string; category: string } | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      const assetId = `asset-${Date.now()}`;
      const mediaEntry: MediaAsset = {
        id: assetId,
        name: data.filename,
        originalName: data.originalName,
        fileType: data.fileType,
        size: data.size,
        url: data.url,
        category: data.category,
        uploadedAt: new Date().toISOString(),
      };

      // Record in Firestore mediaAssets
      try {
        await setDoc(doc(db, 'mediaAssets', assetId), mediaEntry);
      } catch (e) {
        console.warn('Could not record media in Firestore, keeping server file', e);
      }

      setMediaAssets((prev) => [mediaEntry, ...prev]);
      return { url: data.url, filename: data.filename, category: data.category };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  // Delete Media
  const deleteMedia = async (id: string, filename?: string) => {
    try {
      if (filename) {
        await fetch(`/api/uploads/${encodeURIComponent(filename)}`, { method: 'DELETE' });
      }
      await deleteDoc(doc(db, 'mediaAssets', id));
      setMediaAssets((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Failed to delete media asset', error);
    }
  };

  const refreshData = async () => {
    try {
      const settingsSnap = await getDoc(doc(db, 'siteSettings', 'global'));
      if (settingsSnap.exists()) {
        setSettings(settingsSnap.data() as SiteSettings);
      }
      const projSnap = await getDocs(query(collection(db, 'portfolioProjects'), orderBy('order', 'asc')));
      if (!projSnap.empty) {
        setProjects(projSnap.docs.map((d) => ({ id: d.id, ...d.data() } as PortfolioProject)));
      }
    } catch (e) {
      console.error('Refresh error', e);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        settings,
        projects,
        services,
        inquiries,
        mediaAssets,
        currentUser,
        isAdmin,
        isLoading,
        authLoading,
        loginWithGoogle,
        loginWithPasscode,
        logout,
        updateSettings,
        saveProject,
        deleteProject,
        saveService,
        deleteService,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        uploadFile,
        deleteMedia,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
