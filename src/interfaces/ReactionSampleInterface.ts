import SVGType from "./SVGTypeEnum.js";
import MoleculeInterface from "./MoleculeInterface.js";
export type ReactionSampleTypes = "ReactionsStartingMaterialSample" | "ReactionsSolventSample" | "ReactionsPurificationSolventSample" | "ReactionsReactantSample" | "ReactionsProductSample";

export default interface ReactionSampleInterface {
  coefficient: number;
  equivalent: number | null;
  molecule_name: string | null | MoleculeInterface;
  position: number;
  sample_external_label: string;
  sample_id: number;
  sample_index: string;
  sample_name: string | null;
  sample_short_label: string;
  step: number;
  sum_formula: string | null;
  type: ReactionSampleTypes;
  svgs: {
    [key in SVGType]?: string;
  };
}
