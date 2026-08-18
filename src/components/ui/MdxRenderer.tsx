interface MdxRendererProps {
  html: string;
  className?: string;
}

export function MdxRenderer({ html, className }: MdxRendererProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}