import { Premise } from "../premises/premise";
import { Company } from "./company";
import { Contact } from "./contact";
import { OwnerType } from "./ownerType";

type OwnerContact = {
  type: OwnerType.CONTACT;
  contact: Contact;
  premise: Premise;
  scrapieId: string;
};

type OwnerCompany = {
  type: OwnerType.COMPANY;
  company: Company;
  premise: Premise;
  scrapieId: string;
};

export type Owner = OwnerContact | OwnerCompany;
