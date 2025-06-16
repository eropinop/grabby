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
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  }

  async function gatherFromDocument(doc, pageUrl) {
    const text = doc.body ? doc.body.innerText : '';
    const images = Array.from(doc.images);
    const dataUrls = [];
    for (const img of images) {
      const data = await imgToDataURL(img.src);
      if (data) dataUrls.push(data);
    }
    results.push({ url: pageUrl, text, images: dataUrls });
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
})();
