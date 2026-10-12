import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Swifto — Tutorials",
  description: "Apprenez à utiliser Krypto pas à pas.",
};

export default function TutorialsPage() {
  return (
    <main className="min-h-screen pt-24 px-6 md:px-14">
      <h1 className="text-white text-4xl font-bold mb-6">Tutorials</h1>
      <p className="text-white/70">
        Des guides simples pour maîtriser la crypto.
      </p>
    </main>
  );
}