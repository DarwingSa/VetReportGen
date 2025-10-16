'use client';

import type { ReportData } from '@/lib/hematology-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Printer, ArrowUp, ArrowDown, FilePlus, HeartPulse } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ReportProps {
  data: ReportData;
  onReset: () => void;
}

export default function Report({ data, onReset }: ReportProps) {
  const { patient, results } = data;

  return (
    <div className="w-full max-w-4xl">
      <div className="flex justify-end gap-2 mb-4 no-print">
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir o Guardar como PDF
        </Button>
        <Button variant="outline" onClick={onReset}>
          <FilePlus className="mr-2 h-4 w-4" />
          Generar Nuevo Informe
        </Button>
      </div>

      <Card className="print-container rounded-lg shadow-lg bg-card">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-4xl font-headline text-card-foreground">THE PETS HUOSE</CardTitle>
                    <CardDescription className="text-xl">Informe de Hematología</CardDescription>
                </div>
                <HeartPulse className="w-16 h-16 text-primary" />
            </div>
        </CardHeader>
        <CardContent className="p-6">
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2 font-headline">Datos del Paciente</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-6 p-4 bg-accent/50 rounded-md">
                <div><strong>Mascota ID:</strong> {patient.id}</div>
                <div><strong>Propietario:</strong> {patient.owner}</div>
                <div><strong>Especie:</strong> {patient.species}</div>
                <div><strong>Fecha del examen:</strong> {patient.date}</div>
            </div>

            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2 font-headline">Resultados</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Parámetro</TableHead>
                    <TableHead className="text-right font-bold">Resultado</TableHead>
                    <TableHead className="text-center font-bold">Indicador</TableHead>
                    <TableHead className="text-center font-bold">Rangos de Referencia</TableHead>
                    <TableHead className="font-bold">Unidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((row) => (
                    <TableRow key={row.parameter} className={row.indicator ? 'bg-destructive/10' : ''}>
                      <TableCell className="font-medium">{row.parameter}</TableCell>
                      <TableCell className="text-right font-mono">{row.result}</TableCell>
                      <TableCell className="text-center">
                        {row.indicator === '↑' && <ArrowUp className="h-4 w-4 text-destructive inline-block" />}
                        {row.indicator === '↓' && <ArrowDown className="h-4 w-4 text-destructive inline-block" />}
                      </TableCell>
                      <TableCell className="text-center font-mono">{row.range}</TableCell>
                      <TableCell>{row.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-8 text-xs text-muted-foreground text-center">
                <p>Este es un informe autogenerado. Los rangos de referencia son para la especie canina y deben ser interpretados por un profesional veterinario.</p>
                <p>THE PETS HUOSE - Contacto: (123) 456-7890</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
