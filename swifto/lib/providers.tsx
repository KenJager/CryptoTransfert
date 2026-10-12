// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { TransactionsProvider } from "@/context/TransactionContext";

export function Providers({ children }: { children: ReactNode }) {
  // useState pour que le QueryClient ne soit créé qu'une fois
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // 1 min
            gcTime: 5 * 60_000, // 5 min
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TransactionsProvider>{children}</TransactionsProvider>
    </QueryClientProvider>
  );
}