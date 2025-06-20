import { Premise } from "../premises/premise";
import { ScrapieFlockInfo } from "../scrapie/scrapieFlockInfo";
import { Company } from "./company";
import { Contact } from "./contact";
import { OwnerType } from "./ownerType";

interface OwnerBase {
  premise: Premise;
  scrapieId: ScrapieFlockInfo;
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
