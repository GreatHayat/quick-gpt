import "../../enableDevHmr";
import React from "react";
import ReactDOM from "react-dom/client";
import browser from "webextension-polyfill";
import renderContent from "../renderContent";
import App from "./App";
import {
  getContainer,
  getSettings,
  queryPopupCardElement,
  queryPopupThumbElement,
} from "../utils/helpers";
import { Z_INDEX, POPUP_CARD_ID, POPUP_THUMB_ID } from "../utils/constants";

// renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
//   ReactDOM.createRoot(appRoot).render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// });

let root = null;

const popupThumbClickHandler = async (e) => {
  e.stopPropagation();
  e.preventDefault();

  const popup = await queryPopupThumbElement();
  if (!popup) {
    return;
  }

  const text = popup.dataset["text"];
  const x = popup.style.left;
  const y = popup.style.top;

  showPopupCard(popup, text, x, y);
};

const removeContainer = async () => {
  const container = await getContainer();
  container.remove();
};

const hidePopupThumb = async () => {
  const popup = await queryPopupThumbElement();
  if (!popup) {
    return null;
  }
  popup.style.visibility = "hidden";
};

const hidePopupCard = async () => {
  const popupCard = await queryPopupCardElement();
  if (!popupCard) {
    return;
  }

  if (root) {
    root.unmount();
    root = null;
  }

  removeContainer();
};

const createPopupCard = async (x = 0, y = 0) => {
  const card = document.createElement("div");
  card.id = POPUP_CARD_ID;
  card.style.position = "absolute";
  card.style.zIndex = Z_INDEX;
  card.style.overflow = "auto";
  card.style.background = "#FFFFFF";
  card.style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
  card.style.width = "300px";
  card.style.height = "250px";
  card.style.borderRadius = "5px";
  card.style.top = 0;
  card.style.boxSizing = "border-box";
  card.style.left = x;
  card.style.top = y;

  const container = await getContainer();
  container?.shadowRoot?.querySelector("div").appendChild(card);

  if (container?.shadowRoot) {
    const shadowRoot = container.shadowRoot;

    if (import.meta.hot) {
      const { addViteStyleTarget } = await import(
        "@samrum/vite-plugin-web-extension/client"
      );
      await addViteStyleTarget(shadowRoot);
    } else {
      import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS?.forEach((cssPath) => {
        const styleEl = document.createElement("link");
        styleEl.setAttribute("rel", "stylesheet");
        styleEl.setAttribute("href", browser.runtime.getURL(cssPath));
        shadowRoot.appendChild(styleEl);
      });
    }
  }
  return card;
};

const showPopupCard = async (popup, text, x, y) => {
  hidePopupThumb();

  let popupCard = await queryPopupCardElement();

  if (!popupCard) {
    popupCard = await createPopupCard(x, y);
  }

  root = ReactDOM.createRoot(popupCard);
  root.render(
    <React.StrictMode>
      <App selectedText={text} reference={popup} />
    </React.StrictMode>
  );
};

const showPopupThumb = async (text, x, y) => {
  if (!text) {
    return;
  }

  let popup = await queryPopupThumbElement();
  if (!popup) {
    popup = document.createElement("div");
    popup.id = POPUP_THUMB_ID;

    // Apply Styling
    popup.style.width = "35px";
    popup.style.borderRadius = "50%";
    popup.style.boxShadow = "rgba(0, 0, 0, 0.16) 0px 1px 4px";
    popup.style.zIndex = Z_INDEX;
    popup.style.background = "#FFF";
    popup.style.userSelect = "none";
    popup.style.overflow = "hidden";
    popup.style.userSelect = "none";
    popup.style.cursor = "pointer";

    // JS Events
    popup.addEventListener("click", popupThumbClickHandler);
    popup.addEventListener("touchend", popupThumbClickHandler);
    popup.addEventListener("mousemove", (event) => {
      event.stopPropagation();
    });
    popup.addEventListener("touchmove", (event) => {
      event.stopPropagation();
    });

    const img = document.createElement("img");
    img.src = "https://img.icons8.com/nolan/30/chatgpt.png";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.display = "block";
    popup.appendChild(img);

    const container = await getContainer();
    container.shadowRoot?.querySelector("div")?.appendChild(popup);
  }

  popup.dataset["text"] = text;
  popup.style.visibility = "visible";
  popup.style.opacity = "100";
  popup.style.position = "absolute";
  popup.style.top = y;
  popup.style.left = x;
};

const onMouseDownHandler = async () => {
  hidePopupThumb();
  const { isPinned } = await getSettings();

  if (isPinned) {
    return;
  }

  if (root) {
    hidePopupCard();
  }
};

async function main() {
  document.addEventListener("mouseup", (event) => {
    if (root !== null) {
      return;
    }
    const selection = window.getSelection();
    const text = selection.toString().trim();

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // const scrollLeft =
    //   window.pageXOffset || document.documentElement.scrollLeft;
    // const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const x = `${event.pageX + 7}px`;
    const y = `${event.pageY + 7}px`;

    // const x = `${rect.left + scrollLeft}px`;
    // const y = `${window.innerHeight - rect.top - scrollTop}px`;

    if (text) {
      showPopupThumb(text, x, y);
    }
  });

  document.addEventListener("mousedown", onMouseDownHandler);
  document.addEventListener("touchstart", onMouseDownHandler);
}

main();
