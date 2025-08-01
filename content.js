
function getUserPrompt() {
  const promptDiv = document.getElementById("prompt-textarea");
  return promptDiv ? promptDiv.textContent.trim() : "user prompt not found";
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_USER_PROMPT") {
    const promptDiv = document.getElementById("prompt-textarea");
    const text = promptDiv ? promptDiv.textContent.trim() : null;
    sendResponse({ text: text });
  
  } else if (request.type === "SET_PROMPT_TEXT") {
    const promptDiv = document.getElementById("prompt-textarea");
    if (promptDiv) {
      promptDiv.textContent = request.text;
      sendResponse({ status: "Text set successfully." });
    } else {
      sendResponse({ status: "Error: prompt-textarea not found." });
    }
  }
});
