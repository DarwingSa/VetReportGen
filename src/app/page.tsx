'use client';

import { useState, useEffect } from 'react';
import VetReportGen from '@/components/vet-report-gen';
import Report from '@/components/report';
import HistorySidebar from '@/components/history-sidebar';
import type { ReportData } from '@/lib/hematology-data';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [currentView, setCurrentView] = useState<'form' | 'report'>('form');
  const [activeReport, setActiveReport] = useState<ReportData | null>(null);
  const [history, setHistory] = useState<ReportData[]>([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('vet-report-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    }
  }, []);

  const updateHistory = (newHistory: ReportData[]) => {
    try {
      localStorage.setItem('vet-report-history', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
        console.error("Failed to save history to localStorage", error);
    }
  };

  const handleReportGenerated = (reportData: ReportData) => {
    setActiveReport(reportData);
    setCurrentView('report');
    const newHistory = [reportData, ...history.filter(r => r.patient.id !== reportData.patient.id)];
    updateHistory(newHistory);
  };
  
  const handleSelectReportFromHistory = (reportData: ReportData) => {
    setActiveReport(reportData);
    setCurrentView('report');
  };

  const handleDeleteReport = (reportId: string) => {
    const newHistory = history.filter(r => r.patient.id !== reportId);
    updateHistory(newHistory);
    if (activeReport?.patient.id === reportId) {
      handleShowForm();
    }
  };
  
  const handleClearHistory = () => {
    updateHistory([]);
    handleShowForm();
  };

  const handleShowForm = () => {
    setActiveReport(null);
    setCurrentView('form');
  };

  return (
    <main className="flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 min-h-screen bg-background">
        {currentView === 'form' && (
          <div className="w-full max-w-4xl">
            <VetReportGen onReportGenerated={handleReportGenerated} />
            <Separator className="my-8" />
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-headline font-semibold">Historial de Informes</h2>
              <Button variant="destructive" onClick={handleClearHistory} disabled={history.length === 0}>
                  Borrar Historial
              </Button>
            </div>
            <HistorySidebar
                history={history}
                onSelectReport={handleSelectReportFromHistory}
                onDeleteReport={handleDeleteReport}
            />
          </div>
        )}
        {currentView === 'report' && activeReport && (
            <Report data={activeReport} onReset={handleShowForm} />
        )}
    </main>
  );
}
