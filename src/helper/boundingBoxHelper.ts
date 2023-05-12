import { G, Element, Svg, Box } from "@svgdotjs/svg.js";

export function calculateBoundingBox(group: Element, referenceSvg?: Svg): Box {
  const groupBox = group.bbox();
  if (groupBox.width !== 0 && groupBox.height !== 0) {
    return groupBox;
  }
  const boxes = group.children().map((child) => {
    try {
      const bbox = child.rbox(referenceSvg);
      if (bbox.width === 0 || bbox.height === 0) {
        throw new Error("Couldn't calculate BBox");
      }
      return bbox;
    } catch {
      if (child instanceof G || child instanceof Svg) {
        return calculateBoundingBox(child, referenceSvg);
      }
      return child.bbox();
    }
  });
  if (boxes.length === 0) {
    return new Box(0, 0, 0, 0);
  }
  return boxes.reduce((previousBBox, currentBBox) => {
    return previousBBox.merge(currentBBox);
  });
}
