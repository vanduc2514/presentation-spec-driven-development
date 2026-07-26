"use strict";

/**
 * generate-pdf.cjs — Playwright-based PDF generator
 *
 * Serves the built HTML on a local port, navigates through every slide,
 * captures screenshots, assembles them into an A4-landscape print HTML,
 * and converts it to PDF.
 *
 * Pre-condition: `npm run build` must have run first.
 */

const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { getPdfFilename } = require("./build.cjs");

// ── Configuration ─────────────────────────────────────────────────────────────

const PORT = 4174;
const BASE_URL = `http://localhost:${PORT}`;
const OUTPUT_DIR = path.join(__dirname, "output");
const NAV_TIMEOUT = 10_000;

const HTML_FILENAME = "index.html";

const PDF_OUT = path.join(OUTPUT_DIR, getPdfFilename());

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const installChromium = () => {
  console.log("Playwright Chromium not found. Installing browser binary...");
  execFileSync("npx", ["playwright", "install", "chromium"], {
    stdio: "inherit",
  });
};

// Check if Playwright browsers are installed
try {
  execFileSync("npx", ["playwright", "install", "--dry-run", "chromium"], {
    stdio: "pipe",
  });
} catch {
  installChromium();
}

// ── Static file server ────────────────────────────────────────────────────────

const startServer = (dir) =>
  new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(dir, req.url === "/" ? "index.html" : req.url);
      // Strip query strings
      filePath = filePath.split("?")[0];
      const ext = path.extname(filePath);
      const mime = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".json": "application/json",
      };
      const contentType = mime[ext] || "application/octet-stream";
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
        } else {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(data);
        }
      });
    });
    server.listen(PORT, () => {
      console.log(`Server running on ${BASE_URL}`);
      resolve(server);
    });
    server.on("error", reject);
  });

// ── Main ──────────────────────────────────────────────────────────────────────

const main = async () => {
  console.log(`Generating PDF from ${HTML_FILENAME}...`);

  const server = await startServer(OUTPUT_DIR);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: NAV_TIMEOUT });
    await sleep(1000); // Let impress.js init

    // Get all step elements
    const steps = await page.$$(".step");
    const total = steps.length;
    console.log(`Found ${total} slides`);

    const slides = [];
    for (let i = 0; i < total; i++) {
      // Click on the slide area to navigate
      await page.evaluate((idx) => {
        const step = document.querySelectorAll(".step")[idx];
        if (step) impress().goto(step.id);
      }, i);
      await sleep(500);

      const screenshot = await page.screenshot({ type: "png" });
      slides.push(screenshot);
      console.log(`  Captured slide ${i + 1}/${total}`);
    }

    // Generate a print HTML with all slides as images
    const imgs = slides
      .map((buf, i) => `<img src="data:image/png;base64,${buf.toString("base64")}" style="width:100%;page-break-after:always;" />`)
      .join("\n");

    const printHtml = `<!doctype html><html><body>${imgs}</body></html>`;
    await page.setContent(printHtml, { waitUntil: "networkidle" });
    await page.pdf({
      path: PDF_OUT,
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    console.log(`PDF saved: ${PDF_OUT}`);
  } catch (err) {
    console.error("PDF generation failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
};

main();
