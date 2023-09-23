import { useState } from "react";
import PopupCard from "~/components/PopupCard";
import { queryPopupCardElement } from "../utils/helpers";
import "./App.css";

const options = [
  {
    id: 5,
    title: "Summary",
    value: "summary",
  },
  {
    id: 7,
    title: "Reply",
    value: "writeReply",
  },
  {
    id: 2,
    title: "Make Shorter",
    value: "makeShorter",
  },
  {
    id: 3,
    title: "Explain Code",
    value: "explainCode",
  },
  {
    id: 4,
    title: "Correct Spelling and Grammar",
    value: "correctSpellingAndGrammar",
  },
  {
    id: 1,
    title: "Content Rephraser",
    value: "contentRephraser",
  },
];

function App({ selectedText, reference }) {
  const [isPopupCardOpen, setIsPopupCardOpen] = useState(false);
  const [action, setAction] = useState("summary");

  const handleClick = async (action) => {
    const card = await queryPopupCardElement();
    card.style.visibility = "hidden";

    setAction(action);
    setIsPopupCardOpen(!isPopupCardOpen);
  };

  return (
    <>
      <ul className="quick-gpt-list-group">
        {options.map((option) => (
          <li
            key={option.id}
            className="quick-gpt-list-group-item"
            onClick={() => handleClick(option.value)}
          >
            {option.title}
          </li>
        ))}
      </ul>
      {isPopupCardOpen && (
        <PopupCard action={action} text={selectedText} reference={reference} />
      )}
    </>
  );
}

export default App;
