export type DrugHistory = {
  id: string;
  tradeName: string;
  genericDrugName: string;
  drugLot: string;
  dateOn: string;
  timeOn: string;
  dateOff: string | null;
  timeOff: string | null;
  dosage: string;
  locationId: string;
  locationName: string;
}
            