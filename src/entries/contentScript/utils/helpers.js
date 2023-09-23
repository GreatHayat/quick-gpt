import browser from "webextension-polyfill";
import {
  CONTAINER_ID,
  POPUP_THUMB_ID,
  POPUP_CARD_ID,
  Z_INDEX,
} from "./constants";

export async function getContainer() {
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;

    container.addEventListener("mouseup", (e) => e.stopPropagation());
    container.addEventListener("mousedown", (e) => e.stopPropagation());
    container.addEventListener("touchstart", (e) => e.stopPropagation());
    container.addEventListener("touchend", (e) => e.stopPropagation());

    container.style.zIndex = Z_INDEX;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const container_ = document.getElementById(CONTAINER_ID);
        if (container_) {
          resolve(container_);
          return;
        }
        if (!container) {
          reject(new Error("Failed to create container"));
          return;
        }
        const shadowRoot = container.attachShadow({ mode: "open" });

        const inner = document.createElement("div");
        shadowRoot.appendChild(inner);
        const html = document.body.parentElement;
        if (html) {
          html.appendChild(container);
        } else {
          document.appendChild(container);
        }
        resolve(container);
      }, 100);
    });
  }
  return new Promise((resolve) => {
    resolve(container);
  });
}

export const queryPopupThumbElement = async () => {
  const container = await getContainer();
  return container.shadowRoot?.querySelector(`#${POPUP_THUMB_ID}`) || null;
};

export const queryPopupCardElement = async () => {
  const container = await getContainer();
  return container.shadowRoot?.querySelector(`#${POPUP_CARD_ID}`) || null;
};

export const getBrowser = async () => {
  return (await import("webextension-polyfill")).default;
};

export const setSettings = async (settings) => {
  const browser = await getBrowser();
  const { quickGpt } = await browser.storage?.sync?.get("quickGpt");
  if (quickGpt) {
    const data = JSON.parse(quickGpt);
    const updated = {
      ...data,
      ...settings,
    };
    await browser.storage.sync.set({
      quickGpt: JSON.stringify(updated),
    });
    return;
  }

  await browser.storage.sync.set({
    quickGpt: JSON.stringify(settings),
  });
};

export const getSettings = async () => {
  const browser = await getBrowser();
  const { quickGpt } = await browser.storage?.sync?.get("quickGpt");
  return JSON.parse(quickGpt);
};
