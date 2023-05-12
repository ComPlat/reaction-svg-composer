import { SVG } from "@svgdotjs/svg.js";

export function calculateTextBoundingBox(text: string, fontObject: object) {
  const svg = SVG();
  const textSvg = svg.text(text);
  textSvg.font(fontObject);
  return textSvg.bbox();
}

export function wrapTextByMaximumWidth(text: string, maxWidth: number, fontObject: object): string[] {
  let wrappedText: string[] = [];
  let currentLine = "";
  // Split text by spaces
  if (!text || text.length === 0) {
    return wrappedText;
  }
  const lineSplittedTexts = text.split(/[\n]/);
  for (let index = 0; index < lineSplittedTexts.length; index++) {
    const lineSplittedText = lineSplittedTexts[index];
    const splittedText = lineSplittedText.split(/[\s]/);
    for (const word of splittedText) {
      const newLine = `${currentLine}${word} `;
      const newBoundingBox = calculateTextBoundingBox(newLine, fontObject);

      if (newBoundingBox.width > maxWidth) {
        wrappedText.push(currentLine.trim());
        currentLine = `${word} `;
      } else {
        currentLine = newLine;
      }
    }
    if (currentLine.trim().length > 0) {
      wrappedText.push(currentLine.trim());
    }
    currentLine = '';
  }
  return wrappedText;
}
