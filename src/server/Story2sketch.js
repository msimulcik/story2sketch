/* eslint-disable no-console*/

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ProgressBar from "progress";
import { Document, Page } from "@brainly/html-sketchapp";

import getStorybook from "./getStorybook";
import PagePool from "./PagePool.js";

const defaultConcurrency = 4;
const defaultSymbolGutter = 100;

const defaultViewports = {
  Narrow: { width: 320, height: 1200 },
  Standard: { width: 1920, height: 1200 }
};

export default class Story2sketch {
  constructor({
    output = `${process.cwd()}/dist/stories.asketch.json`,
    outputDoc = `${process.cwd()}/dist/document.asketch.json`,
    url = "http://localhost:9001/iframe.html",
    concurrency = defaultConcurrency,
    pageTitle = "Stories",
    symbolGutter = defaultSymbolGutter,
    viewports = defaultViewports,
    querySelector = "*",
    verbose = false,
    stories
  }) {
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

  reset() {
    this.symbolsPerViewport = {};
    this.documentColors = new Set();
    this.documentTexts = {};
    this.offset = 0;
    this.widestSymbolPerViewport = {};
    this.storyCount = 0;
    this.sketchPage = {};
    this.sketchDocument = {};
  }

  getPage = ({ title, width, height }) => {
    const page = new Page({
      width,
      height
    });

    page.setName(title);

    return page.toJSON();
  };

  async init() {
    this.browser = await puppeteer.launch();

    if (!this.stories || this.stories === "all") {
      if (this.verbose) {
        console.log(chalk.gray("Detecting stories..."));
      }

      this.stories = await getStorybook(this.browser, this.url);
    }

    this.reset();

    this.pagePool = await this.createPagePool();

    this.progressBar = new ProgressBar(
      "[:bar] :percent (:current/:total) :etas remaining",
      {
        total: this.storyCount,
        story: "",
        complete: "#"
      }
    );

    this.sketchPage = this.getPage({
      title: this.pageTitle,
      width: 1920,
      height: 5000
    });

    console.log(`Processing ${this.storyCount} stories...`);
  }

  async createPagePool() {
    const pagePool = new PagePool(this.browser, this.concurrency);

    await pagePool.init();

    for (const { kind, stories } of this.stories) {
      for (const story of stories) {
        this.storyCount += 1;

        pagePool.queue(async page => {
          const nodePerViewport = await this.getSymbolsForStory({
            page,
            kind,
            story
          });

          const viewports = Object.keys(nodePerViewport);

          let inViewPortOffset;

          viewports.forEach(viewport => {
            inViewPortOffset = 0;
            const node = nodePerViewport[viewport];
            if ("symbols" in node) {
              node.symbols.forEach(symbol => {
                symbol.frame.y = this.offset + inViewPortOffset;
                inViewPortOffset =
                  inViewPortOffset + symbol.frame.height + this.symbolGutter;

                this.widestSymbolPerViewport[viewport] = Math.max(
                  symbol.frame.width,
                  this.widestSymbolPerViewport[viewport] || 0
                );

                this.symbolsPerViewport[viewport] = [
                  ...(this.symbolsPerViewport[viewport] || []),
                  symbol
                ];
              });
            }

            if ("colors" in node) {
              node.colors.forEach(color => this.documentColors.add(color));
            }

            if ("texts" in node) {
              node.texts.forEach(
                text => (this.documentTexts[text.name] = text)
              );
            }
          });

          const heights = viewports.reduce((result, viewport) => {
            if ("symbols" in nodePerViewport[viewport]) {
              const sum = nodePerViewport[viewport].symbols.reduce(
                (res, symbol, index) =>
                  res +
                  symbol.frame.height +
                  (index > 0 ? this.symbolGutter : 0),
                0
              );
              result.push(sum);
            }
            return result;
          }, []);

          if (heights.length) {
            this.offset += Math.max(...heights) + this.symbolGutter;
          }
        });
      }
    }

    return pagePool;
  }

  async getSymbolsForStory({ page, kind, story }) {
    const builtUrl = `${this.url}?selectedKind=${encodeURIComponent(
      kind
    )}&selectedStory=${encodeURIComponent(story.name)}`;

    await page.goto(builtUrl, {
      waitUntil: "networkidle2"
    });

    await page.addScriptTag({
      path: `${__dirname}/../browser/page2layers.bundle.js`
    });

    const name = `${kind}/${story.displayName || story.name}`;

    const viewports = Object.keys(this.viewports);

    const symbolPerViewport = await viewports.reduce(
      async (result, viewport) => {
        await page.setViewport(this.viewports[viewport]);

        const params = JSON.stringify({
          name: `${viewport} ${name}`,
          querySelector: this.querySelector
        });

        const node = await page.evaluate(`
          page2layers
          .getSymbol(${params});
      `);

        if ("symbols" in node) {
          node.symbols.forEach(symbol => (symbol.frame.x = 0));
        }

        return {
          ...(await result),
          [viewport]: node
        };
      },
      Promise.resolve({})
    );

    if (this.verbose) {
      console.log(
        `${chalk.green("✓")} ${chalk.gray(`Exported`)} ${chalk.bold(`${name}`)}`
      );
    } else {
      const firstSymbols = this.symbolsPerViewport[viewports[0]];
      this.progressBar.tick({
        processed: (firstSymbols ? firstSymbols.length : 0) + 1,
        story: chalk.bold(name)
      });
    }

    return symbolPerViewport;
  }

  async execute() {
    process.on("SIGINT", () => {
      this.browser.close();

      this.exited = true;

      process.exit();
    });

    await this.pagePool.execute().catch(error => {
      // Suppress errors if user exited process.
      if (!this.exited) {
        console.error(error);
      }
    });

    const viewports = Object.keys(this.symbolsPerViewport);

    const offsetPerViewport = viewports.reduce((res, viewport, index) => {
      return {
        ...res,
        [viewport]:
          ((viewports[index - 1] && res[viewports[index - 1]]) || 0) +
          (index === 0
            ? 0
            : this.widestSymbolPerViewport[viewport] + this.symbolGutter)
      };
    }, {});

    viewports.forEach((viewport, index) => {
      for (const symbol of this.symbolsPerViewport[viewport]) {
        if (index > 0) {
          symbol.frame.x = offsetPerViewport[viewport] || 0;
        }
        this.sketchPage.layers.push(symbol);
      }
    });

    let doc = new Document();
    this.documentColors.forEach(color => doc.addColor(color));
    doc = doc.toJSON();

    Object.values(this.documentTexts).forEach(text =>
      doc.layerTextStyles.objects.push({
        _class: "sharedStyle",
        ["do_objectID"]: text["do_objectID"],
        name: text.name,
        style: text.style
      })
    );

    ensureDirectoryExistence(this.output);
    fs.writeFileSync(this.output, JSON.stringify(this.sketchPage));
    ensureDirectoryExistence(this.outputDoc);
    fs.writeFileSync(this.outputDoc, JSON.stringify(doc));

    const numberOfStories = this.stories.reduce(
      (sum, kind) => sum + kind.stories.length,
      0
    );

    console.log(
      chalk.green(
        `Success! ${numberOfStories} stories written to ${chalk.white.bold(
          this.output
        )}`
      )
    );

    this.browser.close();
    process.exit();
  }
}

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}
