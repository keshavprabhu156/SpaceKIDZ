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
    <div data-reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="section-tag">{tag}</span>
      <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide text-star sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-star/55">{subtitle}</p>}
    </div>
  );
}
