/**
 * @jest-environment jsdom
 */
import { createSVGWindow } from "svgdom";
const window = createSVGWindow();
const document = window.document;
import { SVG, registerWindow } from "@svgdotjs/svg.js";
registerWindow(window, document);
import ReactionRenderer from "../../src/ReactionRenderer.js";
import displayMatrix from "../../src/examples/displayMatrix.js";
import input, { inputTimeToMurderAndCreate, onlyProductsMaterial, onlyStartingMaterial } from "../../src/examples/input.js";
import { writeFileSync } from "fs";

describe("Reaction Renderer", () => {
  // it("should be created", () => {
  //   const rr = new ReactionRenderer(displayMatrix, inputTimeToMurderAndCreate);
  // });

  it("should render with svgs", () => {
    const samples = displayMatrix.samples;
    for (const sampleKey in samples) {
      if (Object.prototype.hasOwnProperty.call(samples, sampleKey)) {
        const sample = samples[sampleKey];
        sample.svg = true;
        sample.molecule_sum_formula = false;
      }
    }
    const rr = new ReactionRenderer(displayMatrix, input);
    const svgResult = rr.renderReaction();
    writeFileSync("test_svgs.svg", svgResult);
  });
  it("should render with labels", () => {
    const samples = displayMatrix.samples;
    for (const sampleKey in samples) {
      if (Object.prototype.hasOwnProperty.call(samples, sampleKey)) {
        const sample = samples[sampleKey];
        sample.svg = false;
        sample.molecule_sum_formula = true;
      }
    }
    const rr = new ReactionRenderer(displayMatrix, input);
    const svgResult = rr.renderReaction();
    writeFileSync("test_label.svg", svgResult);
  });
  it("should render svgs with only startingMaterials", () => {
    const samples = displayMatrix.samples;
    for (const sampleKey in samples) {
      if (Object.prototype.hasOwnProperty.call(samples, sampleKey)) {
        const sample = samples[sampleKey];
        sample.svg = true;
        sample.molecule_sum_formula = false;
      }
    }
    const rr = new ReactionRenderer(displayMatrix, onlyStartingMaterial);
    const svgResult = rr.renderReaction();
    writeFileSync("test_svg_only_starting.svg", svgResult);
  });
  it("should render labels with only startingMaterials", () => {
    const samples = displayMatrix.samples;
    for (const sampleKey in samples) {
      if (Object.prototype.hasOwnProperty.call(samples, sampleKey)) {
        const sample = samples[sampleKey];
        sample.svg = false;
        sample.molecule_sum_formula = true;
      }
    }
    const rr = new ReactionRenderer(displayMatrix, onlyStartingMaterial);
    const svgResult = rr.renderReaction();
    writeFileSync("test_label_only_starting.svg", svgResult);
  });
  it("should render svgs with only products", () => {
    const samples = displayMatrix.samples;
    for (const sampleKey in samples) {
      if (Object.prototype.hasOwnProperty.call(samples, sampleKey)) {
        const sample = samples[sampleKey];
        sample.svg = true;
        sample.molecule_sum_formula = false;
      }
    }
    const rr = new ReactionRenderer(displayMatrix, onlyProductsMaterial);
    const svgResult = rr.renderReaction();
    writeFileSync("test_svg_only_products.svg", svgResult);
  });
  it("should render labels with only products", () => {
    const samples = displayMatrix.samples;
    for (const sampleKey in samples) {
      if (Object.prototype.hasOwnProperty.call(samples, sampleKey)) {
        const sample = samples[sampleKey];
        sample.svg = false;
        sample.molecule_sum_formula = true;
      }
    }
    const rr = new ReactionRenderer(displayMatrix, onlyProductsMaterial);
    const svgResult = rr.renderReaction();
    writeFileSync("test_label_only_products.svg", svgResult);
  });
});
