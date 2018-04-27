import {
  SymbolMaster,
  nodeTreeToSketchGroup,
  nodeToSketchLayers,
  Text
} from "@brainly/html-sketchapp";

const getNodeName = node =>
  node.id || node.className || node.nodeName.toLowerCase();

export const getSymbol = ({
  name = "symbol",
  x = 0,
  y = 0,
  querySelector = "*"
} = {}) => {
  let node;

  if (querySelector === "*") {
    node = document.querySelector("#root").firstChild;
  } else {
    node = document.querySelector(querySelector);
  }

  const ignoreSymbol = node.getAttribute("data-sketch-ignore-symbol");
  const color = node.getAttribute("data-sketch-color");
  const text = node.getAttribute("data-sketch-text");

  if (color) {
    return {
      type: "color",
      value: color
    };
  }

  if (text) {
    const textLayer = nodeToSketchLayers(node).filter(
      layer => layer instanceof Text
    )[0];
    textLayer.setName(text);
    return {
      type: "text",
      value: textLayer.toJSON()
    };
  }

  if (ignoreSymbol) {
    const texts = node.querySelectorAll('["data-sketch-text"]');
    const colors = node.querySelectorAll('["data-sketch-color"]');

    // colors.map(color => );
  }

  const layer = nodeTreeToSketchGroup(node, {
    getGroupName: getNodeName,
    getRectangleName: getNodeName
  });

  const symbol = new SymbolMaster({ x, y });

  symbol.setName(name);
  symbol.addLayer(layer);

  return {
    type: "symbol",
    value: symbol.toJSON()
  };
};
