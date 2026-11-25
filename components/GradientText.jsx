export default function GradientText({
  colors = ["#00e5ff", "#8a2be2", "#ff007f"],
  className = "",
  children,
}) {
  const gradient = `linear-gradient(90deg, ${[...colors, colors[0]].join(", ")})`;

  return (
    <span
      className={`gradient-text ${className}`}
      style={{ backgroundImage: gradient }}
    >
      {children}
    </span>
  );
}
