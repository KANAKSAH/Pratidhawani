import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { TrendingArticles } from './components/TrendingArticles';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutUsSection } from './components/AboutUsSection';
import { TestimonialsAndFooter } from './components/TestimonialsAndFooter';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { EditionReaderModal } from './components/EditionReaderModal';
import { ShareWebsiteModal } from './components/ShareWebsiteModal';
import { Article } from './types';

function MainApp() {
  const { currentUser } = useApp();
  const [activeView, setActiveView] = useState<'home' | 'student-dashboard' | 'admin-dashboard'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditionModal, setShowEditionModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  const handleGoToSubmit = () => {
    setActiveView('student-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col font-sans selection:bg-[#9A3412]/15 selection:text-[#9A3412]">
      {/* Top Bar with Zero-Pill Nav and Persona Switcher */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenEditionModal={() => setShowEditionModal(true)}
        onOpenShareModal={() => setShowShareModal(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div>
            {/* 1. Current Magazine Edition Spotlight */}
            <HeroSpotlight
              onOpenEditionModal={() => setShowEditionModal(true)}
              onGoToSubmit={handleGoToSubmit}
            />

            {/* 2. Trending Articles & Poems Grid */}
            <TrendingArticles
              onSelectArticle={(art) => setReadingArticle(art)}
            />

            {/* 3. How It Works (Write Article → Peer Review & Edit → Publish in Annual Edition) */}
            <HowItWorksSection
              onGoToSubmit={handleGoToSubmit}
            />

            {/* 4. About Us (The Literary and Editorial Society) */}
            <AboutUsSection />

            {/* 5. Testimonials (Published Student Author Reviews) & Contact Us / Footer */}
            <TestimonialsAndFooter />
          </div>
        )}

        {activeView === 'student-dashboard' && (
          <StudentDashboard
            onOpenArticle={(art) => setReadingArticle(art)}
          />
        )}

        {activeView === 'admin-dashboard' && (
          <AdminDashboard
            onOpenArticle={(art) => setReadingArticle(art)}
          />
        )}
      </main>

      {/* Reader Modals */}
      <ArticleReaderModal
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
      />

      <EditionReaderModal
        isOpen={showEditionModal}
        onClose={() => setShowEditionModal(false)}
        onOpenArticle={(art) => setReadingArticle(art)}
      />

      {/* Share Website Modal */}
      <ShareWebsiteModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Authentication & Role Switcher Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
