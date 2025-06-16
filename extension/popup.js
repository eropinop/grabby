document.getElementById('grab').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['jszip.min.js', 'content.js']
 m4scgx-codex/create-chrome-extension-to-save-text-and-images-in-doc
=======

main
  });
});
