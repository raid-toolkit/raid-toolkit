import * as React from 'react';

export interface RichStringProps {
  children: string;
}

export const RichString: React.FC<RichStringProps> = ({ children: text }) => React.useMemo(() => {
    const styles: React.CSSProperties[] = [];
    const exp = /<(.+?)=(.+?)>(.+?)<\/.+?>/g;
    let match: RegExpExecArray | null;
    const elements: React.ReactNode[] = [];
    let currentPos = 0;
    let n = 0;
    while ((match = exp.exec(text))) {
      const [{ length }, prop, value, content] = match;
      styles.push({ [prop]: value });
      if (match.index > currentPos) {
        elements.push(text.substr(currentPos, match.index - currentPos));
      }
      elements.push(
        <span key={`_${n++}`} style={{ [prop]: value }}>
          {content}
        </span>
      );
      currentPos = match.index + length;
    }
    if (currentPos < text.length) {
      elements.push(text.substr(currentPos));
    }
    return <span>{elements}</span>;
  }, [text]);
