"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white-50 to-green-100">
      <Header />
        <section className="py-10 bg-gray-100 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Системийг хэрхэн ашиглах вэ?
            </h2>
            <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
              Бид танд амжилттай төслүүдийг эхлүүлэх, хөгжүүлэх, амжилтад хүрэхэд шаардлагатай бүх хэрэгслийг санал болгож байна.
            </p>
          </div>

          <ul className="max-w-md mx-auto mt-16 space-y-12">
            <li className="relative flex items-start">
              <div
                className="-ml-0.5 absolute mt-0.5 top-14 left-8 w-px border-l-4 border-dotted border-gray-300 h-full"
                aria-hidden="true"
              ></div>

              <div className="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                <svg
                  className="w-10 h-10 text-fuchsia-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-semibold text-black">Үнэгүй бүртгэл үүсгэх</h3>
                <p className="mt-4 text-base text-gray-600">
                  Манай платформд нэгдэж, өөрийн профайлыг үүсгэн, чадвараа харуулах боломжтой боллоо. Энэ бол таны амжилтын эхлэл юм.
                </p>
              </div>
            </li>

            <li className="relative flex items-start">
              <div
                className="-ml-0.5 absolute mt-0.5 top-14 left-8 w-px border-l-4 border-dotted border-gray-300 h-full"
                aria-hidden="true"
              ></div>

              <div className="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                <svg
                  className="w-10 h-10 text-fuchsia-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-semibold text-black">Ажлын зар хайх</h3>
                <p className="mt-4 text-base text-gray-600">
                  фрилансерууд буюу та ажлуудыг хайж, хүссэн ажилдаа хүсэлт илгээх боломжтой.
                </p>
              </div>
            </li>

            <li className="relative flex items-start">
              <div className="relative flex items-center justify-center flex-shrink-0 w-16 h-16 bg-white rounded-full shadow">
                <svg
                  className="w-10 h-10 text-fuchsia-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-6">
                <h3 className="text-lg font-semibold text-black">Төслийг амжилттай хэрэгжүүлэх</h3>
                <p className="mt-4 text-base text-gray-600">
                  Хэрэглэгчид болон фрилансерууд төслийн бүх үе шатанд хамтран ажиллах ба амжилттай дуусгахад шаардлагатай бүхнийг бид дэмжинэ.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
    
  )
}