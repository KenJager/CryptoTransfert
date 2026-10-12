"use client"

import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="flex justify-center items-center py-3">
    <Loader2 className="h-16 w-16 animate-spin text-red-700" />
  </div>
);

export default Loader;