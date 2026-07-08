import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

export default function Markdown({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div
      className={`prose-game ${className}`}
      dangerouslySetInnerHTML={{ __html: marked.parse(text) as string }}
    />
  )
}
