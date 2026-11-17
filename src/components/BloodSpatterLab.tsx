import { useState, useRef, useEffect } from 'react';
import { Crosshair, RotateCcw, Sparkles } from 'lucide-react';
import { playSlideTap } from '@/lib/sound';

export const BloodSpatterLab = () => {
  const [width, setWidth] = useState(12); // mm
  const [length, setLength] = useState(24); // mm
  const [angle, setAngle] = useState(30); // degrees
  const [points, setPoints] = useState<Array<{ x: number; y: number; angle: number; r: number }>>([
    { x: 120, y: 70, angle: 30, r: 16 },
    { x: 260, y: 110, angle: 42, r: 14 },
    { x: 420, y: 80, angle: 25, r: 18 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate impact angle: sin(alpha) = width / length
  useEffect(() => {
    const ratio = Math.min(1, Math.max(0.1, width / length));
    const rad = Math.asin(ratio);
    const deg = Math.round((rad * 180) / Math.PI);
    setAngle(deg);
  }, [width, length]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid lines (Forensic millimeter grid)
    ctx.strokeStyle = 'rgba(226, 27, 45, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw all blood spatter droplets
    points.forEach((pt, i) => {
      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate((pt.angle * Math.PI) / 180);

      // Trajectory string line back to origin
      ctx.strokeStyle = 'rgba(255, 30, 50, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-pt.r * 5, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Droplet main ellipse
      ctx.fillStyle = i === points.length - 1 ? '#e21b2d' : '#8f0e1c';
      ctx.shadowColor = '#e21b2d';
      ctx.shadowBlur = i === points.length - 1 ? 12 : 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, pt.r * 1.5, pt.r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spine / tail of droplet
      ctx.beginPath();
      ctx.moveTo(pt.r * 1.4, 0);
      ctx.lineTo(pt.r * 2.6, 0);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Satellite droplets
      ctx.beginPath();
      ctx.arc(pt.r * 3.1, pt.r * 0.4, 2, 0, Math.PI * 2);
      ctx.arc(pt.r * 2.8, -pt.r * 0.5, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }, [points]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAngle = Math.round(15 + Math.random() * 55);
    const newWidth = Math.round(8 + Math.random() * 12);
    const newLength = Math.round(newWidth / Math.sin((newAngle * Math.PI) / 180));

    playSlideTap();
    setWidth(newWidth);
    setLength(newLength);
    setPoints((prev) => [
      ...prev.slice(-4), // keep last 5
      { x, y, angle: newAngle, r: newWidth * 0.9 },
    ]);
  };

  const velocityClass =
    angle > 50
      ? 'Low Velocity (< 1.5 m/s — Gravitational Drop)'
      : angle > 25
      ? 'Medium Velocity (1.5 – 7.5 m/s — Blunt Force / Cast-off)'
      : 'High Velocity (> 30 m/s — Fine Mist / High Energy)';

  return (
    <section className="blood-lab-section">
      <div className="wrap">
        <div className="section-heading">
          <span className="eyebrow">FORENSIC SIMULATION // TRIGONOMETRY</span>
          <h2>
            Blood Spatter <em>Trajectory Lab.</em>
          </h2>
          <p>
            Dexter Morgan's specialty: calculating angle of impact using \(\sin(\alpha) = \frac{\text{Width}}{\text{Length}}\) and stringing trajectories to determine origin coordinates.
          </p>
        </div>

        <div className="blood-lab-card">
          <div className="lab-header">
            <div className="lab-tag">
              <Crosshair size={13} className="text-red-500 animate-pulse" />
              <span>SPATTER ANGLE & TRAJECTORY ANALYZER</span>
            </div>
            <div className="lab-controls">
              <button
                className="lab-btn"
                onClick={() => {
                  playSlideTap();
                  setPoints([
                    { x: 120, y: 70, angle: 30, r: 16 },
                    { x: 280, y: 120, angle: 45, r: 14 },
                  ]);
                }}
              >
                <RotateCcw size={12} /> RESET CANVAS
              </button>
            </div>
          </div>

          <div className="lab-grid">
            {/* Interactive Canvas */}
            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                width={560}
                height={260}
                className="blood-canvas"
                onClick={handleCanvasClick}
                title="Click anywhere to simulate impact specimen"
              />
              <span className="canvas-instruction">
                [CLICK ON GRID TO SIMULATE IMPACT DROPLET]
              </span>
            </div>

            {/* Telemetry Readouts */}
            <div className="telemetry-panel">
              <div className="telemetry-row main-angle">
                <span className="telemetry-label">IMPACT ANGLE (α):</span>
                <span className="telemetry-value angle-highlight">
                  {angle}°
                </span>
              </div>

              <div className="telemetry-row">
                <span className="telemetry-label">TRIGONOMETRIC FORMULA:</span>
                <span className="formula-code">
                  α = arcsin({width}mm / {length}mm)
                </span>
              </div>

              <div className="telemetry-row">
                <span className="telemetry-label">VELOCITY PROFILE:</span>
                <span className="telemetry-value velocity-tag">
                  {velocityClass}
                </span>
              </div>

              {/* Sliders */}
              <div className="slider-group">
                <div className="slider-row">
                  <label>DROPLET WIDTH: <b>{width} mm</b></label>
                  <input
                    type="range"
                    min="4"
                    max="25"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="lab-slider"
                  />
                </div>

                <div className="slider-row">
                  <label>DROPLET LENGTH: <b>{length} mm</b></label>
                  <input
                    type="range"
                    min={width}
                    max="50"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="lab-slider"
                  />
                </div>
              </div>

              <div className="lab-note">
                <Sparkles size={13} className="text-red-500 shrink-0" />
                <span>
                  Elliptical elongation reveals trajectory orientation. Origin points align along inverse string projections.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
