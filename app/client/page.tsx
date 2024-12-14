"use client";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white-50 to-green-100">
      <Header />
      <div>
        {/* <h1 className="mt-10 text-2xl font-bold"> HI client </h1> */}
         {/* How it works */}
          <section className="py-10 bg-white sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Хэрхэн ажилладаг вэ?</h2>
            <p className="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
              Манай платформ таны хэрэгцээнд нийцсэн шилдэг фрилансерыг олоход тусална. Та хүссэн төсөлдөө тохирох мэргэжилтнийг хялбархан хөлслөх боломжтой.
            </p>
          </div>

          <div className="relative mt-12 lg:mt-20">
            <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
              <img
                className="w-full"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
                alt=""
              />
            </div>

            <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
              <div>
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                  <span className="text-xl font-semibold text-gray-700">1</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Үнэгүй бүртгүүлээрэй</h3>
                <p className="mt-4 text-base text-gray-600">
                  Манай платформд бүртгүүлээд төслийн мэдээллээ оруулж, шаардлагад нийцсэн фрилансер хайж эхэлнэ үү.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                  <span className="text-xl font-semibold text-gray-700">2</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Төслөө нийтэл</h3>
                <p className="mt-4 text-base text-gray-600">
                  Төслийнхөө дэлгэрэнгүй мэдээллийг оруулж, шаардлагаа тодорхойл. Фрилансерууд таны төсөлд өргөдөл гаргах болно.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                  <span className="text-xl font-semibold text-gray-700">3</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">Фрилансер сонго</h3>
                <p className="mt-4 text-base text-gray-600">
                  Өргөдлүүдээс сонголт хийж, фрилансертайгаа хамтран ажиллаарай. Proactive платформ аюулгүй байдлыг хангана.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </div>
    
  )
}