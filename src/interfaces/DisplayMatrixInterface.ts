import SVGType from "./SVGTypeEnum.js";

export interface SampleDisplayMatrixInterface {
  coefficient: boolean;
  yield_equivalent: boolean;
  molecule_sum_formula: boolean;
  sample_name: boolean;
  sample_short_label: boolean;
  sample_external_label: boolean;
  molecule_name: boolean;
  sample_index: boolean;
  svg: boolean;
}

export const defaultSampleDisplayMatrix: SampleDisplayMatrixInterface = {
  coefficient: true,
  yield_equivalent: true,
  molecule_sum_formula: true,
  sample_name: true,
  sample_short_label: true,
  sample_external_label: false,
  molecule_name: true,
  sample_index: false,
  svg: true,
};

interface DisplayMatrixInterface {
  multistep: boolean;
  condition: boolean;
  temperature: boolean;
  duration: boolean;
  solvent: boolean;
  elementMargin: number;
  svg_type: SVGType;
  samples: {
    [key: string]: SampleDisplayMatrixInterface;
  };
}

export const defaultDisplayMatrix: DisplayMatrixInterface = {
  multistep: false,
  condition: true,
  temperature: true,
  duration: true,
  solvent: true,
  elementMargin: 20,
  svg_type: SVGType.KETCHER1,
  samples: {},
};

export default DisplayMatrixInterface;
