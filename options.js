document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["openaiApiKey"] , (result) => {
        if(result.openaiApiKey) {
            document.getElementById("api-key").value = result.openaiApiKey;
        }
    });
});

 document.getElementById("save-button").addEventListener("click", () => {
    const apiKey = document.getElementById("api-key").value.trim();

    if (apiKey) {
      chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
        const successMessage = document.getElementById("success-message");
        successMessage.style.display = "block";

        setTimeout(() => {
          window.close();
          // For cases where window.close() doesn't work (like when opened programmatically)
          chrome.tabs.getCurrent((tab) => {
            if (tab) {
              chrome.tabs.remove(tab.id);
            }
          });
        }, 1000);
      });
    }
  });