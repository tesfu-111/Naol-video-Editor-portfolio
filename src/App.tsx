/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WorkGallery } from './components/WorkGallery';
import { AboutMeSection } from './components/AboutMeSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { NotFound } from './components/NotFound';

function MainApp() {
  const { settings, isAdmin, isLoading } = usePortfolio();
  const [currentView, setCurrentView] = useState<'main' | 'admin' | 'privacy' | '404'>('main');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [preselectedService, setPreselectedService] = useState<string>('');

  // Sync hash routing and history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setCurrentView('admin');
      } else if (hash === 'privacy') {
        setCurrentView('privacy');
      } else if (hash === '404') {
        setCurrentView('404');
      } else {
        setCurrentView('main');
        if (hash) {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(hash);
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update document title dynamically based on settings
  useEffect(() => {
    if (settings.seoTitle) {
      document.title = settings.seoTitle;
    }
  }, [settings.seoTitle]);

  const handleNavigate = (sectionId: string) => {
    if (currentView !== 'main') {
      setCurrentView('main');
      window.location.hash = sectionId;
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setActiveSection(sectionId);
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${sectionId}`);
      }
    }
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    handleNavigate('contact');
  };

  // Render Admin View
  if (currentView === 'admin') {
    if (!isAdmin) {
      return (
        <AdminLogin
          onBack={() => {
            setCurrentView('main');
            window.location.hash = '';
          }}
          onSuccess={() => {
            setCurrentView('admin');
          }}
        />
      );
    }
    return (
      <AdminDashboard
        onBackToSite={() => {
          setCurrentView('main');
          window.location.hash = '';
        }}
      />
    );
  }

  // Render Privacy Policy View
  if (currentView === 'privacy') {
    return (
      <PrivacyPolicy
        onBack={() => {
          setCurrentView('main');
          window.location.hash = '';
        }}
      />
    );
  }

  // Render 404 View
  if (currentView === '404') {
    return (
      <NotFound
        onGoHome={() => {
          setCurrentView('main');
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#15171C] font-sans antialiased selection:bg-[#635BFF] selection:text-white">
      {/* Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = 'admin';
        }}
      />

      {/* Hero Section with 2 Background Modes */}
      <HeroSection
        onExploreWork={() => handleNavigate('work')}
        onWorkTogether={() => handleNavigate('contact')}
      />

      {/* My Work Portfolio Gallery */}
      <WorkGallery onInquireService={handleSelectServiceForInquiry} />

      {/* About Me Section */}
      <AboutMeSection onWorkTogether={() => handleNavigate('contact')} />

      {/* Services Section */}
      <ServicesSection onSelectServiceForInquiry={handleSelectServiceForInquiry} />

      {/* Contact Section */}
      <ContactSection
        preselectedService={preselectedService}
        onClearPreselectedService={() => setPreselectedService('')}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacy={() => {
          setCurrentView('privacy');
          window.location.hash = 'privacy';
        }}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = 'admin';
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainApp />
    </PortfolioProvider>
  );
}
