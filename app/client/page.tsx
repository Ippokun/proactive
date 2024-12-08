"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white-50 to-green-100">
      <Header />
      <div>
        <h1 className="mt-10 text-2xl font-bold"> HI client </h1>
      </div>
      <Footer />
    </div>
    
  )
}