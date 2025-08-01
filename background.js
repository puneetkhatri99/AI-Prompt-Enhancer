chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed or updated");

  chrome.storage.sync.get(["openaiApiKey"], (result) => {
    console.log("openaiApiKey result:", result);

    if (!result.openaiApiKey) {
      console.log("API key missing, opening options page...");
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    }
  });
});