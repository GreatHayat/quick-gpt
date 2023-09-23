import { useState, useEffect } from "react";
import { languages, models, tones, writingStyles } from "./data";
import {
  setSettings as setUserSettings,
  getSettings,
} from "~/entries/contentScript/utils/helpers";

function PageContent() {
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({
    model: "gpt-3.5-turbo",
    apiKey: "",
    language: "English",
    tone: "default",
    writingStyle: "default",
  });

  const updateSettings = (key, value) => {
    let data = { ...settings };
    data[key] = value;
    setSettings(data);
  };

  useEffect(() => {
    getSettings().then((res) =>
      setSettings({
        model: res?.model || "gpt-3.5-turbo",
        apiKey: res?.apiKey || "",
        language: res?.language || "English",
        tone: res?.tone || "default",
        writingStyle: res?.writingStyle || "default",
      })
    );
  }, [getSettings]);

  const handleSubmit = async () => {
    await setUserSettings(settings);
    if (settings?.apiKey) {
      setMessage(
        "Your settings have been successfully saved. You can now close this popup and start using the extension."
      );
    }
  };

  return (
    <div className="w-[600px] shadow-md rounded-md">
      <div className="bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500 px-4 py-5 flex gap-3 items-center">
        <img src="https://img.icons8.com/nolan/30/chatgpt.png" />
        <h1 className="font-semibold text-lg">Quick GPT</h1>
      </div>

      <div className="px-4 py-4">
        <div className="mb-4">
          <p className="mb-1 font-medium">API Model</p>
          <select
            placeholder="Default Language"
            className="w-full bg-gray-100 p-2 rounded"
            value={settings.model}
            onChange={({ target: { value } }) => updateSettings("model", value)}
          >
            {models?.map((model) => (
              <option value={model.value} key={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p className="mb-1 font-medium">API Key *</p>
          <input
            placeholder="OpenAI API Key"
            type="password"
            className="w-full bg-gray-100 p-2 rounded"
            value={settings.apiKey}
            onChange={({ target: { value } }) =>
              updateSettings("apiKey", value)
            }
          />
        </div>

        <div className="mb-4">
          <p className="mb-1 font-medium">Output Language</p>
          <select
            placeholder="Default Language"
            className="w-full bg-gray-100 p-2 rounded"
            value={settings.language}
            onChange={({ target: { value } }) =>
              updateSettings("language", value)
            }
          >
            {languages?.map((language) => (
              <option value={language.name} key={language.id}>
                {language.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p className="mb-1 font-medium">Tone</p>
          <select
            placeholder="Default Language"
            className="w-full bg-gray-100 p-2 rounded"
            value={settings.tone}
            onChange={({ target: { value } }) => updateSettings("tone", value)}
          >
            {tones?.map((tone) => (
              <option value={tone.value} key={tone.id}>
                {tone.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <p className="mb-1 font-medium">Writing Style</p>
          <select
            placeholder="Default Language"
            className="w-full bg-gray-100 p-2 rounded"
            value={settings.writingStyle}
            onChange={({ target: { value } }) =>
              updateSettings("writingStyle", value)
            }
          >
            {writingStyles?.map((style) => (
              <option value={style.value} key={style.id}>
                {style.name}
              </option>
            ))}
          </select>
        </div>

        {message && <p style={{ color: "#059669" }}>{message}</p>}

        <div className="mb-4 flex justify-end">
          <button
            className="bg-black text-white px-4 py-1.5 rounded-md"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageContent;
