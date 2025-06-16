# Grabby Chrome Extension

 main

## Install
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension` folder in this repository.

main
4. Ensure the extension has the **Tabs** permission enabled so it can access the active tab.

## Usage
Click the extension icon and then the **Grab Content** button. The extension collects the formatted text and images from the current tab and up to five linked pages on the same origin. Two files will be downloaded: `grab.doc` containing the text and embedded images, and `images.zip` with all images as separate files.
 main

## Notes
- Only links and images from the same origin as the current page are processed.
- Images from other origins are skipped if they cannot be fetched due to CORS restrictions.
 main
