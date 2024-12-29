"use client";

import { ModeToggle } from "@/components/utils/modeToggle";
import { useEffect } from "react";

export default function Home() {
 
  useEffect(() => {
    console.log("Home page mounted");
  }, []);

  return (
    <div >
     <ModeToggle/>
    </div>
  );
}
