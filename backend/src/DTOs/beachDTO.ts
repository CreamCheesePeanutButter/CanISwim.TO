export interface BeachDTO {
  id: number;
  facilityName: string;
  address: string;
  type: string;
  inspectionStatus: string;
  lastInspectionDate: string;
  observation: string;
  infCategory: string;
  defectDescription: string;
  actionDescription: string;
  geometry: JSON;
}
