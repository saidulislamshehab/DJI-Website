"use client";

import React from "react";
import TopBar from "./TopBar";
import SecondaryNav from "./SecondaryNav";
import MainNav from "./MainNav";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      <TopBar />
      <SecondaryNav />
      <MainNav />
    </header>
  );
}
