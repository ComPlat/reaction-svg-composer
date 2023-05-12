import ELNContainerInterface from "./ELNContainerInterface.js";
import ELNDurationInterface from "./ELNDurationInterface.js";
import ELNElementInterface from "./ELNElementInterface.js";
import ELNQuillInterface from "./ELNQuillInterface.js";
import ELNSampleInterface from "./ELNSampleInterface.js";
import ELNTemperatureInterface from "./ELNTemperatureInterface.js";

export default interface ELNReactionInterface extends ELNElementInterface {
  can_copy: boolean;
  can_update: boolean;
  collection_id: number;
  conditions: string;
  container: ELNContainerInterface;
  dangerous_products: string;
  description: ELNQuillInterface;
  duration: string;
  durationDisplay: ELNDurationInterface;
  id: number;
  literatures: {};
  name: string;
  observation: ELNQuillInterface;
  products: ELNSampleInterface[];
  purification_solvents: ELNSampleInterface[];
  purification: string[];
  reactants: ELNSampleInterface[];
  rf_value: number;
  role: string;
  solvent: string;
  solvents: ELNSampleInterface[];
  starting_materials: ELNSampleInterface[];
  status: string;
  temperature: ELNTemperatureInterface;
  timestamp_start: string;
  timestamp_stop: string;
  tlc_description: string;
  tlc_solvents: string;
  type: "reaction";
}
