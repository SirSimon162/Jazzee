import "./globals.css";
import {Bricolage_Grotesque} from "next/font/google";
import SessionWrapper from "./components/SessionWrapper";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Jazzee Project",
  description: "Made by Anushrey and Anmol for Jazzee Technologies",
};

export const bricolage = Bricolage_Grotesque({
  subsets: ['latin']
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body className={`flex flex-col items-center justify-center w-full ${bricolage.className}`}>
          <NavBar />
          {children}
          <Footer />
        </body>
      </SessionWrapper>
    </html>
  );
}
