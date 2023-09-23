import pkg from "../package.json";

const manifest = {
  action: {
    default_icon: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
      64: "icons/icon-64.png",
    },
    default_popup: "src/entries/popup/index.html",
  },
  background: {
    service_worker: "src/entries/background/main.js",
  },
  content_scripts: [
    {
      js: ["src/entries/contentScript/primary/main.jsx"],
      matches: [
        "https://floating-ui.com/docs/floatinglist",
        "https://www.linkedin.com/feed/",
        "https://stackoverflow.com/*",
      ],
    },
  ],
  permissions: ["tabs", "activeTab", "storage", "webNavigation"],
  host_permissions: ["*://*/*"],
  icons: {
    16: "icons/icon-16.png",
    32: "icons/icon-32.png",
    48: "icons/icon-48.png",
    64: "icons/icon-64.png",
  },
  options_ui: {
    page: "src/entries/options/index.html",
    open_in_tab: true,
  },
};

export function getManifest() {
  return {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
    manifest_version: 3,
    ...manifest,
  };
}
