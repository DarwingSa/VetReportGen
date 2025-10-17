'use client';

import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Loader2, HeartPulse, FileHeart } from 'lucide-react';
import Report from '@/components/report';
import type { ReportData, ResultRow, CsvData, PatientData } from '@/lib/hematology-data';
import { dogReferenceRanges, catReferenceRanges } from '@/lib/hematology-data';

const FormSchema = z.object({
  ownerName: z.string().min(1, 'El nombre del dueño es requerido.'),
  petName: z.string().min(1, 'El nombre de la mascota es requerido.'),
  address: z.string().min(1, 'La dirección es requerida.'),
  species: z.enum(['Canino', 'Felino'], { required_error: 'Debe seleccionar una especie.' }),
  age: z.string().min(1, 'La edad es requerida.'),
  sex: z.string().min(1, 'El sexo es requerido.'),
});

type FormData = z.infer<typeof FormSchema>;

// Encabezados que no son resultados médicos y deben ser ignorados
const NON_MEDICAL_HEADERS = ['ID mstra.', 'Tiempo', 'Especie', 'Modo'];


export default function VetReportGen() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Esperando archivo CSV...');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ownerName: '',
      petName: '',
      address: '',
      species: 'Canino',
      age: '',
      sex: '',
    },
  });

  const parseParameter = (header: string): string => {
      const match = header.match(/(.+?)(?:\s*\(.+\))?$/);
      return match ? match[1].trim() : header.trim();
  };

  const processCsvData = (csvText: string): CsvData | null => {
    try {
      const lines = csvText.trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error('El CSV debe tener al menos una cabecera y una fila de datos.');
      
      const headers = lines[0].split(',').map(h => h.trim());
      const values = lines[1].split(',').map(v => v.trim());
      const rowData: { [key: string]: string } = {};

      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });

      const sampleId = rowData['ID mstra.'] || 'Desconocido';
      if (!sampleId) throw new Error('No se encontró la columna "ID mstra.".');
      
      const patientData = {
        id: sampleId,
        date: rowData['Tiempo'] || new Date().toLocaleDateString('es-ES'),
      };

      const results: ResultRow[] = [];
      
      for (const header of headers) {
        if (NON_MEDICAL_HEADERS.includes(header)) continue;
        
        const paramName = parseParameter(header);
        const valueStr = rowData[header];

        if (valueStr !== undefined) {
           results.push({
            parameter: paramName,
            result: valueStr,
            indicator: '',
            range: '',
            unit: '', // Se determinará después con los rangos de referencia
          });
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
        setCsvData(data);
        setStatus('Archivo cargado. Por favor, complete los datos del paciente.');
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

  const handleGenerateReport = (formData: FormData) => {
    if (!csvData) return;

    const referenceRanges = formData.species === 'Canino' ? dogReferenceRanges : catReferenceRanges;
    
    const finalResults = csvData.results.map(res => {
        const value = parseFloat(res.result);
        const rangeInfo = referenceRanges[res.parameter];
        let indicator: ResultRow['indicator'] = '';
        let rangeStr = 'N/A';
        let unit = '';

        if (!isNaN(value) && rangeInfo) {
            if (value > rangeInfo.max) indicator = '↑';
            if (value < rangeInfo.min) indicator = '↓';
            rangeStr = `${rangeInfo.min.toFixed(2)} - ${rangeInfo.max.toFixed(2)}`;
            unit = rangeInfo.unit;
        }
        
        return {
            ...res,
            result: isNaN(value) ? res.result : value.toFixed(2),
            indicator,
            range: rangeStr,
            unit: unit
        };
    });


    const fullPatientData: PatientData = {
      ...csvData.patient,
      ...formData,
      vet: 'DR. Eduardo Peña',
    };
    
    setReportData({ patient: fullPatientData, results: finalResults });
    document.title = `Informe - ${fullPatientData.id}`;
  };

  const handleReset = () => {
    setCsvData(null);
    setReportData(null);
    setStatus('Esperando archivo CSV...');
    form.reset();
    document.title = 'VETReportGen';
  };

  if (reportData) {
    return <Report data={reportData} onReset={handleReset} />;
  }

  if (csvData) {
    return (
      <Card className="w-full max-w-2xl shadow-2xl bg-card">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
                <FileHeart className="w-12 h-12 text-primary" />
                <CardTitle className="text-3xl font-headline">Datos del Paciente</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Complete la información para generar el informe.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateReport)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="ownerName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del dueño</FormLabel>
                            <FormControl><Input placeholder="Ej: Juan Pérez" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="petName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de la mascota</FormLabel>
                            <FormControl><Input placeholder="Ej: Firulais" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl><Input placeholder="Ej: Av. Siempre Viva 123" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="species" render={({ field }) => (
                         <FormItem>
                            <FormLabel>Especie</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione una especie" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Canino">Canino</SelectItem>
                                    <SelectItem value="Felino">Felino</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="age" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Edad</FormLabel>
                            <FormControl><Input placeholder="Ej: 5 años" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="sex" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sexo</FormLabel>
                            <FormControl><Input placeholder="Ej: Macho" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <div className="space-y-2">
                    <Label>Médico Veterinario</Label>
                    <p className="text-sm font-medium p-2 border rounded-md bg-muted">DR. Eduardo Peña</p>
                </div>
              <CardFooter className="flex justify-end gap-2 p-0 pt-6">
                  <Button type="button" variant="outline" onClick={handleReset}>Cancelar</Button>
                  <Button type="submit">Generar Informe PDF</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl bg-card">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
            <HeartPulse className="w-12 h-12 text-primary" />
            <CardTitle className="text-3xl font-headline">HEMATOLOGIA</CardTitle>
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
            {isLoading ? 'Procesando...' : 'Seleccionar Archivo CSV'}
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
