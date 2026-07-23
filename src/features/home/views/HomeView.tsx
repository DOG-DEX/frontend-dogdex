export function HomeView() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Dog Dex</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
        Identify breeds. Build your collection.
      </h1>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Upload a photo to scan a dog breed, then unlock entries in your personal
        breed dex.
      </p>
    </section>
  );
}
