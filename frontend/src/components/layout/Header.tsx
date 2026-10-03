"use client";

import React from "react";
import TopBar from "./TopBar";
import MainNav from "./MainNav";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";

export default function Header() {
  return (
    <>
      <TopBar />
      <MainNav />
      <SearchModal />
      <CartDrawer />
    </>
  );
}
