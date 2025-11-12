'use client';

import type { ReportData } from '@/lib/hematology-data';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


interface HistorySidebarProps {
  history: ReportData[];
  onSelectReport: (report: ReportData) => void;
  onDeleteReport: (reportId: string) => void;
}

export default function HistorySidebar({ history, onSelectReport, onDeleteReport }: HistorySidebarProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
              {history.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                      <FileText className="w-10 h-10 mb-4" />
                      <span>No hay informes guardados.</span>
                  </div>
              ) : (
                  <ul className="divide-y">
                      {history.map((report) => (
                          <li key={report.patient.id} className="p-2 hover:bg-accent/50 group">
                              <div className="flex items-center justify-between">
                                  <button onClick={() => onSelectReport(report)} className="flex-1 text-left p-2">
                                      <div className="flex items-center gap-3">
                                          <FileText className="h-5 w-5 text-primary"/>
                                          <div>
                                              <p className="font-medium truncate">{report.patient.ownerName}</p>
                                              <p className="text-sm text-muted-foreground truncate">{report.patient.petName} - {report.patient.date}</p>
                                          </div>
                                      </div>
                                  </button>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          onDeleteReport(report.patient.id);
                                      }}
                                  >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                              </div>
                          </li>
                      ))}
                  </ul>
              )}
          </ScrollArea>
      </CardContent>
    </Card>
  );
}
