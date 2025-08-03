import { getSystemPrompt } from "./prompts.js";

async function generatePromptResponse() {
  const result = document.getElementById("promptOutput");
  const loader = document.getElementById("loader");

  loader.style.display = 'block';
  result.value = ""; 

  const promptType = document.getElementById("promptSelector").value;
  const selectedPrompt = getSystemPrompt(promptType);

  chrome.storage.sync.get(["openaiApiKey"], async (stored) => {
    const apiKey = stored.openaiApiKey;

    if (!apiKey) {
      result.innerText = "API key not found. Please set your API key in the extension options.";
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || tabs.length === 0) {
        result.innerText = "No active tab found.";
        return;
      }

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "GET_USER_PROMPT" }, async (response) => {

      if (chrome.runtime.lastError || !response || !response.text) {
          handleError("Could not get a prompt from the page.");
          return;
        }

        const userPrompt = response.text;
        const res = await fetchResponse(userPrompt, selectedPrompt, apiKey);
        loader.style.display = 'none'; 
        result.value = res;
    });
  });
});
});
}

async function fetchResponse(userPrompt, selectedPrompt, apiKey) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: selectedPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5
      })
    });

    const responseData = await response.json();

    if (responseData?.choices?.length > 0) {
      const aiReply = responseData.choices[0].message.content.trim();
      return aiReply
    } else {
      return "No response from OpenAI.";
    }

  } catch (error) {
    return`Error: ${error.message || "Failed to generate response."}`;
  }
}

function copyPromptToPage() {
const newPrompt = document.getElementById("promptOutput");
    const textToCopy = newPrompt.value;

    if (!textToCopy) {
    newPrompt.value = "No prompt to copy.";
    return;
  }

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || tabs.length === 0) {
        newPrompt.value = "No active tab found.";
        return;
      }

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tabs[0].id, 
        { type: "SET_PROMPT_TEXT",
        text: textToCopy 
    },
    
    async (response) => {

        if (chrome.runtime.lastError) {
        console.error("Message failed:", chrome.runtime.lastError.message);
        return;

    }else {
          newPrompt.value = response.status || "Prompt copied successfully.";
          setTimeout(() => {
            newPrompt.value = "";
            window.close();
          }, 2000);
        }
      });
    });
  });
}

function initializePopup() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const getPromptBtn = document.getElementById("getPrompt");
        const copyPromptBtn = document.getElementById("copyPrompt");

        if (tabs[0]?.url?.startsWith("https://chatgpt.com")) {
            getPromptBtn.addEventListener("click", generatePromptResponse);
            copyPromptBtn.addEventListener("click", copyPromptToPage);
        } else {
            handleError("This extension only works on chatgpt.com.");
            getPromptBtn.disabled = true;
            copyPromptBtn.disabled = true;
        }
    });
}

function handleError(errorMessage) {
    document.getElementById("loader").style.display = 'none';
    const resultEl = document.getElementById("promptOutput");
    resultEl.value = errorMessage;
}



document.addEventListener("DOMContentLoaded", () => {
  initializePopup();
  document.getElementById("getPrompt").addEventListener("click", generatePromptResponse);
  document.getElementById("copyPrompt").addEventListener("click", copyPromptToPage);
});
