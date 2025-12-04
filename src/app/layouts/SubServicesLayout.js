"use client";

import React, { useState } from "react";
import Link from "next/link"; // ✅ Fix: Added import
import { motion } from "framer-motion";
import { FaRegLightbulb, FaUserCheck, FaCheckCircle } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const SubServiceLayout = ({ subService, parent }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!subService) {
    return <p className="text-red-500">No sub-service data found</p>;
  }

  const steps = [
    {
      icon: <FaRegLightbulb size={40} className="text-black mb-2" />,
      title: "Describe Your Task",
      description:
        "Tell us what you need done, when and where it works for you.",
    },
    {
      icon: <FaUserCheck size={40} className="text-black mb-2" />,
      title: "Choose Your Tasker",
      description:
        "Browse trusted Taskers by skills, reviews, and price. Chat with them to confirm details.",
    },
    {
      icon: <FaCheckCircle size={40} className="text-black mb-2" />,
      title: "Get It Done!",
      description:
        "Your Tasker arrives and gets the job done. Pay securely and leave a review, all through GoZipply.",
    },
  ];

  const toggleFaq = (index) => setOpenIndex(openIndex === index ? null : index);

  const banners = ["/Task11.webp", "/Task12.webp", "/Task13.webp", "/Task14.webp"];

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden bg-white text-black">
        <img
          src={banners[0]}
          alt="Upper Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md p-12 rounded-2xl text-center shadow-2xl max-w-2xl w-full border border-white/40"
          >
            {parent && (
              <p className="mb-3 text-2xl font-bold tracking-wide text-black">
                {parent.title}
              </p>
            )}
            <h1 className="text-5xl font-extrabold mb-6">{subService.name}</h1>
            <p className="mb-8 leading-relaxed text-black">
              {subService.description}
            </p>
            <Link href={`${subService.href}/book`}>
              <button className="mt-auto px-6 py-2 w-max bg-white text-black font-semibold border border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300">
                View Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* LOWER SECTION */}
      <section className="w-full min-h-screen flex flex-col md:flex-row items-center py-16 gap-8 bg-black text-white">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 p-8 flex flex-col justify-center"
        >
          {parent && <p className="text-gray-400 mb-2">{parent.title}</p>}
          <h2 className="text-4xl font-bold mb-4">{subService.name}</h2>
          <p className="mb-4 text-gray-300">
            The GoZiply platform is designed to make everyday life easier by
            providing users with access to a wide range of skilled and reliable
            professionals...
          </p>
          <p className="text-gray-400">{subService.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 h-[80vh] overflow-hidden rounded-lg shadow-lg"
        >
          <img
            src={banners[1]}
            alt="Lower Section Banner"
            className="w-full h-full object-cover transform hover:scale-105 transition-all duration-500"
          />
        </motion.div>
      </section>

      {/* STEPS */}
      <section className="w-full py-20 bg-black text-black">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg cursor-pointer 
                         transform transition-all duration-300 
                         hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-black">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* READY TO HIRE */}
      <section className="w-full py-16 flex flex-col md:flex-row items-center bg-black text-white gap-8">
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 h-[60vh] overflow-hidden rounded-lg shadow-lg"
        >
          <img
            src={banners[2]}
            alt="Ready to Hire Banner"
            className="w-full h-full object-cover transform hover:scale-105 transition-all duration-500"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 p-8 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold mb-6">Ready to hire a Tasker?</h2>
          <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300 w-max">
            Find Help Now
          </button>
        </motion.div>
      </section>

      {/* FAQ */}
      {subService.faqs && subService.faqs.length > 0 && (
        <section className="w-full py-16 bg-black text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {subService.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white/10 p-4 rounded-lg shadow hover:shadow-lg transition-all duration-300"
                >
                  <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-semibold">{faq.question}</span>
                    {openIndex === index ? (
                      <FiChevronUp className="text-white" size={20} />
                    ) : (
                      <FiChevronDown className="text-white" size={20} />
                    )}
                  </button>
                  {openIndex === index && (
                    <p className="mt-2 text-gray-300">{faq.answer}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SubServiceLayout;
