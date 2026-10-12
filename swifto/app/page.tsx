import { Welcome, Services, Transactions } from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <Welcome />
      </div>
      <Services />
      <Transactions />
    </div>
  );
}