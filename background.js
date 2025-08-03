chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["openaiApiKey"], (result) => {
    if (!result.openaiApiKey) {
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
    }
  });
});