import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderChatMarkdown(source: string): string {
  const html = marked.parse(source, { async: false }) as string;
  return html
    .replace(/<table>/g, '<div class="chat-table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>');
}

export function formatUserMessage(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}
