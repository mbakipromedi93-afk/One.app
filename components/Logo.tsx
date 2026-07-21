export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="14"
        y="34"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="700"
        fontSize="34"
        fill="#16213D"
      >
        O
      </text>
      <circle cx="30" cy="8" r="4" fill="#C08A28" />
    </svg>
  );
}
