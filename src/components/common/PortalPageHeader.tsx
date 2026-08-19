/**
 * Compact dashboard titlebar — deliberately NOT the marketing site's hero
 * headline treatment. A small eyebrow + a modest heading in the body face,
 * with a bottom rule to separate it from content, the way a real work tool's
 * page header looks rather than a landing page's welcome banner.
 */
export default function PortalPageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-star/10 pb-4">
      <div>
        {eyebrow && <p className="dash-eyebrow">{eyebrow}</p>}
        <h1 className="dash-title">{title}</h1>
      </div>
      {action}
    </div>
  );
}
