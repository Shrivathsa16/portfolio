import { useEffect, useRef, useState } from 'react';

// Dev/testing helper only — lets you try a different photo in the shards
// without touching content.js. Nothing here is uploaded or persisted;
// it's just a local object URL that disappears on refresh.
export default function PhotoPicker({ onSelect }) {
  const [fileName, setFileName] = useState('');
  const objectUrlRef = useRef(null);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    []
  );

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setFileName(file.name);
    onSelect(url);
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-3 text-xs text-[var(--text-dim)]">
      <label htmlFor="hero-photo-picker" className="photo-picker-label glass cursor-pointer rounded-full px-4 py-2 font-medium">
        Use my photo
        <input
          id="hero-photo-picker"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="sr-only"
        />
      </label>
      {fileName && <span className="max-w-[180px] truncate">{fileName}</span>}
    </div>
  );
}
