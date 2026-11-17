import { useEffect, useState } from 'react';

export const ForensicCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(pointer: fine)');
    setEnabled(media.matches);

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [visible]);

  if (!enabled || !visible) return null;

  return (
    <div
      className="forensic-cursor-layer"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      }}
      aria-hidden="true"
    >
      {/* Luminol UV Flashlight Ambient Glow */}
      <div className="luminol-glow" />

      {/* Forensic Crosshair Reticle */}
      <div className="forensic-reticle">
        <div className="reticle-dot" />
        <div className="reticle-line h-line" />
        <div className="reticle-line v-line" />
        <span className="reticle-coords">
          {pos.x},{pos.y}
        </span>
      </div>
    </div>
  );
};
