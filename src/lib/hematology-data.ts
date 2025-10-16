export interface PatientData {
  id: string;
  species: string;
  date: string;
  owner: string;
}

export interface ResultRow {
  parameter: string;
  result: string;
  indicator: '↑' | '↓' | '';
  range: string;
  unit: string;
}

export interface ReportData {
  patient: PatientData;
  results: ResultRow[];
}

// Reference ranges for dogs. Values are examples.
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
};

export const parametersToInclude = [
  'WBC', 'RBC', 'HGB', 'HCT', 'MCV', 'MCH', 'MCHC', 'PLT', 'RDW_CV', 'MPV'
];
