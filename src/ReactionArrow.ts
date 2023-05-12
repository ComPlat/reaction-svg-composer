import { Svg, SVG } from "@svgdotjs/svg.js";

class ReactionArrow {
  fullSvg: Svg;
  arrowHeight: number = 2;
  arrowHeadLength: number = 15;
  arrowLength: number;
  constructor(arrowLength: number) {
    this.arrowLength = arrowLength;
    this.fullSvg = SVG();
  }

  render() {
    const group = this.fullSvg.group();
    group.add(this.fullSvg.line(0, this.arrowHeight * 1.5, this.arrowLength - this.arrowHeadLength * 0.8, this.arrowHeight * 1.5).stroke({ width: this.arrowHeight, color: "#000" })).fill("#000");
    group.add(
      this.fullSvg.polygon([
        [this.arrowLength - this.arrowHeadLength * 0.8, this.arrowHeight * 1.5],
        [this.arrowLength - this.arrowHeadLength, this.arrowHeight * 3],
        [this.arrowLength, this.arrowHeight * 1.5],
        [this.arrowLength - this.arrowHeadLength, this.arrowHeight * 0],
      ])
    );
    return group;
  }
}

export default ReactionArrow;
