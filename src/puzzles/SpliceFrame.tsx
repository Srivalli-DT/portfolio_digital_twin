import styles from './SpliceFrame.module.css';

type SpliceFrameProps = {
  // 0 = first frame of the landing (high in the sky) … 3 = last (perched).
  frame: number;
};

// Where the crow is in each frame, and its wing angle (null = wings folded, perched).
const POSES = [
  { y: 16, wing: -12 },
  { y: 32, wing: -2 },
  { y: 50, wing: 8 },
  { y: 62, wing: null },
];
const WIRE_Y = 70;

// One film frame of the crow landing on a wire, drawn in SVG. Decorative: the button around it
// carries the spoken description.
export default function SpliceFrame({ frame }: SpliceFrameProps) {
  const { y, wing } = POSES[frame];
  return (
    <svg className={styles.frame} viewBox="0 0 120 90" aria-hidden="true">
      <rect className={styles.paper} width="120" height="90" />
      <line className={styles.ink} x1="0" y1={WIRE_Y} x2="120" y2={WIRE_Y} strokeWidth="1.5" />
      <g className={styles.ink} transform={`translate(60 ${y})`}>
        <ellipse rx="8" ry="4.5" />
        <circle cx="8" cy="-3" r="3.2" />
        <polygon points="10.5,-3.5 16,-2.5 10.5,-1.5" />
        <polygon points="-7,0 -15,-3 -14,2" />
        {wing === null ? (
          // Perched: folded wing and legs down to the wire.
          <>
            <polygon points="-5,-2 5,-3 -9,2" />
            <line x1="-1" y1="4" x2="-1" y2={WIRE_Y - y} strokeWidth="1" />
            <line x1="2" y1="4" x2="2" y2={WIRE_Y - y} strokeWidth="1" />
          </>
        ) : (
          <>
            <polygon points={`-2,-2 -12,${wing - 8} 4,-2`} />
            <polygon points={`0,-1 -6,${wing - 11} 5,-1`} />
          </>
        )}
      </g>
    </svg>
  );
}
