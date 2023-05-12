import { SVG, Svg, Text } from "@svgdotjs/svg.js";
import { calculateBoundingBox } from "./helper/boundingBoxHelper.js";
import neverHappens from "./helper/neverHappens.js";
import DisplayMatrixInterface, { SampleDisplayMatrixInterface } from "./interfaces/DisplayMatrixInterface.js";
import { isMolecule } from "./interfaces/MoleculeInterface.js";
import ReactionSampleInterface from "./interfaces/ReactionSampleInterface.js";

class ReactionSampleRenderer {
  displayMatrix: DisplayMatrixInterface;
  sampleDisplayMatrix: SampleDisplayMatrixInterface;
  sample: ReactionSampleInterface;
  domParser: DOMParser;
  draw: Svg;
  fontSize: number = 24;
  sampleTexts: string[] = [];
  coefficient?: Text;
  sampleIndex?: Text;
  sampleSvg?: Svg;
  yieldText?: Text;
  sampleText?: Text;
  biggestBBox: { height: number; width: number } = { height: 0, width: 0 };

  constructor(displayMatrix: DisplayMatrixInterface, sample: ReactionSampleInterface) {
    this.displayMatrix = displayMatrix;
    this.sample = sample;
    this.draw = SVG();
    this.domParser = new DOMParser();
    this.sampleDisplayMatrix = this.getDisplayConfigForSample(this.sample.sample_id);
    this.parseSampleDisplayMatrix();
  }

  private getDisplayConfigForSample(sampleId: Number | string) {
    const id = sampleId instanceof Number ? sampleId.toString() : sampleId;
    return this.displayMatrix.samples[id];
  }

  private selectFunctionDependingOnKey(feature: keyof SampleDisplayMatrixInterface): (value: boolean) => void {
    switch (feature) {
      case "coefficient":
        return this.generateCoefficient;
      case "sample_external_label":
        return this.generateExternalLabel;
      case "sample_short_label":
        return this.generateShortLabel;
      case "sample_name":
        return this.generateName;
      case "molecule_name":
        return this.generateMoleculeName;
      case "molecule_sum_formula":
        return this.generateMoleculeSumFormula;
      case "sample_index":
        return this.generateSampleIndex;
      case "svg":
        return this.generateSVG;
      case "yield_equivalent":
        return this.generateYield;
        break;

      default:
        // This should never happen, you probably forgot a key
        return neverHappens(feature);
    }
    return () => {};
  }

  public render() {
    this.renderSampleText();

    const group = this.draw.group();
    let horizontalOffset = 0;

    if (this.sampleDisplayMatrix && this.sampleDisplayMatrix.coefficient && this.coefficient) {
      this.coefficient.translate(horizontalOffset, this.fontSize / 2);
      group.add(this.coefficient);
      horizontalOffset += this.displayMatrix.elementMargin + this.coefficient.bbox().width;
    }

    if (this.sampleDisplayMatrix && this.sampleDisplayMatrix.svg && this.sampleSvg) {
      this.sampleSvg.x(horizontalOffset);
      this.sampleSvg.y(-this.sampleSvg.height() / 2);
      group.add(this.sampleSvg);
    } else if (this.sampleText) {
      this.sampleText.translate(horizontalOffset, this.fontSize / 2);
      group.add(this.sampleText);
    }

    this.biggestBBox = calculateBoundingBox(group);
    if (this.sampleDisplayMatrix && this.sampleDisplayMatrix.coefficient && this.coefficient) {
      this.biggestBBox.width += this.coefficient.bbox().width;
    } else {
      this.biggestBBox.width += this.displayMatrix.elementMargin;
    }

    return group;
  }

  public renderYield() {
    return this.sampleDisplayMatrix && this.sampleDisplayMatrix.yield_equivalent && this.yieldText;
  }

  public renderSampleText() {
    this.sampleText = this.draw.text((add) => {
      let name: string | undefined;
      this.sampleTexts.forEach((text) => {
        if (text && name == undefined) {
          name = text;
        }
      });
      add.tspan(`${name}`).newLine();
    });
    this.sampleText.leading(1.3);
    this.sampleText.font({ fill: "#000", size: this.fontSize });
    this.sampleText.addClass("sample__text");
    // Need to add dy here, because newLine doesn't work, maybe it will in the future
    let isFirst = true;
    this.sampleText.children().forEach(function (child) {
      !isFirst && child.dy(20);
      isFirst = false;
    });
  }

  private parseSampleDisplayMatrix() {
    let feature: keyof SampleDisplayMatrixInterface;
    for (feature in this.sampleDisplayMatrix) {
      const value = this.sampleDisplayMatrix[feature];
      this.selectFunctionDependingOnKey(feature).bind(this)(value);
    }
  }

