import { Company } from "./company";
import { Contact } from "./contact";
import { OwnerType } from "./ownerType";

type OwnerContact = {
  type: OwnerType.CONTACT;
  contact: Contact;
};

type OwnerCompany = {
  type: OwnerType.COMPANY;
  company: Company;
};

export type OwnerResult = OwnerContact | OwnerCompany;
