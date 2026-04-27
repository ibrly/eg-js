export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-row">
      <aside aria-label="Primary navigation placeholder" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
