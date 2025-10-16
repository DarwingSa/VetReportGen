# **App Name**: VETReportGen

## Core Features:

- CSV Import: Allows the user to select a CSV file containing hematology data.
- Data Extraction & Parsing: Extracts relevant patient information and hematology parameters from the CSV file using Pandas.
- Reference Range Mapping: Maps the extracted hematology parameters to predefined reference ranges for dogs.
- PDF Report Generation: Generates a professional PDF report with patient information, a results table, and indicators for out-of-range values using FPDF2.
- Filename Definition: Filenames are defined based on ID extracted from the original CSV.
- Status updates: Label to inform users about current action.

## Style Guidelines:

- Primary color: Light cyan (#E0FFFF) for a clean and professional feel, reminiscent of medical environments.
- Background color: Very pale cyan (#F0FFFF) to maintain a light and airy aesthetic.
- Accent color: Soft blue (#ADD8E6) for buttons and interactive elements, providing visual clarity.
- Headline font: 'Alegreya', serif, providing a contemporary feel. Body font: 'PT Sans', sans-serif
- Simple, clear icons to represent different parameters in the report. To indicate abnormal values show arrows that do not distract from main task.
- Clean and organized layout with clear sections for patient data, results table, and any additional notes.