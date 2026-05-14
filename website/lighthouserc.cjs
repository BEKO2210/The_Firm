// Firma OS · Lighthouse CI Konfiguration
//
// Quellen / Standards:
// - Lighthouse (Google, Apache 2.0)
// - Core Web Vitals: LCP, INP, CLS (https://web.dev/vitals/)
// - Accessibility: axe-core via Lighthouse a11y category (Deque, MPL 2.0)
//
// Run:  npm run bench:lighthouse  (vorher: npm run build)
//
// Annahmen: production build via `npm run build` ist gemacht; Chrome-Binary
// wird per CHROME_PATH bzw. Default-Pfad aus Playwright-Installation geladen.

const path = require("node:path");

const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/opt/pw-browsers/chromium-1223/chrome-linux64/chrome";

module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm start",
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 30000,
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/tools",
        "http://localhost:3000/reports",
      ],
      numberOfRuns: 3,
      settings: {
        chromePath: CHROME_PATH,
        chromeFlags: "--no-sandbox --headless=new --disable-dev-shm-usage",
        preset: "desktop",
        // Skip PWA category — Firma OS Dashboard ist kein PWA-Target.
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: path.resolve(__dirname, ".lighthouseci"),
    },
  },
};
