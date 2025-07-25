import { Premise } from "../premises/premise.js";
import { ScrapieFlockInfo } from "../scrapie/scrapieFlockInfo.js";
import { Company } from "./company.js";
import { Contact } from "./contact.js";
import { OwnerType } from "./ownerType.js";

interface OwnerBase {
  premise: Premise;
  scrapieId: ScrapieFlockInfo | null;
  phoneNumber: string;
  flockId: string;
}

export interface OwnerContact extends OwnerBase {
  type: OwnerType.CONTACT;
  contact: Contact;
}

export interface OwnerCompany extends OwnerBase {
  type: OwnerType.COMPANY;
  company: Company;
}

export type Owner = OwnerContact | OwnerCompany;
