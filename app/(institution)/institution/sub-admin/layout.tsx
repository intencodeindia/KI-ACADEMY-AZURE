"use client"

import { PayPopup } from "../admin/PayPopup";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PayPopup>{children}</PayPopup>
}
