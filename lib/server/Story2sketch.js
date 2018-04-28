"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _values = require("babel-runtime/core-js/object/values");

var _values2 = _interopRequireDefault(_values);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require("babel-runtime/helpers/extends");

var _extends5 = _interopRequireDefault(_extends4);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _puppeteer = require("puppeteer");

var _puppeteer2 = _interopRequireDefault(_puppeteer);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _progress = require("progress");

var _progress2 = _interopRequireDefault(_progress);

var _htmlSketchapp = require("@brainly/html-sketchapp");

var _getStorybook = require("./getStorybook");

var _getStorybook2 = _interopRequireDefault(_getStorybook);

var _PagePool = require("./PagePool.js");

var _PagePool2 = _interopRequireDefault(_PagePool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console*/

var defaultConcurrency = 4;
var defaultSymbolGutter = 100;

var defaultViewports = {
  Narrow: { width: 320, height: 1200 },
  Standard: { width: 1920, height: 1200 }
};

var Story2sketch = function () {
  function Story2sketch(_ref) {
    var _ref$output = _ref.output,
        output = _ref$output === undefined ? process.cwd() + "/dist/stories.asketch.json" : _ref$output,
        _ref$outputDoc = _ref.outputDoc,
        outputDoc = _ref$outputDoc === undefined ? process.cwd() + "/dist/document.asketch.json" : _ref$outputDoc,
        _ref$url = _ref.url,
        url = _ref$url === undefined ? "http://localhost:9001/iframe.html" : _ref$url,
        _ref$concurrency = _ref.concurrency,
        concurrency = _ref$concurrency === undefined ? defaultConcurrency : _ref$concurrency,
        _ref$pageTitle = _ref.pageTitle,
        pageTitle = _ref$pageTitle === undefined ? "Stories" : _ref$pageTitle,
        _ref$symbolGutter = _ref.symbolGutter,
        symbolGutter = _ref$symbolGutter === undefined ? defaultSymbolGutter : _ref$symbolGutter,
        _ref$viewports = _ref.viewports,
        viewports = _ref$viewports === undefined ? defaultViewports : _ref$viewports,
        _ref$querySelector = _ref.querySelector,
        querySelector = _ref$querySelector === undefined ? "*" : _ref$querySelector,
        _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        stories = _ref.stories;
    (0, _classCallCheck3.default)(this, Story2sketch);

    this.getPage = function (_ref2) {
      var title = _ref2.title,
          width = _ref2.width,
          height = _ref2.height;

      var page = new _htmlSketchapp.Page({
        width: width,
        height: height
      });

      page.setName(title);

      return page.toJSON();
    };

    this.output = output;
    this.outputDoc = outputDoc;
    this.url = url;
    this.concurrency = concurrency;
    this.pageTitle = pageTitle;
    this.symbolGutter = symbolGutter;
    this.viewports = viewports;
    this.querySelector = querySelector;
    this.stories = stories;
    this.verbose = verbose;
  }

  (0, _createClass3.default)(Story2sketch, [{
    key: "reset",
    value: function reset() {
      this.symbolsPerViewport = {};
      this.documentColors = new _set2.default();
      this.documentTexts = {};
      this.offset = 0;
      this.widestSymbolPerViewport = {};
      this.storyCount = 0;
      this.sketchPage = {};
      this.sketchDocument = {};
    }
  }, {
    key: "init",
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _puppeteer2.default.launch();

              case 2:
                this.browser = _context.sent;

                if (!(!this.stories || this.stories === "all")) {
                  _context.next = 8;
                  break;
                }

                if (this.verbose) {
                  console.log(_chalk2.default.gray("Detecting stories..."));
                }

                _context.next = 7;
                return (0, _getStorybook2.default)(this.browser, this.url);

              case 7:
                this.stories = _context.sent;

              case 8:

                this.reset();

                _context.next = 11;
                return this.createPagePool();

              case 11:
                this.pagePool = _context.sent;


                this.progressBar = new _progress2.default("[:bar] :percent (:current/:total) :etas remaining", {
                  total: this.storyCount,
                  story: "",
                  complete: "#"
                });

                this.sketchPage = this.getPage({
                  title: this.pageTitle,
                  width: 1920,
                  height: 5000
                });

                console.log("Processing " + this.storyCount + " stories...");

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref3.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "createPagePool",
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        var _this = this;

        var pagePool, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                pagePool = new _PagePool2.default(this.browser, this.concurrency);
                _context3.next = 3;
                return pagePool.init();

              case 3:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 6;

                _loop = function _loop() {
                  var _ref5 = _step.value;
                  var kind = _ref5.kind,
                      stories = _ref5.stories;
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    var _loop2 = function _loop2() {
                      var story = _step2.value;

                      _this.storyCount += 1;

                      pagePool.queue(function () {
                        var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(page) {
                          var nodePerViewport, viewports, inViewPortOffset, heights;
                          return _regenerator2.default.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  _context2.next = 2;
                                  return _this.getSymbolsForStory({
                                    page: page,
                                    kind: kind,
                                    story: story
                                  });

                                case 2:
                                  nodePerViewport = _context2.sent;
                                  viewports = (0, _keys2.default)(nodePerViewport);
                                  inViewPortOffset = void 0;


                                  viewports.forEach(function (viewport) {
                                    inViewPortOffset = 0;
                                    var node = nodePerViewport[viewport];
                                    if ("symbols" in node) {
                                      node.symbols.forEach(function (symbol) {
                                        symbol.frame.y = _this.offset + inViewPortOffset;
                                        inViewPortOffset = inViewPortOffset + symbol.frame.height + _this.symbolGutter;

                                        _this.widestSymbolPerViewport[viewport] = Math.max(symbol.frame.width, _this.widestSymbolPerViewport[viewport] || 0);

                                        _this.symbolsPerViewport[viewport] = [].concat((0, _toConsumableArray3.default)(_this.symbolsPerViewport[viewport] || []), [symbol]);
                                      });
                                    }

                                    if ("colors" in node) {
                                      node.colors.forEach(function (color) {
                                        return _this.documentColors.add(color);
                                      });
                                    }

                                    if ("texts" in node) {
                                      node.texts.forEach(function (text) {
                                        return _this.documentTexts[text.name] = text;
                                      });
                                    }
                                  });

                                  heights = viewports.reduce(function (result, viewport) {
                                    if ("symbols" in nodePerViewport[viewport]) {
                                      var sum = nodePerViewport[viewport].symbols.reduce(function (res, symbol, index) {
                                        return res + symbol.frame.height + (index > 0 ? _this.symbolGutter : 0);
                                      }, 0);
                                      result.push(sum);
                                    }
                                    return result;
                                  }, []);


                                  if (heights.length) {
                                    _this.offset += Math.max.apply(Math, (0, _toConsumableArray3.default)(heights)) + _this.symbolGutter;
                                  }

                                case 8:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, _this);
                        }));

                        return function (_x) {
                          return _ref6.apply(this, arguments);
                        };
                      }());
                    };

                    for (var _iterator2 = (0, _getIterator3.default)(stories), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      _loop2();
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
                  }
                };

                for (_iterator = (0, _getIterator3.default)(this.stories); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  _loop();
                }

                _context3.next = 15;
                break;

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](6);
                _didIteratorError = true;
                _iteratorError = _context3.t0;

              case 15:
                _context3.prev = 15;
                _context3.prev = 16;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 18:
                _context3.prev = 18;

                if (!_didIteratorError) {
                  _context3.next = 21;
                  break;
                }

                throw _iteratorError;

              case 21:
                return _context3.finish(18);

              case 22:
                return _context3.finish(15);

              case 23:
                return _context3.abrupt("return", pagePool);

              case 24:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[6, 11, 15, 23], [16,, 18, 22]]);
      }));

      function createPagePool() {
        return _ref4.apply(this, arguments);
      }

      return createPagePool;
    }()
  }, {
    key: "getSymbolsForStory",
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(_ref7) {
        var _this2 = this;

        var page = _ref7.page,
            kind = _ref7.kind,
            story = _ref7.story;
        var builtUrl, name, viewports, symbolPerViewport, firstSymbols;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                builtUrl = this.url + "?selectedKind=" + encodeURIComponent(kind) + "&selectedStory=" + encodeURIComponent(story.name);
                _context5.next = 3;
                return page.goto(builtUrl, {
                  waitUntil: "networkidle2"
                });

              case 3:
                _context5.next = 5;
                return page.addScriptTag({
                  path: __dirname + "/../browser/page2layers.bundle.js"
                });

              case 5:
                name = kind + "/" + (story.displayName || story.name);
                viewports = (0, _keys2.default)(this.viewports);
                _context5.next = 9;
                return viewports.reduce(function () {
                  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(result, viewport) {
                    var params, node;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            _context4.next = 2;
                            return page.setViewport(_this2.viewports[viewport]);

                          case 2:
                            params = (0, _stringify2.default)({
                              name: viewport + " " + name,
                              querySelector: _this2.querySelector
                            });
                            _context4.next = 5;
                            return page.evaluate("\n          page2layers\n          .getSymbol(" + params + ");\n      ");

                          case 5:
                            node = _context4.sent;


                            if ("symbols" in node) {
                              node.symbols.forEach(function (symbol) {
                                return symbol.frame.x = 0;
                              });
                            }

                            _context4.t0 = _extends5.default;
                            _context4.t1 = {};
                            _context4.next = 11;
                            return result;

                          case 11:
                            _context4.t2 = _context4.sent;
                            _context4.t3 = (0, _defineProperty3.default)({}, viewport, node);
                            return _context4.abrupt("return", (0, _context4.t0)(_context4.t1, _context4.t2, _context4.t3));

                          case 14:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4, _this2);
                  }));

                  return function (_x3, _x4) {
                    return _ref9.apply(this, arguments);
                  };
                }(), _promise2.default.resolve({}));

              case 9:
                symbolPerViewport = _context5.sent;


                if (this.verbose) {
                  console.log(_chalk2.default.green("✓") + " " + _chalk2.default.gray("Exported") + " " + _chalk2.default.bold("" + name));
                } else {
                  firstSymbols = this.symbolsPerViewport[viewports[0]];

                  this.progressBar.tick({
                    processed: (firstSymbols ? firstSymbols.length : 0) + 1,
                    story: _chalk2.default.bold(name)
                  });
                }

                return _context5.abrupt("return", symbolPerViewport);

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getSymbolsForStory(_x2) {
        return _ref8.apply(this, arguments);
      }

      return getSymbolsForStory;
    }()
  }, {
    key: "execute",
    value: function () {
      var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var _this3 = this;

        var viewports, offsetPerViewport, doc, numberOfStories;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                process.on("SIGINT", function () {
                  _this3.browser.close();

                  _this3.exited = true;

                  process.exit();
                });

                _context6.next = 3;
                return this.pagePool.execute().catch(function (error) {
                  // Suppress errors if user exited process.
                  if (!_this3.exited) {
                    console.error(error);
                  }
                });

              case 3:
                viewports = (0, _keys2.default)(this.symbolsPerViewport);
                offsetPerViewport = viewports.reduce(function (res, viewport, index) {
                  return (0, _extends5.default)({}, res, (0, _defineProperty3.default)({}, viewport, (viewports[index - 1] && res[viewports[index - 1]] || 0) + (index === 0 ? 0 : _this3.widestSymbolPerViewport[viewport] + _this3.symbolGutter)));
                }, {});


                viewports.forEach(function (viewport, index) {
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = (0, _getIterator3.default)(_this3.symbolsPerViewport[viewport]), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var symbol = _step3.value;

                      if (index > 0) {
                        symbol.frame.x = offsetPerViewport[viewport] || 0;
                      }
                      _this3.sketchPage.layers.push(symbol);
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }
                });

                doc = new _htmlSketchapp.Document();

                this.documentColors.forEach(function (color) {
                  return doc.addColor(color);
                });
                doc = doc.toJSON();

                (0, _values2.default)(this.documentTexts).forEach(function (text) {
                  var _doc$layerTextStyles$;

                  return doc.layerTextStyles.objects.push((_doc$layerTextStyles$ = {
                    _class: "sharedStyle"
                  }, (0, _defineProperty3.default)(_doc$layerTextStyles$, "do_objectID", text["do_objectID"]), (0, _defineProperty3.default)(_doc$layerTextStyles$, "name", text.name), (0, _defineProperty3.default)(_doc$layerTextStyles$, "style", text.style), _doc$layerTextStyles$));
                });

                ensureDirectoryExistence(this.output);
                _fs2.default.writeFileSync(this.output, (0, _stringify2.default)(this.sketchPage));
                ensureDirectoryExistence(this.outputDoc);
                _fs2.default.writeFileSync(this.outputDoc, (0, _stringify2.default)(doc));

                numberOfStories = this.stories.reduce(function (sum, kind) {
                  return sum + kind.stories.length;
                }, 0);


                console.log(_chalk2.default.green("Success! " + numberOfStories + " stories written to " + _chalk2.default.white.bold(this.output)));

                this.browser.close();
                process.exit();

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function execute() {
        return _ref10.apply(this, arguments);
      }

      return execute;
    }()
  }]);
  return Story2sketch;
}();

exports.default = Story2sketch;


function ensureDirectoryExistence(filePath) {
  var dirname = _path2.default.dirname(filePath);
  if (_fs2.default.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  _fs2.default.mkdirSync(dirname);
}