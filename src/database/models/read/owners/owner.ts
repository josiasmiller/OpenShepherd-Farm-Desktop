import { Premise } from "../premises/premise";
import { Company } from "./company";
import { Contact } from "./contact";
import { OwnerType } from "./ownerType";

type OwnerContact = {
  type: OwnerType.CONTACT;
  contact: Contact;
  premise: Premise;
};

type OwnerCompany = {
  type: OwnerType.COMPANY;
  company: Company;
  premise: Premise;
};

export type Owner = OwnerContact | OwnerCompany;
