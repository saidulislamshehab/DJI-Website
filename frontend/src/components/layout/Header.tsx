"use client";

import React from "react";
import AnnouncementBar from "./AnnouncementBar";
import TopBar from "./TopBar";
import MainNav from "./MainNav";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";

export default function Header() {
  return (
    <>
      <AnnouncementBar />
      <TopBar />
      <MainNav />
      <SearchModal />
      <CartDrawer />
    </>
  );
}
