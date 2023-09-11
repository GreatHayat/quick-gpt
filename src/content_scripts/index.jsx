import React from "react";
import { createRoot, Root } from "react-dom/client";
import { POPUP_CARD_ID, POPUP_THUMB_ID, Z_INDEX } from "./constants";
import {
  getContainer,
  queryPopupCardElement,
  queryPopupThumbElement,
} from "./utils";

let root = Root || null;

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

  showPopupCard(text, x, y);
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

const createPopupCard = async () => {
  const card = document.createElement("div");
  card.id = POPUP_CARD_ID;
  card.style.position = "absolute";
  card.style.zIndex = Z_INDEX;
  card.style.background = "#FFFFFF";
  card.style.width = "200px";
  card.style.height = "200px";
  card.style.border = "1px solid red";
  card.style.top = 0;

  const container = await getContainer();
  container?.shadowRoot?.querySelector("div").appendChild(card);

  return card;
};

const showPopupCard = async (text, x, y) => {
  hidePopupThumb();

  let popupCard = await queryPopupCardElement();

  if (!popupCard) {
    popupCard = await createPopupCard();
  }

  popupCard.style.left = x;
  popupCard.style.top = y;

  root = createRoot(popupCard);
  root.render(
    <React.StrictMode>
      <h1>{text}</h1>
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
    popup.style.height = "35px";
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

const onMouseDownHandler = () => {
  hidePopupThumb();

  if (root) {
    hidePopupCard();
  }
};

async function main() {
  document.addEventListener("mouseup", () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // const scrollLeft =
    //   window.pageXOffset || document.documentElement.scrollLeft;
    // const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const x = `${rect.left}px`;
    const y = `${rect.bottom + 10}px`;

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
