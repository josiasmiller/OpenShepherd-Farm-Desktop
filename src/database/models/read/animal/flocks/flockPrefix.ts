import { OwnerType } from "../../owners/ownerType";

export type FlockPrefix = {
  id: string;
  name: string;
  owner_id: string;
  owner_type: OwnerType
  registry_company_id: string | null;
}
      