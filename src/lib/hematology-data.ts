export interface PatientData {
  id: string;
  ownerName: string;
  petName: string;
  address: string;
  species: 'Canino' | 'Felino';
  age: string;
  sex: string;
  vet: string;
  date: string;
}

export interface ResultRow {
  parameter: string;
  result: string;
  indicator: '↑' | '↓' | '';
  range: string;
  unit: string;
}

export interface CsvData {
  patient: Pick<PatientData, 'id' | 'date'>;
  results: ResultRow[];
}


export interface ReportData {
  patient: PatientData;
  results: ResultRow[];
}

// Reference ranges for dogs.
export const dogReferenceRanges: { [key: string]: { min: number; max: number; unit: string } } = {
  'WBC': { min: 5.5, max: 16.9, unit: '10^3/μL' },
  'RBC': { min: 5.65, max: 8.87, unit: '10^6/μL' },
  'HGB': { min: 13.1, max: 20.5, unit: 'g/dL' },
  'HCT': { min: 39.2, max: 61.7, unit: '%' },
  'MCV': { min: 61.6, max: 73.5, unit: 'fL' },
  'MCH': { min: 21.2, max: 25.9, unit: 'pg' },
  'MCHC': { min: 32.7, max: 35.8, unit: 'g/dL' },
  'RDW_CV': { min: 13.5, max: 18.4, unit: '%' },
  'PLT': { min: 148, max: 484, unit: '10^3/μL' },
  'MPV': { min: 9.4, max: 12.6, unit: 'fL' },
  'LYM#': { min: 0.92, max: 8.8, unit: '10^3/μL' },
  'MON#': { min: 0.1, max: 1.1, unit: '10^3/μL' },
  'GRA#': { min: 3.0, max: 12.0, unit: '10^3/μL' },
  'LYM%': { min: 12.0, max: 30.0, unit: '%' },
  'MON%': { min: 3.0, max: 10.0, unit: '%' },
  'GRA%': { min: 60.0, max: 83.0, unit: '%' },
};

// Reference ranges for cats.
export const catReferenceRanges: { [key: string]: { min: number; max: number; unit: string } } = {
    'WBC': { min: 2.87, max: 17.02, unit: '10^3/μL' },
    'RBC': { min: 6.54, max: 12.2, unit: '10^6/μL' },
    'HGB': { min: 9.8, max: 16.2, unit: 'g/dL' },
    'HCT': { min: 30.3, max: 52.3, unit: '%' },
    'MCV': { min: 35.9, max: 53.1, unit: 'fL' },
    'MCH': { min: 11.8, max: 17.3, unit: 'pg' },
    'MCHC': { min: 28.1, max: 35.8, unit: 'g/dL' },
    'RDW_CV': { min: 15.0, max: 27.0, unit: '%' },
    'PLT': { min: 151, max: 600, unit: '10^3/μL' },
    'MPV': { min: 10.9, max: 22.0, unit: 'fL' },
    'LYM#': { min: 0.92, max: 6.88, unit: '10^3/μL' },
    'MON#': { min: 0.05, max: 0.67, unit: '10^3/μL' },
    'GRA#': { min: 1.48, max: 10.29, unit: '10^3/μL' },
    'LYM%': { min: 20.0, max: 55.0, unit: '%' },
    'MON%': { min: 1.0, max: 4.0, unit: '%' },
    'GRA%': { min: 35.0, max: 75.0, unit: '%' },
};
