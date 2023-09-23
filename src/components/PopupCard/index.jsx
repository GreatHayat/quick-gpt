import { useRef, useState, useCallback, useEffect } from "react";
import { computePosition, shift, offset, flip, size } from "@floating-ui/react";
import axios from "axios";
import Draggable from "react-draggable";
import { getPrompt } from "~/common/prompts";
import {
  getSettings,
  setSettings,
} from "~/entries/contentScript/utils/helpers";
import { AnimatedCircle, Copy, Pin, PinFill, Repeat } from "../svgIcons";
import { Markdown } from "../Markdown";
import "./style.css";

const OPENAI_API_KEY = "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";

export const chatCopmletion = async (action, text) => {
  const { apiKey, model, tone, writingStyle, language } = await getSettings();
  const content = getPrompt(action, text, tone, writingStyle, language);

  if (!apiKey) {
    alert("Please provide your OpenAI API key to get started");
  }

  const payload = {
    model,
    messages: [{ role: "assistant", content }],
    temperature: 0,
  };

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response;
};

export default function PopupCard({ action, reference, text }) {
  const draggedRef = useRef(null);
  const draggableRef = useRef(null);

  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [apiError, setApiError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [data, setData] = useState(null);

  const updatePosition = useCallback(async () => {
    if (!draggableRef.current) {
      return;
    }

    const { x, y } = await computePosition(reference, draggableRef.current, {
      placement: "top",
      middleware: [
        shift({ padding: 10 }),
        offset(7),
        flip(),
        size({
          apply({ availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${Math.max(500, availableHeight)}px`,
            });
          },
        }),
      ],
      strategy: "fixed",
    });

    Object.assign(draggableRef.current.style, {
      left: `${Math.max(10, x)}px`,
      top: `${Math.max(10, y)}px`,
    });
  }, [reference]);

  const handleOnDrag = (e, data) => {
    draggedRef.current = true;
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    setPrompt(text);
    setIsGeneratingResponse(true);
    chatCopmletion(action, text)
      .then((response) => {
        setData(response?.data?.choices[0]?.message?.content);
        setApiError("");
        setIsGeneratingResponse(false);
      })
      .catch((error) => {
        setApiError(error?.response?.data?.error?.message);
        setIsGeneratingResponse(false);
      });
  }, [text]);

  useEffect(() => {
    getSettings().then((res) => setIsPinned(res?.isPinned));
  }, [isPinned]);

  useEffect(() => {
    if (!draggableRef.current) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      if (draggedRef.current) {
        // do nothing if has been dragged
      } else {
        updatePosition();
      }
    });
    resizeObserver.observe(draggableRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [reference, updatePosition]);

  const updateSettings = async (isPinned) => {
    await setSettings({ isPinned });
    setIsPinned(isPinned);
  };

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(data);
    setIsTextCopied(true);
  };

  const handleAction = async (action) => {
    if (!prompt) {
      return;
    }
    setIsGeneratingResponse(true);
    try {
      const response = await chatCopmletion(action, prompt);

      if (response.status === 200) {
        setIsGeneratingResponse(false);
        setData(response?.data?.choices[0]?.message?.content);
      }
    } catch (error) {
      setIsGeneratingResponse(false);
      setApiError(error?.response?.data?.error?.message);
    }
  };

  return (
    <Draggable
      axis="both"
      handle=".quick-gpt-header"
      bounds="html"
      allowAnyClick={true}
      position={position}
      onDrag={handleOnDrag}
    >
      <div className="quick-gpt-container" ref={draggableRef}>
        <div className="quick-gpt-header">
          <div className="quick-gpt-header-title">Quick GPT</div>
          <div className="quick-gpt-header-icons">
            <div className="quick-gpt-buttons-group">
              <button
                className="quick-gpt-icon-button"
                onClick={() => updateSettings(isPinned ? false : true)}
              >
                {isPinned ? <PinFill /> : <Pin />}
              </button>
            </div>
          </div>
        </div>
        <div className="quick-gpt-content-area">
          <div className="quick-gpt-input-area">
            <textarea
              rows="5"
              className="quick-gpt-text-input"
              value={prompt}
              onChange={({ target: { value } }) => setPrompt(value)}
            />

            <div className="quick-gpt-actions-area">
              <div className="quick-gpt-actions">
                <button
                  className="quick-gpt-action-button"
                  onClick={() => handleAction("summary")}
                  disabled={isGeneratingResponse}
                >
                  Summary
                </button>
                <button
                  className="quick-gpt-action-button"
                  onClick={() => handleAction("makeShorter")}
                  disabled={isGeneratingResponse}
                >
                  Make Shorter
                </button>
                <button
                  className="quick-gpt-action-button"
                  onClick={() => handleAction("explainCode")}
                  disabled={isGeneratingResponse}
                >
                  Explain Code
                </button>
              </div>
              <button
                className="quick-gpt-repeat-button"
                onClick={() => handleAction(action)}
                disabled={isGeneratingResponse}
              >
                <Repeat />
              </button>
            </div>
          </div>
          <div className="quick-gpt-divider"></div>
          <div className="quick-gpt-output-area">
            <p className="quick-gpt-output-area-title">Quick GPT Says:</p>
            {isGeneratingResponse && (
              <div style={{ textAlign: "center" }}>
                <AnimatedCircle />
              </div>
            )}
            {apiError && <p className="quick-gpt-api-error">{apiError}</p>}
            {data && <Markdown>{`${data}`}</Markdown>}
          </div>
          <div className="quick-gpt-divider"></div>
          <div className="quick-gpt-footer">
            {isTextCopied && (
              <p className="quick-gpt-copied-text-message">Copied!</p>
            )}
            <button
              disabled={!data}
              className="quick-gpt-footer-button"
              onClick={copyToClipBoard}
            >
              <Copy />
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
