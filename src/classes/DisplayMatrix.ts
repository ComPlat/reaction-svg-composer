import DisplayMatrixInterface, { SampleDisplayMatrixInterface } from "interfaces/DisplayMatrixInterface.js";
import ELNReactionInterface from "interfaces/ELNReactionInterface.js";
import ELNSampleInterface from "interfaces/ELNSampleInterface.js";
import { defaultSampleDisplayMatrix, defaultDisplayMatrix } from "./../interfaces/DisplayMatrixInterface.js";
import ReactionType from "./../interfaces/ReactionType.js";
import SVGType from "./../interfaces/SVGTypeEnum.js";

interface DisplayMatrixConstructorArgument {
  multistep?: boolean;
  condition?: boolean;
  temperature?: boolean;
  duration?: boolean;
  elementMargin?: number;
  svg_type?: SVGType;
  samples?: { [key: string]: SampleDisplayMatrixInterface };
}

export class DisplayMatrix implements DisplayMatrixInterface {
  multistep: boolean = false;
  condition: boolean = true;
  temperature: boolean = true;
  duration: boolean = true;
  solvent: boolean = true;
  elementMargin: number = 20;
  svg_type: SVGType = SVGType.KETCHER1;
  samples: { [key: string]: SampleDisplayMatrixInterface } = {};
  constructor({ multistep, condition, temperature, duration, elementMargin, svg_type, samples }: DisplayMatrixConstructorArgument) {
    this.multistep = multistep || this.multistep;
    this.condition = condition || this.multistep;
    this.temperature = temperature || this.temperature;
    this.duration = duration || this.duration;
    this.elementMargin = elementMargin || this.elementMargin;
    this.svg_type = svg_type || this.svg_type;
    this.samples = samples || this.samples;
  }

  static createDisplayMatrixFromELNReaction(reaction: ELNReactionInterface): DisplayMatrixInterface {
    const matrix = { ...defaultDisplayMatrix };
    let samples: ELNSampleInterface[] = [];
    samples = samples.concat(reaction.starting_materials, ...reaction.solvents, ...reaction.purification_solvents, ...reaction.reactants, ...reaction.products);
    samples.forEach((sample) => {
      matrix.samples[sample.id] = { ...defaultSampleDisplayMatrix };
      matrix.samples[sample.id].sample_name = sample.show_label;
      matrix.samples[sample.id].svg = !sample.show_label;
    });

    return new DisplayMatrix(matrix);
  }

  static createDisplayMatrixForReaction(reactions: ReactionType): DisplayMatrixInterface {
    const matrix: DisplayMatrixInterface = {
      condition: false,
      temperature: false,
      duration: false,
      solvent: true,
      svg_type: SVGType.KETCHER1,
      multistep: false,
      elementMargin: 20,
      samples: {},
    };
    reactions.forEach((reaction) => {
      switch (reaction.type) {
        case "condition":
          matrix.condition = true;
          break;
        case "duration":
          matrix.duration = true;
          break;
        case "temperature":
          matrix.temperature = true;
          break;
        case "ReactionsProductSample":
        case "ReactionsPurificationSolventSample":
        case "ReactionsReactantSample":
        case "ReactionsSolventSample":
        case "ReactionsStartingMaterialSample":
          matrix.samples[reaction.sample_id.toString()] = defaultSampleDisplayMatrix;
          break;

        default:
          break;
      }
    });
    return new DisplayMatrix(matrix);
  }
}

export default DisplayMatrix;
