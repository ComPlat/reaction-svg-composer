import { Box, G, Svg, SVG, Text } from "@svgdotjs/svg.js";
import jsdom from "jsdom";

import { calculateBoundingBox } from "./helper/boundingBoxHelper.js";
import DisplayMatrixInterface from "interfaces/DisplayMatrixInterface.js";
import ReactionSampleInterface from "interfaces/ReactionSampleInterface.js";
import ReactionSampleRenderer from "./ReactionSampleRenderer.js";


if (process.env.HEADLESS === "true") {
  const dom = new jsdom.JSDOM('');
  global.DOMParser = dom.window.DOMParser;
}

class ReactionGroupRenderer {
  private _samples!: ReactionSampleInterface[];
  private displayMatrix: DisplayMatrixInterface;
  private draw: Svg;
  private sampleRenderer?: ReactionSampleRenderer[];

  private _groupBBox!: Box;
  private _cacheRenderedGroup!: G;

  private fontSize = 24;

  domParser: DOMParser;
  showYield: boolean;
  constructor(displayMatrix: DisplayMatrixInterface, samples: ReactionSampleInterface[], showYield = false) {
    this.samples = samples;
    this.displayMatrix = displayMatrix;
    this.showYield = showYield;
    this.draw = SVG();
    this.domParser = new DOMParser();
    this.createSVGFromSamples();
  }

  public render() {
    if (this._cacheRenderedGroup) {
      return this._cacheRenderedGroup;
    }
    const group = this.draw.group();
    const height = this.calculateBiggestHeight();
    const yieldTexts: Text[] = [];
    let horizontalOffset = 0;
    const sampleCount = this.sampleRenderer?.length || 0;
    this.sampleRenderer?.forEach((sampleRenderer, index) => {
      const rendered = sampleRenderer.render();
      rendered.addClass("sample");
      rendered.translate(horizontalOffset, 0);
      // Render Yield
      const renderedYield = sampleRenderer.renderYield();
      if (this.showYield && renderedYield) {

        renderedYield.translate(
          horizontalOffset + sampleRenderer.biggestBBox.width / 2 - renderedYield.data("bbox-width") / 2 + this.displayMatrix.elementMargin,
          height / 2 + this.displayMatrix.elementMargin * 2
        );

        yieldTexts.push(renderedYield);
        group.add(renderedYield);
      }
      horizontalOffset += sampleRenderer.biggestBBox.width + this.displayMatrix.elementMargin;
      if (index < sampleCount - 1) {
        const plusBBox = this.addPlus(group, horizontalOffset);
        horizontalOffset += plusBBox.width + this.displayMatrix.elementMargin;
      }
      group.add(rendered);
    });
    this._cacheRenderedGroup = group;
    return group;
  }

  generateBBox(referenceSVG: Svg): Box {
    if (this._groupBBox) {
      return this._groupBBox;
    }
    if (this._cacheRenderedGroup) {
      this._groupBBox = calculateBoundingBox(this._cacheRenderedGroup, referenceSVG);
      return this._groupBBox;
    }
    this.render();
    return this.generateBBox(referenceSVG);
  }

  private addPlus(group: G, offset: number) {
    const plus = this.draw.text("+");
    plus.addClass("group__plus");
    plus.attr("text-anchor", "middle");
    plus.font({ size: this.fontSize });
    plus.translate(offset, this.fontSize / 2);

    const plusBBox = plus.bbox();
    group.add(plus);
    return plusBBox;
  }

  private calculateBiggestHeight() {
    // Get heights
    const heightList = this.sampleRenderer?.map((sample) => sample.biggestBBox.height);
    if (heightList && heightList?.length > 0) {
      return heightList.reduce((previous, current) => Math.max(previous, current)) || this.fontSize;
    }
    return 0;
  }

  private createSVGFromSamples() {
    this.sampleRenderer = this.samples.map(this.createSample.bind(this));
  }

  private createSample(sample: ReactionSampleInterface) {
    return new ReactionSampleRenderer(this.displayMatrix, sample);
  }

  public get samples(): ReactionSampleInterface[] {
    return this._samples;
  }

  public set samples(v: ReactionSampleInterface[]) {
    this._samples = v.sort((a, b) => {
      return a.sample_index < b.sample_index ? -1 : 1;
    });
  }
}

export default ReactionGroupRenderer;
