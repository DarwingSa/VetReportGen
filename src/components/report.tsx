
'use client';

import type { ReportData, ResultRow } from '@/lib/hematology-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Printer, ArrowUp, ArrowDown, FilePlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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


export default function Report({ data, onReset }: { data: ReportData, onReset: () => void }) {
  const { patient, results } = data;

  const handlePrint = () => {
    window.print();
  };

  const midPoint = Math.ceil(results.length / 2);
  const firstHalf = results.slice(0, midPoint);
  const secondHalf = results.slice(midPoint);
  
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

      <Card className="print-container rounded-lg shadow-lg bg-card p-3 sm:p-5 print:text-sm">
        <CardHeader className="print:p-3 print:pb-0">
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-3xl font-headline text-card-foreground">THE PETS HOUSE</CardTitle>
                    <CardDescription className="text-xl">Informe de Hematología</CardDescription>
                </div>
                <div className="text-right">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/logo.png"
                    alt="Logo de la Clínica"
                    width={150}
                    height={120}
                    className="object-contain"
                    />
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 print:p-3">
            <Separator className="my-2 print:my-1" />
            <h3 className="text-lg font-semibold mb-2 font-headline">Datos del Paciente</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-6 p-3 print:p-2 bg-accent/50 rounded-md">
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

            <Separator className="my-2 print:my-1" />
            <h3 className="text-lg font-semibold mb-2 font-headline">Resultados</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 print:grid-cols-2 print:gap-x-4">
                 <div>
                    <ResultTable results={firstHalf} />
                </div>
                <div>
                    <ResultTable results={secondHalf} />
                </div>
            </div>

            <div className="mt-8 text-xs text-muted-foreground text-center">
                <p>LOS RANGOS DE REFERENCIA DEBEN SER INTERPRETADOS POR UN PROFESIONAL VETERINARIO.</p>
                <p>THE PETS HOUSE - Contacto: (0412) 553-9134</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

