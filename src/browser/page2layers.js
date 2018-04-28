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
      colors: [color]
    };
  }

  if (text) {
    return {
      texts: [nodeToText(node)]
    };
  }

  if (ignoreSymbol) {
    const colorNodes = node.querySelectorAll("[data-sketch-color]");
    const textNodes = node.querySelectorAll("[data-sketch-text]");

    const colorValues = Array.prototype.map.call(colorNodes, node =>
      node.getAttribute("data-sketch-color")
    );

    const textValues = Array.prototype.map.call(textNodes, node => {
      const name = node.getAttribute("data-sketch-text");
      return nodeToText(node, name);
    });

    const res = {};
    if (colorValues.length) {
      res.colors = colorValues;
    }

    if (textValues.length) {
      res.texts = textValues;
    }

    return res;
  }

  const layer = nodeTreeToSketchGroup(node, {
    getGroupName: getNodeName,
    getRectangleName: getNodeName
  });

  const symbol = new SymbolMaster({ x, y });

  symbol.setName(name);
  symbol.addLayer(layer);

  return {
    symbol: symbol.toJSON()
  };
};
