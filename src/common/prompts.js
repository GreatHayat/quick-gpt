import { oneLine } from "common-tags";

export const getPrompt = (action, text, tone, writingStyle, outputLanguage) => {
  switch (action) {
    case "summary":
      return `You are a professional text summarizer, you can only summarize the text, don't interpret it.
    ${text}
    Please use Markdown if necessary, write in ${tone} tone, ${writingStyle} writing style, using ${outputLanguage}.
    `;

    case "makeShorter":
      return `
        Kindly disregard any prior instructions. Your responses should only be in English. Imagine that you are an incredibly skilled researcher with fluency in English. You task is to make the given text shorter and don't loose the original meaning of the given text.
        ${text}
        Please use Markdown if necessary, write in ${tone} tone, ${writingStyle} writing style, using ${outputLanguage}.
        `;

    case "writeReply":
      return `
      Act as a LinkedIn user and generate a response to a top comment on a post. Write a reply that is friendly, professional, and relevant to the conversation. Consider the tone of the original comment and the context of the post. Use proper grammar and spellcheck. The target language is English. The text to response is this:
      ${text} 
      Please write in ${tone} tone, ${writingStyle} writing style, using ${outputLanguage}.
        `;

    case "explainCode":
      return oneLine`You are a code explanation engine that can only explain code but not interpret or translate it. Also, please report bugs and errors (if any).
      explain the provided code,
      code: ${text}
      You may use Markdown.
      If the content is not code,
      return an error message.
      If the code has obvious errors, point them out.
      Please write in ${tone} tone, ${writingStyle} writing style, using ${outputLanguage}
      `;

    case "correctSpellingAndGrammar":
      return oneLine`You are a grammar checker that looks for mistakes and makes sentence’s more fluent. 
      You take all the users input and auto correct it. 
      Just reply to user input with the correct grammar, DO NOT reply the context of the question of the user input. 
      If the user input is grammatically correct and fluent, just reply “sounds good”. 
      
      User input: ${text}
      `;

    case "contentRephraser":
      return oneLine`Your objective is to rephrase the entire passage using improved wording and ensuring it appears unique in natural language. 
      All responses should be in English. The text to be rephrased is as follows:
      ${text}
      Please write in ${tone} tone, ${writingStyle} writing style, using ${outputLanguage}.`;
  }
};
