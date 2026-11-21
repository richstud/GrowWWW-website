import { Link } from "react-router-dom";

type Client = { id: string; company_name: string; logo_url: string; display_logo_url?: string };

/**
 * Two rows of client logos drifting in opposite directions. Each tile has a slow gold light sweep and
 * lifts on hover; a logo links to the client's story once it's published. Hovering a row pauses it.
 */
export const LogoWall = ({ clients, storyFor }: { clients: Client[]; storyFor: (name: string) => string | undefined }) => {
  if (!clients.length) return null;
  // Repeat the list so each row is wider than the screen, then double it for a seamless loop.
  const fill = (list: Client[]) => {
    const out: Client[] = [];
    while (out.length < 10) out.push(...list);
    return out;
  };
  const rowA = fill(clients);
  const rowB = fill([...clients].reverse());

  const tile = (c: Client, key: string, copy: boolean, i: number) => {
    const story = storyFor(c.company_name);
    const inner = (
      <>
        <span
          className="logo-tile flex h-24 w-40 items-center justify-center rounded-2xl border border-border bg-[linear-gradient(160deg,hsl(30_12%_10%),hsl(30_12%_6%))] p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/70 group-hover:shadow-[0_18px_40px_-18px_hsl(38_65%_55%/0.6)] sm:h-28 sm:w-52"
          style={{ ["--sheen-delay" as string]: `${(i % 5) * 1.3}s` }}
        >
          <img src={c.display_logo_url || c.logo_url} alt={copy ? "" : `${c.company_name} logo`} loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
        </span>
        <span className="mt-2 block text-center text-xs text-muted-foreground transition-colors group-hover:text-primary">
          {c.company_name}
          {story && <span className="text-primary"> · Read story</span>}
        </span>
      </>
    );
    return (
      <li key={key} className="flex-shrink-0 px-2 sm:px-3" data-copy={copy || undefined} aria-hidden={copy || undefined}>
        {story ? (
          <Link to={story} tabIndex={copy ? -1 : undefined} className="group block">{inner}</Link>
        ) : (
          <div className="group">{inner}</div>
        )}
      </li>
    );
  };

  const row = (list: Client[], reverse: boolean, speed: string) => (
    <div className={`marquee py-3 ${reverse ? "marquee-secondary" : ""}`} style={{ ["--marquee-speed" as string]: speed }}>
      <ul className={`marquee-track ${reverse ? "is-reverse" : ""}`}>
        {list.map((c, i) => tile(c, `a-${c.id}-${i}`, i >= clients.length, i))}
        {list.map((c, i) => tile(c, `b-${c.id}-${i}`, true, i + 3))}
      </ul>
    </div>
  );

  return (
    <div className="-mx-4 space-y-2">
      {row(rowA, false, "70s")}
      {row(rowB, true, "85s")}
    </div>
  );
};
