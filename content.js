
function getUserPrompt() {
  const promptDiv = document.getElementById("prompt-textarea");
  return promptDiv ? promptDiv.textContent.trim() : "user prompt not found";
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message is the one we're looking for
  if (request.type === "GET_USER_PROMPT") {
    const promptText = getUserPrompt();
    
    // This console.log will now run!
    console.log("Found prompt text from page:", promptText);

    // Send the extracted text back as an object, as the popup expects
    sendResponse({ text: promptText });
  }

  // ✅ Return true to indicate that we will send a response asynchronously.
  // This must be inside the listener and is essential.
  return true;
});
