# Grabby Chrome Extension


This repository contains a simple Chrome extension that gathers all text and images from the current page and a few subpages. The text is saved with basic formatting to a `.doc` file and all images are also packaged into an `images.zip` archive.
=======


## Install
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension` folder in this repository.

## Usage

Click the extension icon and then the **Grab Content** button. The extension collects the text and images from the current tab and up to five linked pages on the same origin. A `grab.doc` file will be downloaded containing the collected content.


## Notes
- Only links and images from the same origin as the current page are processed.
- Images from other origins are skipped if they cannot be fetched due to CORS restrictions.
