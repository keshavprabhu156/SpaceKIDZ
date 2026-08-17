export default function SectionHeading({
  tag,
  title,
  subtitle,
  align = "center",
}: {
  tag: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      data-reveal
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <span className={`section-tag ${align === "center" ? "justify-center" : ""}`}>{tag}</span>
      <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-tight text-star sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[15px] leading-relaxed text-star/60">{subtitle}</p>
      )}
    </div>
  );
}
