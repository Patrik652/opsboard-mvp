export default function Topbar() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-panel-muted px-6 py-4 text-text-primary">
      <div className="text-sm text-text-muted">Operational reliability workspace</div>
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded-full bg-success-muted/20 px-3 py-1 text-success">
          Demo account
        </span>
        <span className="text-text-muted">Status: All systems nominal</span>
      </div>
    </div>
  );
}
