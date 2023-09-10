import React from "react";
import { createRoot } from "react-dom/client";
import List from "../components/list";
import { POPUP_CARD_ID, POPUP_THUMB_ID, Z_INDEX } from "./constants";
import {
  getContainer,
  queryPopupCardElement,
  queryPopupThumbElement,
} from "./utils";

const popupThumbClickHandler = async (e) => {
  e.stopPropagation();
  e.preventDefault();

  const popup = await queryPopupThumbElement();
  if (!popup) {
    return;
  }

  const text = popup.dataset["text"];
  showPopupCard(text);
};

const hidePopupThumb = async () => {
  const popup = await queryPopupThumbElement();
  if (!popup) {
    return null;
  }
  popup.style.visibility = "hidden";
};

const createPopupCard = async () => {
  const card = document.createElement("div");
  card.id = POPUP_CARD_ID;

  const container = await getContainer();
  container?.shadowRoot?.querySelector("div").appendChild(card);

  return card;
};

const showPopupCard = async (text) => {
  hidePopupThumb();

  let popupCard = await queryPopupCardElement();

  if (!popupCard) {
    popupCard = await createPopupCard();
  }
  console.log(popupCard);
  createRoot(popupCard).render(
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
  popup.style.top = `${y + 7}px`;
  popup.style.left = `${x}px`;
};

async function main() {
  document.addEventListener("mouseup", (e) => {
    const selectedText = window.getSelection();
    const text = selectedText.toString().trim();

    if (text) {
      showPopupThumb(text, e.clientX, e.clientY);
    }
  });

  document.addEventListener("mousedown", hidePopupThumb);
  document.addEventListener("touchstart", hidePopupThumb);
}

main();
