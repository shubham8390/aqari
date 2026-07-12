import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

/** Extension may be followed by query (`?`), fragment (`#`), another query param (`&`), or EOS. */
const IMAGE_EXT_RE = /\.(?:png|jpe?g|gif|webp|bmp|avif|svg)(?:\?|#|&|$)/i;

function normalizeUrl(url: string): string {
  const trimmed = url.trim().replace(/&amp;/gi, '&');
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

/** True when a URL points at an image (including CDN / Next.js image wrappers). */
export function isImageUrl(url: string): boolean {
  if (!url || !/^https?:\/\//i.test(url.trim())) return false;
  const raw = url.trim().replace(/&amp;/gi, '&');
  const decoded = normalizeUrl(url);
  if (IMAGE_EXT_RE.test(decoded) || IMAGE_EXT_RE.test(raw)) return true;
  // Next.js optimizer: /_next/image?url=<encoded image>
  if (/\/_next\/image(?:\?|$)/i.test(decoded) || /\/_next\/image(?:\?|$)/i.test(raw)) {
    return /\.(?:png|jpe?g|gif|webp|bmp|avif|svg)/i.test(decoded) ||
      /\.(?:png|jpe?g|gif|webp|bmp|avif|svg)/i.test(raw);
  }
  return false;
}

/**
 * Turn autolinked image URLs into <img> tags so chat renders photos
 * instead of blue hyperlinks. Non-image links are left unchanged.
 */
function embedImageLinks(html: string): string {
  return html.replace(
    /<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi,
    (match, _pre, _q, href) => {
      if (!isImageUrl(href)) return match;
      const safeSrc = href
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<img src="${safeSrc}" alt="Property image" loading="lazy" class="chat-md-image" />`;
    },
  );
}

export function renderChatMarkdown(source: string): string {
  const html = marked.parse(source, { async: false }) as string;
  return embedImageLinks(
    html
      .replace(/<table>/g, '<div class="chat-table-wrap"><table>')
      .replace(/<\/table>/g, '</table></div>'),
  );
}

export function formatUserMessage(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}
