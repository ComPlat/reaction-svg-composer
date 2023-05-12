import { SVG, Svg } from "@svgdotjs/svg.js";
import { wrapTextByMaximumWidth } from "./helper/calculateTextWidth.js";
import ConditionInterface from "interfaces/ConditionInterface.js";
import DisplayMatrixInterface from "interfaces/DisplayMatrixInterface.js";
import DurationInterface from "interfaces/DurationInterface.js";
import TemperatureInterface from "interfaces/TemperatureInterface.js";
import ReactionSampleInterface from "interfaces/ReactionSampleInterface.js";
import  { isMolecule } from "./interfaces/MoleculeInterface.js";

const defaultConditionStep = {
  solvents: [],
  purificationSolvents: [],
};

class ConditionsRenderer {
  static OFFSET: number = 26;
  conditions: ConditionInterface[];
  durations: DurationInterface[];
  temperatures: TemperatureInterface[];
  solvents: ReactionSampleInterface[];
  purificationSolvents: ReactionSampleInterface[];
  steps: { condition: ConditionInterface; duration: DurationInterface; temperature: TemperatureInterface; solvents?: ReactionSampleInterface[]; purificationSolvents?: ReactionSampleInterface[] }[] = [];
  fullSvg: Svg;
  displayMatrix: DisplayMatrixInterface;
  constructor(conditions: ConditionInterface[], durations: DurationInterface[], temperatures: TemperatureInterface[], solvents: ReactionSampleInterface[], purificationSolvents: ReactionSampleInterface[], displayMatrix: DisplayMatrixInterface) {
    this.conditions = conditions;
    this.durations = durations;
    this.temperatures = temperatures;
    this.solvents = solvents;
    this.purificationSolvents = purificationSolvents;
    this.fullSvg = SVG();
    this.displayMatrix = displayMatrix;
    this.groupByStep();
  }

  render(width: number) {
    const group = this.fullSvg.group();
    let currentVerticalOffset = 0;
    this.steps.forEach((step, index) => {
      const otherConditions = [];
      // Add other Conditions to array for rendering
      step.purificationSolvents && otherConditions.push(step.purificationSolvents.map((solvent) => solvent.sample_name).join(", "));
      step.temperature && step.temperature.value.userText !== "" && otherConditions.push(`${step.temperature.value.userText} ${step.temperature.value.valueUnit}`);
      step.duration && otherConditions.push(step.duration.value);

      const wrappedSolventConditions = step.solvents && step.solvents.length > 0 ? wrapTextByMaximumWidth(step.solvents.map((solvent) => {
        let name = solvent.sample_external_label || solvent.sample_name;

        if (!name) {
          if (isMolecule(solvent.molecule_name)) {
            name = solvent.molecule_name.label;
          } else if (solvent.molecule_name) {
            name = solvent.molecule_name;
          } else {
            name = solvent.sample_short_label;
          }
        }

        return name;
      }).join(", "), width, { family: "sans-serif", fill: "#000", size: 24 }) : [];
      const wrappedConditions = step.condition && step.condition.value ? wrapTextByMaximumWidth(step.condition.value + ',', width, { family: "sans-serif", fill: "#000", size: 24 }) : [];
      const wrappedOtherConditions = wrapTextByMaximumWidth(otherConditions.filter((e) => e.trim().length > 0).join(", "), width, { family: "sans-serif", fill: "#000", size: 24 });
      const horizontalOffset = this.displayMatrix.multistep ? ConditionsRenderer.OFFSET : 0;
      const stepText = group.text((add) => {
        this.displayMatrix.multistep && add.tspan(`${index}. `);
        let lineAdded = false;
        wrappedSolventConditions.forEach((part) => {
          part.length > 0 && (lineAdded ? add.tspan(part + ',').dx(horizontalOffset).addClass("newLine").newLine() : add.tspan(part + ','));
          lineAdded = true;
        });
        wrappedConditions.forEach((part) => {
          part.length > 0 && (lineAdded ? add.tspan(part).dx(horizontalOffset).addClass("newLine").newLine() : add.tspan(part));
          lineAdded = true;
        });
        wrappedOtherConditions.forEach((part) => {
          part.length > 0 && lineAdded ? add.tspan(part).dx(horizontalOffset).addClass("newLine").newLine() : add.tspan(part);
          lineAdded = true;
        });
      });
      stepText.leading(1.3);
      stepText.font({ family: "sans-serif", fill: "#000", size: 24 });
      stepText.attr("text-anchor", "middle");
      stepText.addClass("sample__condition");
      stepText.dy(currentVerticalOffset);
      currentVerticalOffset += stepText.bbox().height;
      // This is needed to make line breaks in browser, don't know why it doesn't work there
      stepText.children().forEach((child) => {
        if (child.classes().includes("newLine") && !child.attr("dy")) {
          child.dy(31.2);
        }
      });
      group.add(stepText);
    });
    group.attr('dominant-baseline','hanging');
    // Need to add dy here, because newLine doesn't work, maybe it will in the future
    return group;
  }

  private groupByStep() {
    this.displayMatrix.condition &&
      this.conditions.forEach((condition) => {
        this.steps[condition.step] = this.steps[condition.step] || structuredClone(defaultConditionStep);
        this.steps[condition.step].condition = condition;
      });
    this.displayMatrix.temperature &&
      this.temperatures.forEach((temperature) => {
        this.steps[temperature.step] = this.steps[temperature.step] || structuredClone(defaultConditionStep);
        this.steps[temperature.step].temperature = temperature;
      });
    this.displayMatrix.duration &&
      this.durations.forEach((duration) => {
        this.steps[duration.step] = this.steps[duration.step] || structuredClone(defaultConditionStep);
        this.steps[duration.step].duration = duration;
      });
    this.displayMatrix.solvent &&
      this.solvents.forEach((solvent) => {
        this.steps[solvent.step] = this.steps[solvent.step] || structuredClone(defaultConditionStep);
        this.steps[solvent.step].solvents?.push(solvent);
      });
    this.displayMatrix.solvent &&
      this.purificationSolvents.forEach((purificationSolvent) => {
        this.steps[purificationSolvent.step] = this.steps[purificationSolvent.step] || structuredClone(defaultConditionStep);
        this.steps[purificationSolvent.step].purificationSolvents?.push(purificationSolvent);
      });
  }
}

export default ConditionsRenderer;
