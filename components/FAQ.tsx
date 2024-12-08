"use client";

import { useState } from "react";
import Link from "next/Link";
import {Help} from "./Icons/Icons.jsx";

const icons = {
    help: <Help fill="currentColor" size={30} height={undefined} width={undefined} />,
  };

interface FAQ {
    question: string;
    answer: string;
    link?: string;
}

const faqData: FAQ[] = [
    {
        question: "Яаж бүртгэл үүсгэх вэ?",
        answer: "Proactive фрилансе системд бүртгүүлэхийн тулд шаардлагатай мэдээллээ оруулж, баталгаажуулна уу. Бүртгэл үүсгэсний дараа та үйлчилгээний нөхцлийг хүлээн зөвшөөрнө.",
        link: "/signup",
    },
    {
        question: "Төлбөр шийдэл яаж явдаг вэ?",
        answer: "Та өөрийн Paypal аккаунтаар нэвтрэн төлбөрөө амархан хийх боломжтой. Дэлгэрэнгүй мэдээллийг манай зааврын хэсгээс үзнэ үү.",
        link: "#",
    },
    {
        question: "Өөрийн төлөвлөгөөг цуцлах боломжтой юу?",
        answer: "Та өөрийн хөтөлбөр болон төлөвлөгөөг хэрэглэгчийн самбараас цуцлах боломжтой. Цуцлах үед ямар нэгэн хураамж төлөх шаардлага гарч болзошгүй.",
        link: "#",
    },
    {
        question: "Дэмжлэг авахын тулд хаана хандах вэ?",
        answer: "Манай дэмжлэгийн багтай холбогдохыг хүсвэл хэрэглэгчийн тусламжийн төвд нэвтрэх эсвэл бидэн рүү шууд зурвас илгээнэ үү.",
        link: "#",
    },
];


export default function FAQSection(): JSX.Element {
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);

    const toggleQuestion = (index: number): void => {
        setOpenQuestion((prev) => (prev === index ? null : index));
    };

    return (
        <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                        Нийтлэг түгээмэл асуултууд
                    </h2>
                    <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">
                        Хэрэглэгчдийн системийн үйл ажиллагааны талаарх нийлэг асуултууд.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className={`transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer ${
                                openQuestion === index ? "hover:bg-gray-50" : "hover:bg-gray-50"
                            }`}
                        >
                            <button
                                type="button"
                                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                                onClick={() => toggleQuestion(index)}
                            >
                                <span className="flex text-lg font-semibold text-black">
                                    {faq.question}
                                </span>

                                <svg
                                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                                        openQuestion === index ? "rotate-180" : ""
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {openQuestion === index && (
                                <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                                    <p>
                                        {faq.answer}{" "}
                                        {/* {faq.link && (
                                            <Link
                                                href={faq.link}
                                                title="Learn more"
                                                className="text-blue-600 transition-all duration-200 hover:underline"
                                            >
                                                 {icons.help}
                                            </Link>
                                        )} */}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <p className="text-center text-gray-600 textbase mt-9">
                    Та хайж буй хариултаа олсонгүй юу?{" "}
                    <Link
                        href="#"
                        title="Contact support"
                        className="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline inline-flex items-center"
                    >
                        тусламжийн хуудас
                    </Link>
                </p>
            </div>
        </section>
    );
}
