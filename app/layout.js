import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "FoodRescue",
  description: "Surplus food redistribution and expiry tracking"
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  return (
    <html lang="en">
      <body>
        <header className="nav">
          <strong>FoodRescue</strong>
          <nav className="navlinks">
            {session ? <>
              <Link href="/">Dashboard</Link>
              <Link href="/donors">Donors</Link>
              <Link href="/recipients">Recipients</Link>
              <Link href="/batches">Food batches</Link>
              <Link href="/requests">Requests</Link>
              <Link href="/transportation">Transport</Link>
              <Link href="/distributions">Distributions</Link>
              <form action="/api/auth/logout" method="post"><button className="secondary">Logout</button></form>
            </> : <Link href="/login">Login</Link>}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
