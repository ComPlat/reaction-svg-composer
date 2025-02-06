import ConditionInterface from "./interfaces/ConditionInterface.js";
import DisplayMatrixInterface from "./interfaces/DisplayMatrixInterface.js";
import ReactionSampleInterface, { ReactionSampleTypes } from "./interfaces/ReactionSampleInterface.js";
import ReactionType from "./interfaces/ReactionType.js";
import TemperatureInterface from "./interfaces/TemperatureInterface.js";
import DurationInterface from "./interfaces/DurationInterface.js";
import { G, SVG, Svg, registerWindow } from "@svgdotjs/svg.js";
import { createSVGWindow } from "svgdom";
import ELNReactionInterface from "./interfaces/ELNReactionInterface.js";
import ReactionSample from "./classes/ReactionSample.js";
import SVGType from "./interfaces/SVGTypeEnum.js";
import ReactionGroupRenderer from "./ReactionGroupRenderer.js";
import ReactionArrow from "./ReactionArrow.js";
import { calculateBoundingBox } from "./helper/boundingBoxHelper.js";
import { Condition, Duration, Temperature } from "./classes/index.js";
import ConditionsRenderer from "./ConditionsRenderer.js";

class ReactionRenderer {
  static defaultDisplayMatrix: DisplayMatrixInterface = {
    condition: false,
    duration: true,
    multistep: false,
    solvent: true,
    samples: {},
    svg_type: SVGType.KETCHER1,
    temperature: true,
    elementMargin: 20,
  };
  private _displayMatrix!: DisplayMatrixInterface;
  private _reaction!: ReactionType;
  private conditions: ConditionInterface[] = [];
  private durations: DurationInterface[] = [];
  private temperatures: TemperatureInterface[] = [];
  // "ReactionsStartingMaterialSample" | "ReactionsPurificationSolventSample" | "ReactionsReactantSample" | "ReactionsProductSample";
  products: ReactionSampleInterface[] = [];
  purificationSolvents: ReactionSampleInterface[] = [];
  solvents: ReactionSampleInterface[] = [];
  reactants: ReactionSampleInterface[] = [];
  startingMaterials: ReactionSampleInterface[] = [];
  fullSvg: Svg;
  constructor(displayMatrix: DisplayMatrixInterface, reaction: ReactionType) {
    if (process.env.HEADLESS_REACTION_SVG === "true") {
      const window = createSVGWindow();
      const document = window.document;
      registerWindow(window, document);
    }
    this.fullSvg = SVG();
    this.displayMatrix = displayMatrix;
    this.reaction = reaction;
  }

  static convertELNReaction(elnReaction: ELNReactionInterface): Promise<ReactionType> {
    const startingMaterialsPromises = elnReaction.starting_materials.map((material) => ReactionSample.ReactionSampleFromELNSample(material, "ReactionsStartingMaterialSample")),
      solventsPromises = elnReaction.solvents.map((solvent) => ReactionSample.ReactionSampleFromELNSample(solvent, "ReactionsSolventSample")),
      purificationSolventsPromises = elnReaction.purification_solvents.map((purificationSolvent) => ReactionSample.ReactionSampleFromELNSample(purificationSolvent, "ReactionsPurificationSolventSample")),
      reactantsPromises = elnReaction.reactants.map((reactant) => ReactionSample.ReactionSampleFromELNSample(reactant, "ReactionsReactantSample")),
      productsPromises = elnReaction.products.map((product) => ReactionSample.ReactionSampleFromELNSample(product, "ReactionsProductSample"));
    return Promise.all([...startingMaterialsPromises, ...solventsPromises, ...purificationSolventsPromises, ...reactantsPromises, ...productsPromises]).then((reactionSamples) => {
      return [...reactionSamples, Condition.conditionFromELNCondition(elnReaction.conditions), Duration.durationFromELNDuration(elnReaction.durationDisplay), Temperature.temperatureFromENLTemperature(elnReaction.temperature)];
    });
  }

  private setResultBoundingBox(): void {
    const bbox = calculateBoundingBox(this.fullSvg, this.fullSvg);
    this.fullSvg.viewbox(bbox);
  }

  private getType(type: ReactionSampleTypes): ReactionSampleInterface[] {
    switch (type) {
      case "ReactionsProductSample":
        return this.products;
      case "ReactionsPurificationSolventSample":
        return this.purificationSolvents;
      case "ReactionsReactantSample":
        return this.reactants;
      case "ReactionsSolventSample":
        return this.solvents;
      case "ReactionsStartingMaterialSample":
        return this.startingMaterials;
      default:
        return [];
    }
  }

