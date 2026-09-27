import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';

import { LandingPage } from './pages/Landing';
import { OverviewPage } from './pages/Overview';
import { DetectionPage } from './pages/Detection';
import { DriftForecastPage } from './pages/DriftForecast';
import { HotspotsPage } from './pages/Hotspots';
import { FieldVerificationPage } from './pages/FieldVerification';
import { CleanupPriorityPage } from './pages/CleanupPriority';
import { HistoricalReplayPage } from './pages/HistoricalReplay';
import { SatelliteScenesPage } from './pages/SatelliteScenes';
import { ModelConfidencePage } from './pages/ModelConfidence';
import { DataSourcesPage } from './pages/DataSources';
import { SettingsPage } from './pages/Settings';

import { NavigationId } from './types';

export function App() {
  const [currentNav, setCurrentNav] = useState<NavigationId>('overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const handleNavigate = (id: NavigationId) => {
    setCurrentNav(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Landing Page if currentNav === 'landing'
  if (currentNav === 'landing') {
    return (
      <LandingPage
        onEnterApp={(targetNav) => handleNavigate(targetNav || 'overview')}
      />
    );
  }

  const renderActivePage = () => {
    switch (currentNav) {
      case 'overview':
        return <OverviewPage onNavigate={handleNavigate} />;
      case 'detection':
        return <DetectionPage />;
      case 'drift':
        return <DriftForecastPage />;
      case 'hotspots':
        return <HotspotsPage />;
      case 'verification':
        return <FieldVerificationPage />;
      case 'cleanup':
        return <CleanupPriorityPage />;
      case 'historical':
        return <HistoricalReplayPage />;
      case 'satellite-scenes':
        return <SatelliteScenesPage />;
      case 'ocean-conditions':
      case 'model-confidence':
        return <ModelConfidencePage />;
      case 'data-sources':
        return <DataSourcesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FC] flex font-sans antialiased text-[#071A33] selection:bg-[#0878D1] selection:text-white">
      {/* 1. Persistent Dark Navy Left Sidebar */}
      <Sidebar
        currentNav={currentNav}
        onNavigate={handleNavigate}
        onOpenLanding={() => handleNavigate('landing')}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Slim Top Header */}
        <TopHeader
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />

        {/* Dynamic Main Content Container */}
        <main className="flex-1 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* 3. Global Search Overlay */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* 4. Assistant Right Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </div>
  );
}

export default App;
