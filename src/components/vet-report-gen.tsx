'use client';

import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2, HeartPulse } from 'lucide-react';
import Report from '@/components/report';
import type { ReportData, ResultRow } from '@/lib/hematology-data';
import { dogReferenceRanges, parametersToInclude } from '@/lib/hematology-data';

export default function VetReportGen() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Esperando archivo CSV...');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseHeader = (header: string): { parameter: string; unit: string } => {
    const match = header.match(/(.+?)\((.+?)\)/);
    if (match && match[1] && match[2] !== undefined) {
      return { parameter: match[1].trim(), unit: match[2].trim() };
    }
    return { parameter: header.trim(), unit: '' };
  };

  const processCsvData = (csvText: string): ReportData | null => {
    try {
      const lines = csvText.trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error('El CSV debe tener al menos una cabecera y una fila de datos.');
      
      const headers = lines[0].split(',');
      const values = lines[1].split(',');
      const rowData: { [key: string]: string } = {};

      headers.forEach((header, index) => {
        rowData[header.trim()] = values[index]?.trim();
      });

      const sampleId = rowData['ID mstra.'] || 'Desconocido';
      if (!sampleId) throw new Error('No se encontró la columna "ID mstra.".');
      
      const speciesHeader = headers.find(h => h.startsWith('Especie')) || 'Especie()';
      
      const patientData = {
        id: sampleId,
        species: rowData[speciesHeader] || 'Perro',
        date: rowData['Tiempo'] || new Date().toLocaleDateString('es-ES'),
        owner: 'SRA ISI', // Valor de ejemplo
      };

      const results: ResultRow[] = [];
      
      for (const header of headers) {
        const { parameter: paramName, unit: paramUnit } = parseHeader(header);

        if (parametersToInclude.includes(paramName)) {
          const valueStr = rowData[header];
          const value = parseFloat(valueStr);
          const range = dogReferenceRanges[paramName];
          
          if (!isNaN(value) && range) {
            let indicator: ResultRow['indicator'] = '';
            if (value > range.max) indicator = '↑';
            if (value < range.min) indicator = '↓';
            
            results.push({
              parameter: paramName,
              result: value.toFixed(2),
              indicator,
              range: `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`,
              unit: paramUnit || range.unit,
            });
          }
        }
      }

      if (results.length === 0) throw new Error('No se encontraron parámetros válidos en el archivo.');

      return { patient: patientData, results };

    } catch (error) {
      console.error('Error processing CSV:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al procesar el archivo.';
      toast({
        variant: 'destructive',
        title: 'Error de Procesamiento',
        description: errorMessage,
      });
      return null;
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      toast({
        variant: 'destructive',
        title: 'Archivo no válido',
        description: 'Por favor, selecciona un archivo con formato .csv.',
      });
      return;
    }

    setIsLoading(true);
    setStatus('Procesando archivo...');
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = processCsvData(text);
      if (data) {
        setReportData(data);
        setStatus(`Informe '${data.patient.id}.pdf' listo para generar.`);
        document.title = `Informe - ${data.patient.id}`;
      } else {
        setStatus('Error al procesar el archivo. Inténtalo de nuevo.');
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'Error de Lectura',
        description: 'No se pudo leer el archivo.',
      });
      setIsLoading(false);
      setStatus('Error al leer el archivo.');
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleReset = () => {
    setReportData(null);
    setStatus('Esperando archivo CSV...');
    document.title = 'VETReportGen';
  };

  if (reportData) {
    return <Report data={reportData} onReset={handleReset} />;
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl bg-card">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
            <HeartPulse className="w-12 h-12 text-primary" />
            <CardTitle className="text-3xl font-headline">VETReportGen</CardTitle>
        </div>
        <CardDescription className="text-lg">
          Generador de Informes de Hematología
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Procesando...' : 'Seleccionar CSV y Generar Informe'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">{status}</p>
      </CardFooter>
    </Card>
  );
}
