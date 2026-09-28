import { useState } from 'react';
import UiGlyph from './UiGlyph';

function BrandMark({ sources, alt, fallbackType, small = false, brand = 'generic' }) {
  const [useFallback, setUseFallback] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);

  const currentSrc = Array.isArray(sources) ? sources[sourceIndex] : null;

  return (
    <span className={`brand-mark-shell${small ? ' brand-mark-shell-small' : ''}`}>
      {useFallback || !currentSrc ? (
        <UiGlyph type={fallbackType} />
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          className={`brand-mark brand-mark--${brand}${small ? ' brand-mark-small' : ''}`}
          loading="lazy"
          decoding="async"
          onError={() => {
            const hasNext = Array.isArray(sources) && sourceIndex < sources.length - 1;
            if (hasNext) {
              setSourceIndex((current) => current + 1);
            } else {
              setUseFallback(true);
            }
          }}
        />
      )}
    </span>
  );
}

export default BrandMark;
