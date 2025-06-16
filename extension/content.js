
m4scgx-codex/create-chrome-extension-to-save-text-and-images-in-doc
=======

main
(async () => {
  const results = [];
  const imagesForZip = [];
  const origin = location.origin;

  function extensionForType(type) {
    if (type.includes('png')) return '.png';
    if (type.includes('jpeg')) return '.jpg';
    if (type.includes('gif')) return '.gif';
    return '';
  }

  async function imgToDataURL(src) {
    try {
      const url = new URL(src, location.href).href;
      const res = await fetch(url);
      const blob = await res.blob();
      const dataUrl = await new Promise(resolve => {
m4scgx-codex/create-chrome-extension-to-save-text-and-images-in-doc
=======
=======
(async () => {
  const results = [];
  const origin = location.origin;

  async function imgToDataURL(src) {
    try {
      const url = new URL(src, location.href).href;
      if (!url.startsWith(origin)) return null;
      const res = await fetch(url);
      const blob = await res.blob();
      return await new Promise(resolve => {

main
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
m4scgx-codex/create-chrome-extension-to-save-text-and-images-in-doc
=======

main
      imagesForZip.push({
        name: `image_${imagesForZip.length + 1}${extensionForType(blob.type)}`,
        blob
      });
      return dataUrl;
    } catch (e) {
      return null;
    }
  }

  async function gatherFromDocument(doc, pageUrl) {
m4scgx-codex/create-chrome-extension-to-save-text-and-images-in-doc
    const clone = doc.cloneNode(true);
    clone.querySelectorAll('script, style, noscript').forEach(el => el.remove());
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
    const toRemove = [];
    while (walker.nextNode()) toRemove.push(walker.currentNode);
    for (const node of toRemove) node.parentNode.removeChild(node);

    const clone = doc.cloneNode(true);
    clone.querySelectorAll('script, style, noscript').forEach(el => el.remove());
main
    const imgs = Array.from(clone.images);
    for (const img of imgs) {
      const data = await imgToDataURL(img.src);
      if (data) {
        img.src = data;
      } else {
        img.remove();
      }
    }
    const html = clone.body ? clone.body.innerHTML : '';
    results.push({ url: pageUrl, html });
m4scgx-codex/create-chrome-extension-to-save-text-and-images-in-doc
=======

    const text = doc.body ? doc.body.innerText : '';
    const images = Array.from(doc.images);
    const dataUrls = [];
    for (const img of images) {
      const data = await imgToDataURL(img.src);
      if (data) dataUrls.push(data);
    }
    results.push({ url: pageUrl, text, images: dataUrls });

main
  }

  await gatherFromDocument(document, location.href);

  const links = Array.from(document.links)
    .map(l => new URL(l.href, location.href).href)
    .filter(h => h.startsWith(origin));

  const uniqueLinks = Array.from(new Set(links)).slice(0, 5); // limit to 5 subpages

  for (const link of uniqueLinks) {
    try {
      const res = await fetch(link);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      await gatherFromDocument(doc, link);
    } catch (e) {
      // ignore fetch errors
    }
  }

m4scgx-codex/create-chrome-extension-to-save-text-and-images-in-doc
=======

main
  let docHtml = '<html><body>';
  for (const page of results) {
    docHtml += `<h2>${page.url}</h2>`;
    docHtml += page.html;
  }
  docHtml += '</body></html>';

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const docBlob = new Blob([docHtml], { type: 'application/msword' });
  downloadBlob(docBlob, 'grab.doc');

  if (imagesForZip.length) {
    const zip = new JSZip();
    for (const img of imagesForZip) {
      zip.file(img.name, img.blob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'images.zip');
  }
 m4scgx-codex/create-chrome-extension-to-save-text-and-images-in-doc
=======

  let html = '<html><body>';
  for (const page of results) {
    html += `<h2>${page.url}</h2>`;
    html += `<p>${page.text.replace(/\n/g, '<br>')}</p>`;
    for (const img of page.images) {
      html += `<img src="${img}"><br>`;
    }
  }
  html += '</body></html>';

  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'grab.doc';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
main
main
})();