  public renderReaction() {
    // Create Starting Materials
    const startingGroup = new ReactionGroupRenderer(this.displayMatrix, this.getType("ReactionsStartingMaterialSample"));
    const productionGroup = new ReactionGroupRenderer(this.displayMatrix, this.getType("ReactionsProductSample"), true);
    const reactantsGroup = new ReactionGroupRenderer(this.displayMatrix, this.getType("ReactionsReactantSample"));
    const conditions = new ConditionsRenderer(this.conditions, this.durations, this.temperatures, this.getType("ReactionsSolventSample"), this.getType("ReactionsPurificationSolventSample"), this.displayMatrix);

    // Render Starting Group
    const renderedStartingGroup = startingGroup.render();
    this.fullSvg.add(renderedStartingGroup);
    const startingGroupBBox = startingGroup.generateBBox(this.fullSvg);
    // Render Reactants
    const renderedReactantsGroup = reactantsGroup.render();
    const reactantsGroupBBox = reactantsGroup.generateBBox(this.fullSvg);

    this.fullSvg.add(renderedReactantsGroup);

    // Position Conditions under the arrow
    const conditionsWidthArray: number[] = [250, reactantsGroupBBox?.width || 0];
    const conditionsWidth = Math.max(...conditionsWidthArray);

    const renderedConditions = conditions.render(conditionsWidth);
    const conditionsBBox = calculateBoundingBox(renderedConditions, this.fullSvg);
    this.fullSvg.add(renderedConditions);

    const arrowWidthArray: number[] = [conditionsWidth, conditionsBBox?.width || 0];
    const reactionArrowWidth = Math.max(...arrowWidthArray);
    // reaction arrow and reactants start point
    const reactantsArrowStartingOffset = startingGroupBBox.width + this.displayMatrix.elementMargin;

    renderedConditions.translate(reactantsArrowStartingOffset + reactionArrowWidth / 2, this.displayMatrix.elementMargin * 2);
    // Render Reaction Arrow
    const reactionArrow = new ReactionArrow(reactionArrowWidth);
    const renderedReactionArrow = reactionArrow.render();
    renderedReactionArrow.translate(reactantsArrowStartingOffset, 0);
    this.fullSvg.add(renderedReactionArrow);

    // Position Reactants above arrow
    renderedReactantsGroup.translate(reactantsArrowStartingOffset + reactionArrowWidth / 2 - reactantsGroupBBox.width / 2, -reactantsGroupBBox.height / 2 - this.displayMatrix.elementMargin * 2);

    const renderedProductsGroup = productionGroup.render();
    const productGroupBBox = productionGroup.generateBBox(this.fullSvg);
    // starting point of products group
    const startingOffsetProducts = reactantsArrowStartingOffset + reactionArrowWidth + this.displayMatrix.elementMargin;
    renderedProductsGroup.translate(startingOffsetProducts, 0);

    this.fullSvg.add(renderedProductsGroup);
    this.setResultBoundingBox();
    const svg = this.fullSvg.svg();
    return svg;
  }

  public debugBBoxes(boundingBoxes: G[]) {
    boundingBoxes.forEach((group) => {
      const box = calculateBoundingBox(group, this.fullSvg);
      this.fullSvg.rect(box.width, box.height).x(box.x).y(box.y).stroke({ width: 1, color: "#000" }).fill("transparent");
    });
  }

  public set reaction(reaction: ReactionType) {
    this._reaction = reaction;
    // Iterate over array to parse information
    for (let ReactionElementIndex = 0; ReactionElementIndex < this._reaction.length; ReactionElementIndex++) {
      const element = this._reaction[ReactionElementIndex];
      switch (element.type) {
        case "condition":
          this.conditions.push(element);
          break;
        case "duration":
          this.durations.push(element);
          break;
        case "temperature":
          this.temperatures.push(element);
          break;
        case "ReactionsProductSample":
          this.products.push(element);
          break;
        case "ReactionsPurificationSolventSample":
          this.purificationSolvents.push(element);
          break;
        case "ReactionsSolventSample":
          this.solvents.push(element);
          break;
        case "ReactionsReactantSample":
          this.reactants.push(element);
          break;
        case "ReactionsStartingMaterialSample":
          this.startingMaterials.push(element);
          break;

        default:
          break;
      }
    }
  }

  public get reaction(): ReactionType {
    return this._reaction;
  }

  public set displayMatrix(displayMatrix: DisplayMatrixInterface) {
    this._displayMatrix = { ...ReactionRenderer.defaultDisplayMatrix, ...displayMatrix };
  }

  public get displayMatrix(): DisplayMatrixInterface {
    return this._displayMatrix;
  }
}

export default ReactionRenderer;
