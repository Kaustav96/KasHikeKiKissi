export default function SimpleDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 my-1">
      <div className="h-px w-16" style={{ background: "var(--wedding-border)" }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.5 }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.5 }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.5 }} />
      <div className="h-px w-16" style={{ background: "var(--wedding-border)" }} />
    </div>
  );
}
