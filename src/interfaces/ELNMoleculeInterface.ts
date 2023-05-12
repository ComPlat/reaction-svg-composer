import ELNElementInterface from "./ELNElementInterface.js";

export default interface ELNMoleculeInterface extends ELNElementInterface {
  molecular_weight: number;
  exact_molecular_weight: string;
  density: number;
  melting_point: number;
  boiling_point: number;
  inchistring: string;
  cano_smiles: string;
  inchikey: string;
}
