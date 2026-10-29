"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetAboutUsQuery } from "@/feature/slice/aboutUs/aboutUs";


export default function FAQ() {
    const { data, error, isLoading } = useGetAboutUsQuery({});
    const item = data?.data.faqs || [];
   
    return (
        <div className="w-full py-8 md:py-12 lg:py-25 container">
            <div className="mx-auto ">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-primaryColor text-xl font-semibold leading-5 ">FAQ's</p>
                    <h2 className="text-center text-black text-3xl md:text-4xl lg:text-5xl font-semibold leading-[130%] mt-4">
                        Frequently Asking Questions
                    </h2>
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible defaultValue="item-3" className="space-y-3">
                    {item.map((faq, index) => (
                        <AccordionItem
                            key={faq.question}
                            value={`item-${faq.question}`}
                            className="border border-gray-100 rounded-sm overflow-hidden data-[state=open]:bg-[#ECEFF3]"
                        >
                            <AccordionTrigger className="px-4 md:px-8 py-4 text-left hover:no-underline text-[20px] font-semibold leading-[130%] tracking-[0.1px] text-[#1D1F2C]">
                                {index + 1}. {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 md:px-8 pb-6 text-[16px] leading-6 text-[#777980]">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}