  private generateCoefficient(showCoefficient: boolean) {
    // Check if Coefficient is not 1 and show Coefficient is true
    if (showCoefficient && this.sample.coefficient !== 1) {
      this.coefficient = this.draw.text(this.sample.coefficient.toString());
      this.coefficient.addClass("sample__coefficient");
      this.coefficient.font({ size: this.fontSize });
    }
  }

  private generateSampleIndex(showSampleIndex: boolean) {
    if (showSampleIndex && this.sample.sample_index) {
      this.sampleIndex = this.draw.text(this.sample.sample_index);
      this.sampleIndex.font({ size: 24 });
      this.sampleIndex.addClass("sample__index");
    }
  }

  private generateExternalLabel(showExternalLabel: boolean) {
    if (showExternalLabel && this.sample.sample_external_label) {
      this.sampleTexts[4] = this.sample.sample_external_label;
    }
  }

  private generateShortLabel(showShortLabel: boolean) {
    if (showShortLabel && this.sample.sample_short_label && this.sample.sample_short_label) {
      if (['ReactionsStartingMaterialSample', 'ReactionsProductSample'].includes(this.sample.type)) {
        this.sampleTexts[1] = this.sample.sample_short_label;
      } else {
        this.sampleTexts[2] = this.sample.sample_short_label;
      }
    }
  }

  private generateName(showName: boolean) {
    if (showName && this.sample.sample_name) {
      if (['ReactionsStartingMaterialSample', 'ReactionsProductSample'].includes(this.sample.type)) {
        this.sampleTexts[2] = this.sample.sample_name;
      } else {
        this.sampleTexts[0] = this.sample.sample_name;
      }
    }
  }

  private generateMoleculeName(showMoleculeName: boolean) {
    if (showMoleculeName && this.sample.molecule_name) {
      if (['ReactionsStartingMaterialSample', 'ReactionsProductSample'].includes(this.sample.type)) {
        if (isMolecule(this.sample.molecule_name)) {
          this.sampleTexts[0] = this.sample.molecule_name.label;
          return true;
        }
        if (this.sample.molecule_name) {
          this.sampleTexts[0] = this.sample.molecule_name;
        }
      } else {
        if (isMolecule(this.sample.molecule_name)) {
          this.sampleTexts[1] = this.sample.molecule_name.label;
          return true;
        }
        if (this.sample.molecule_name) {
          this.sampleTexts[1] = this.sample.molecule_name;
        }
      }
    }
  }

  private generateMoleculeSumFormula(showMoleculeSumFormula: boolean) {
    if (showMoleculeSumFormula && this.sample.sum_formula) {
      this.sampleTexts[3] = this.sample.sum_formula;
    }
  }

  private generateSVG(showSvg: boolean) {
    if (showSvg && this.sample.svgs.ketcher1) {
      const sampleId = this.sample.sample_id;
      const displayConfig = this.getDisplayConfigForSample(sampleId);
      // Currently we only have ketcher1 svgs, so we use those
      if (displayConfig.svg) {
        try {
          if (this.sample.svgs.ketcher1) {
            // Parse the saved string into an DOM Object for reading out information about the svg
            const parsedSVG = this.domParser.parseFromString(this.sample.svgs.ketcher1, "image/svg+xml");
            // If we don't have a svg element as document root, something is wrong with the input image
            if (!(parsedSVG.documentElement instanceof SVGElement)) {
              throw new Error("Something went wrong while reading svg");
            }
            const parsedSVGElement = parsedSVG.documentElement as SVGElement;
            // Put SVG into a nested svg
            const group = this.draw.nested().svg(parsedSVGElement.innerHTML, false);
            // Set the viewbox of the new group to the one of the original svg
            const viewBox = parsedSVGElement.getAttribute("viewBox") || parsedSVGElement.getAttribute("viewbox");
            if (viewBox) {
              group.viewbox(viewBox);
            }
            const groupViewBox = group.viewbox();
            group.width(groupViewBox.width);
            group.height(groupViewBox.height);
            this.biggestBBox = {
              width: groupViewBox.width,
              height: groupViewBox.height,
            };
            this.sampleSvg = group;
          }
        } catch (error) {
          this.sampleSvg = this.draw.nested();
          this.sampleSvg.text("Kein SVG vorhanden");
        }
      }
    }
  }

  private generateYield(showYield: boolean) {
    if (showYield && !!this.sample.equivalent) {
      // Convert equivalent to Percent
      const equivalent = `${Math.round(this.sample.equivalent * 100)}%`;
      this.yieldText = this.draw.text(equivalent);
      this.yieldText.font({ size: this.fontSize });
      this.yieldText.attr("text-anchor", "middle");
      this.yieldText.addClass("sample__yield");
      this.yieldText.data("bbox-width", this.yieldText.bbox().width);
    }
  }
}

export default ReactionSampleRenderer;
