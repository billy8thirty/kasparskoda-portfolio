// components/Icon.tsx
'use client';

import { useEffect, useState, ComponentProps } from 'react';

interface IconProps extends ComponentProps<'svg'> {
  src: string;
  size?: number | string;
}

export default function Icon({
  src,
  size = 24,
  className = '',
  ...props
}: IconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        if (!isMounted) return;
        const innerContent = text
          .replace(/<svg[^>]*>/, '')
          .replace(/<\/svg>/, '')
          // Replace any fill color with currentColor so text- color utilities work
          .replace(/fill="[^"]*"/g, 'fill="currentColor"')
          // Remove hardcoded strokes to prevent conflicting outlines
          .replace(/stroke="[^"]*"/g, 'stroke="none"');

        setSvgContent(innerContent);
      })
      .catch((err) => console.error(`Failed to load SVG: ${src}`, err));

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!svgContent) {
    return <span style={{ width: size, height: size }} className="inline-block" />;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  );
}
