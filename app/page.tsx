"use client";

import FAQSection from "../components/FAQ";
import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-white-50 to-green-100">
      <Header />
      <section className="py-10 sm:py-16 lg:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold text-black sm:text-6xl lg:text-7xl">
                Төслийг амьдралд хэрэгжүүлэх 
                <div className="relative inline-flex">
                  <span className="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4ADE80]"></span>
                  <span className="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl">
                    Proactive.
                  </span>
                </div>
              </h1>

              <p className="mt-8 text-base text-black sm:text-xl">
                Дижитал технологийг ашиглан фрилансерүүд болон ажил олгогчдыг холбох, 
                хоёр талын хэрэгцээ, шаардлагыг найдвартай, үр дүнтэй хангах платформд тавтай морилно уу.
              </p>

              <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 focus:bg-orange-600"
                  role="button"
                >
                  Яаж ажилладаг вэ
                </Link>

                <Link
                  href="/video"
                  className="inline-flex items-center mt-6 text-base font-semibold transition-all duration-200 sm:mt-0 hover:opacity-80"
                >
                  <svg
                    className="w-10 h-10 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      fill="#F97316"
                      stroke="#F97316"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                    Танилцуулга бичлэг
                </Link>
              </div>
            </div>

            <div>
              <img
                className="w-full"
                src="/asset/HomeProactivePhoto.jpg"
                alt="Фриланс платформын зураг"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Ajliin uyn hatan chanariin bolomj */}
      ;

      <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="grid items-stretch gap-y-10 md:grid-cols-2 md:gap-x-20">
                  <div className="relative grid grid-cols-2 gap-6 mt-10 md:mt-0">
                      <div className="overflow-hidden aspect-w-3 aspect-h-4">
                          <img className="object-cover object-top origin-top scale-150" src="https://cdn.rareblocks.xyz/collection/celebration/images/features/2/team-work.jpg" alt="" />
                      </div>

                      <div className="relative">
                          <div className="h-full overflow-hidden aspect-w-3 aspect-h-4">
                              <img className="object-cover scale-150 lg:origin-bottom-right" src="https://cdn.rareblocks.xyz/collection/celebration/images/features/2/woman-working-on-laptop.jpg" alt="" />
                          </div>

                          <div className="absolute inset-0 grid w-full h-full place-items-center">
                              <button type="button" className="inline-flex items-center justify-center w-12 h-12 text-blue-600 bg-white rounded-full shadow-md lg:w-20 lg:h-20">
                                  <svg className="w-6 h-6 lg:w-8 lg:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                                  </svg>
                              </button>
                          </div>
                      </div>

                      <div className="absolute -translate-x-1/2 left-1/2 -top-16">
                          <img className="w-32 h-32" src="https://cdn.rareblocks.xyz/collection/celebration/images/features/2/round-text.png" alt="" />
                      </div>
                  </div>

                  <div className="flex flex-col items-start xl:px-16">
                      <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                          Танай хэрэгжүүлж буй төсөлд бид 
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-gray-600">
                          Манай платформ таныг зөв мэргэжилтэнтэй холбож, ажлаа амжилттай бүтээхэд тусална. Зөвхөн мэргэжлийн фрилансерууд.
                      </p>

                      <Link
                          href="/signup"
                          title="Sign up now"
                          className="inline-flex items-center justify-center px-5 py-4 mt-8 text-base font-semibold text-white transition-all duration-200 rounded-md hover:opacity-90 focus:opacity-90 lg:mt-auto bg-gradient-to-r from-fuchsia-600 to-blue-600"
                      >
                          Одоо бүртгүүлээрэй
                          <svg className="w-5 h-5 ml-8 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                      </Link>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Niitleg asuult hariult */}
      <FAQSection />
      {/* uur yu hiihuu */}
      <Footer />
    </div>
  );
}
