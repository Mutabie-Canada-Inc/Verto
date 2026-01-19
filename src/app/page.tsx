import ZoopGame from "@/components/ZoopGame";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-slate-50 flex flex-col items-center py-12 px-4 md:px-8 font-sans text-slate-900">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <header className="mb-8 text-center space-y-2">
          <h1 className="text-5xl font-black tracking-tight text-slate-900">
            Zoop
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            The Daily Logic Path
          </p>
        </header>

        <ZoopGame />

        <footer className="mt-12 text-center text-sm text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} Mutabie Canada Inc.
        </footer>
      </div>
    </main>
  );
}
