type ComingSoonProps = {
  title: string;
};

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This screen is coming soon.
      </p>
    </div>
  );
}
