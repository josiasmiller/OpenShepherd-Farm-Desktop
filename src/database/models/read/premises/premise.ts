import { State } from "../locations/state";

export type Premise = {
  id: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  state: State;
}
