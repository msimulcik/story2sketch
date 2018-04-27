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
  let nodes;

  if (querySelector === "*") {
    nodes = document.querySelector("#root").firstChild;
  } else {
    nodes = document.querySelector(querySelector);
  }

  const color = nodes.getAttribute("data-sketch-color");
  const text = nodes.getAttribute("data-sketch-text");

  if (color) {
    return {
      type: "color",
      value: color
    };
  }

  if (text) {
    const textLayer = nodeToSketchLayers(nodes).filter(
      layer => layer instanceof Text
    )[0];
    textLayer.setName(text);
    return {
      type: "text",
      value: textLayer.toJSON()
    };
  }

  const layer = nodeTreeToSketchGroup(nodes, {
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
