import {
  SymbolMaster,
  nodeTreeToSketchGroup,
  nodeToSketchLayers,
  Text
} from "@brainly/html-sketchapp";

const getNodeName = node =>
  node.id || node.className || node.nodeName.toLowerCase();

const nodeToText = (node, name) => {
  const textLayer = nodeToSketchLayers(node).filter(
    layer => layer instanceof Text
  )[0];
  textLayer.setName(name);
  return textLayer.toJSON();
};

const nodeToSymbol = (node, name, x, y) => {
  const layer = nodeTreeToSketchGroup(node, {
    getGroupName: getNodeName,
    getRectangleName: getNodeName
  });
  const symbol = new SymbolMaster({ x, y });

  symbol.setName(name);
  symbol.addLayer(layer);

  return symbol.toJSON();
};

export const getSymbol = ({ querySelector = "*", name = "symbol" } = {}) => {
  let node;

  if (querySelector === "*") {
    node = document.querySelector("#root").firstChild;
  } else {
    node = document.querySelector(querySelector);
  }

  const colorNodes = node.querySelectorAll("[data-sketch-color]");
  const textNodes = node.querySelectorAll("[data-sketch-text]");
  const symbolNodes = node.querySelectorAll("[data-sketch-symbol]");

  const colorValues = Array.prototype.map.call(colorNodes, colorNode =>
    colorNode.getAttribute("data-sketch-color")
  );

  const textValues = Array.prototype.map.call(textNodes, textNode => {
    const textName = textNode.getAttribute("data-sketch-text");
    return nodeToText(textNode, textName);
  });

  const symbolValues = Array.prototype.map.call(symbolNodes, symbolNode => {
    const symbolName =
      name + "/" + symbolNode.getAttribute("data-sketch-symbol");
    const { x, y } = symbolNode.getBoundingClientRect();
    return nodeToSymbol(symbolNode, symbolName, x, y);
  });

  const res = {};
  if (colorValues.length) {
    res.colors = colorValues;
  }

  if (textValues.length) {
    res.texts = textValues;
  }

  if (symbolValues.length) {
    res.symbols = symbolValues;
  }
  return res;
};
