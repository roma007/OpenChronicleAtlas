import rehypeSanitize from 'rehype-sanitize';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  children: string;
}

/** 安全渲染事件描述：禁止原始 HTML，外链新窗口打开。 */
export function Markdown({ children }: MarkdownProps) {
  return (
    <div
      className="space-y-3 text-sm leading-7 text-ink-soft [&_a]:text-cinnabar [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-cinnabar/40 [&_blockquote]:pl-3 [&_blockquote]:text-ink-soft/80 [&_code]:rounded [&_code]:bg-ink/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px] [&_h1]:font-serif [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-ink [&_h2]:font-serif [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-ink [&_hr]:border-ink/10 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-ink/10 [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:leading-7 [&_strong]:text-ink [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-ink/10 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-ink/10 [&_th]:bg-ink/5 [&_th]:px-2 [&_th]:py-1"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noreferrer noopener" />
          ),
          img: ({ node: _node, ...props }) => (
            <img
              {...props}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="max-w-full rounded-lg border border-ink/10"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
