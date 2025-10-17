
'use client';

import type { ReportData, ResultRow } from '@/lib/hematology-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Printer, ArrowUp, ArrowDown, FilePlus, HeartPulse } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ReportProps {
  data: ReportData;
  onReset: () => void;
}

const ResultTable = ({ results }: { results: ResultRow[] }) => (
    <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold w-[40%]">Parámetro</TableHead>
                    <TableHead className="text-right font-bold">Res.</TableHead>
                    <TableHead className="text-center font-bold">Ind.</TableHead>
                    <TableHead className="text-center font-bold">Referencia</TableHead>
                    <TableHead className="font-bold">Unidad</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {results.map((row) => (
                    <TableRow key={row.parameter} className={row.indicator ? 'bg-destructive/10' : ''}>
                        <TableCell className="font-medium">{row.parameter}</TableCell>
                        <TableCell className="text-right font-mono">{row.result}</TableCell>
                        <TableCell className="text-center px-1">
                            {row.indicator === '↑' && <ArrowUp className="h-4 w-4 text-destructive inline-block" />}
                            {row.indicator === '↓' && <ArrowDown className="h-4 w-4 text-destructive inline-block" />}
                        </TableCell>
                        <TableCell className="text-center font-mono">{row.range}</TableCell>
                        <TableCell className="whitespace-nowrap">{row.unit}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);


export default function Report({ data, onReset }: ReportProps) {
  const { patient, results } = data;

  const handlePrint = () => {
    window.print();
  };

  const useTwoColumns = results.length > 15;
  const midPoint = useTwoColumns ? Math.ceil(results.length / 2) : 0;

  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-end gap-2 mb-4 no-print">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir o Guardar como PDF
        </Button>
        <Button variant="outline" onClick={onReset}>
          <FilePlus className="mr-2 h-4 w-4" />
          Generar Nuevo Informe
        </Button>
      </div>

      <Card className="print-container rounded-lg shadow-lg bg-card p-4 sm:p-6">
        <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-4xl font-headline text-card-foreground">THE PETS HUOSE</CardTitle>
                    <CardDescription className="text-xl">Informe de Hematología</CardDescription>
                </div>
                <HeartPulse className="w-16 h-16 text-primary" />
            </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2 font-headline">Datos del Paciente</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-6 p-4 bg-accent/50 rounded-md">
                <div><strong>ID Muestra:</strong> {patient.id}</div>
                <div><strong>Propietario:</strong> {patient.ownerName}</div>
                <div><strong>Mascota:</strong> {patient.petName}</div>
                <div><strong>Dirección:</strong> {patient.address}</div>
                <div><strong>Especie:</strong> {patient.species}</div>
                <div><strong>Raza:</strong> {patient.race}</div>
                <div><strong>Edad:</strong> {patient.age}</div>
                <div><strong>Sexo:</strong> {patient.sex}</div>
                <div><strong>Fecha:</strong> {patient.date}</div>
            </div>
             <div className="mb-6">
                <strong>M.V. que remite:</strong> {patient.vet}
            </div>

            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2 font-headline">Resultados</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 print:grid-cols-2 print:gap-x-4">
                {useTwoColumns ? (
                  <>
                    <ResultTable results={results.slice(0, midPoint)} />
                    <ResultTable results={results.slice(midPoint)} />
                  </>
                ) : (
                  <ResultTable results={results} />
                )}
            </div>

            <div className="mt-8 text-xs text-muted-foreground text-center">
                <p>LOS RANGOS DE REFERENCIA DEBEN SER INTERPRETADOS POR UN PROFESIONAL VETERINARIO.</p>
                <p>THE PETS HUOSE - Contacto: (0412) 553-9134</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
