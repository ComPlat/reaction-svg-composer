import ELNSampleInterface from "../interfaces/ELNSampleInterface.js";
import ReactionSampleInterface, { ReactionSampleTypes } from "../interfaces/ReactionSampleInterface.js";
import SVGType from "../interfaces/SVGTypeEnum.js";

export interface ReactionSampleConstructorInterface {
  sample_id: number;
  position?: number;
  step?: number;
  coefficient?: number;
  type: ReactionSampleTypes;
  equivalent: number | null;
  molecule_name: string | null;
  sample_short_label?: string;
  sample_index?: string;
  sample_external_label: string;
  sample_name: string | null;
  sum_formula: string;
  svgs: {
    [key in SVGType]?: string;
  };
}

export class ReactionSample implements ReactionSampleInterface {
  sample_id: number;
  position: number;
  step: number;
  type: ReactionSampleTypes;
  coefficient: number;
  equivalent: number | null;
  molecule_name: string | null;
  sample_short_label: string;
  sample_index: string;
  sample_external_label: string;
  sample_name: string | null;
  sum_formula: string;
  svgs: { ketcher?: string | undefined; ketcher1?: string | undefined; ketcher2?: string | undefined; chemdraw19?: string | undefined; marvin?: string | undefined };

  constructor(parameters: ReactionSampleConstructorInterface) {
    const { sample_id, position, step, coefficient, type, sample_short_label, sample_index, sample_external_label, sample_name, sum_formula, svgs, molecule_name, equivalent } = parameters;
    this.sample_id = sample_id;
    this.position = position || 0;
    this.step = step || 1;
    this.type = type;
    this.sample_short_label = sample_short_label || "New Sample";
    this.sample_index = sample_index || "0";
    this.sample_external_label = sample_external_label;
    this.sample_name = sample_name;
    this.sum_formula = sum_formula;
    this.svgs = svgs;
    this.molecule_name = molecule_name;
    this.equivalent = equivalent;
    this.coefficient = coefficient || 1;
  }

  static fetchSvg(svgUrl?: string) {
    const fullSvgUrl = svgUrl ? `/images/samples/${svgUrl}` : `/images/wild_card/no_image_180.svg`;
    return fetch(fullSvgUrl)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        return text.replace("\n", "");
      });
  }

  static ReactionSampleFromELNSample(sample: ELNSampleInterface, type: ReactionSampleTypes): Promise<ReactionSample> {
    return ReactionSample.fetchSvg(sample.sample_svg_file).then((svg) => {
      const reactionSample = new ReactionSample({
        sample_id: sample.id,
        type: type,
        equivalent: sample.equivalent,
        molecule_name: sample.molecule_name,
        sample_external_label: sample.external_label,
        sample_short_label: sample.short_label === "reactant" ? "New Reactant" : sample.short_label,
        sample_name: sample.name,
        sum_formula: sample.sum_formula,
        coefficient: sample.coefficient,
        svgs: {
          ketcher1: svg,
        },
      });
      return reactionSample;
    });
  }
}

export default ReactionSample;
