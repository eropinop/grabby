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
        main
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
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
main
    const clone = doc.cloneNode(true);
    clone.querySelectorAll('script, style, noscript').forEach(el => el.remove());
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_COMMENT);
    const toRemove = [];
    while (walker.nextNode()) toRemove.push(walker.currentNode);
    for (const node of toRemove) node.parentNode.removeChild(node);
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
main
})();
