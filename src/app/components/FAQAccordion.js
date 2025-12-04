"use client";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function FAQAccordion() {
  const faqs = [
    {
      question: "What is GoZipply?",
      answer:
        "GoZipply is a platform that connects people with local freelancers to help with everyday tasks like cleaning, moving, delivery, and handyman services.",
    },
    {
      question: "How do I become a Tasker?",
      answer:
        "Sign up, build your profile, verify your identity, pay registration fee, set your schedule, and start getting jobs.",
    },
    {
      question: "Is there a registration fee?",
      answer:
        "In some cities, there is a $25 registration fee to help provide the best service.",
    },
    {
      question: "How do I get paid?",
      answer:
        "Taskers are paid through the app directly after completing tasks. Payments are deposited to your bank account.",
    },
    {
      question: "Can I choose my own schedule?",
      answer:
        "Yes! You can set your weekly availability and opt in to receive same-day jobs.",
    },
    {
      question: "What kind of tasks can I do?",
      answer:
        "You can offer services like cleaning, moving, delivery, furniture assembly, painting, and more.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-16 px-8 md:px-16 bg-gray-50 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-12">FAQs</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-4 cursor-pointer"
          >
            <div
              className="flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              <h2 className="text-lg font-medium">{faq.question}</h2>
              {openIndex === index ? (
                <MinusIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <PlusIcon className="h-6 w-6 text-yellow-400" />
              )}
            </div>

            {openIndex === index && (
              <p className="mt-4 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
