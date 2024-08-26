"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const faqData = [
      {
        "question": "What types of SaaS products are available on Jazzee?",
        "answer": "Jazzee offers a wide range of SaaS products across various categories, including CRM, ERP, HR management, project management, cybersecurity, cloud storage, and more. We continuously update our platform to include the latest and most relevant software solutions for enterprises."
      },
      {
        "question": "Who can use Jazzee?",
        "answer": "Jazzee is designed primarily for mid to large enterprises looking to optimize their software procurement process. However, any organization that needs to purchase or replace SaaS products can benefit from our platform."
      },
      {
        "question": "How does Jazzee ensure the quality of the SaaS products listed?",
        "answer": "We carefully curate the SaaS products listed on our platform by evaluating their features, industry reputation, user reviews, and overall performance. Our goal is to provide only high-quality, reliable software solutions to our users."
      },
      {
        "question": "Are there any integration options available for the SaaS products purchased through Jazzee?",
        "answer": "Many of the SaaS products available on our platform offer integration options with popular enterprise systems and tools. Specific integration details can be found on the product pages or by contacting the vendors directly."
      },
      {
        "question": "How does Jazzee handle data privacy and security?",
        "answer": "Data privacy and security are top priorities for us. We use industry-standard encryption and follow strict security protocols to protect your data. Additionally, we comply with all relevant data protection regulations."
      },
      {
        "question": "What makes Jazzee different from other SaaS marketplaces?",
        "answer": "Jazzee stands out because of its unique Dutch reverse auction model, which gives buyers the upper hand in negotiating prices. Our focus on enterprise needs, transparent pricing, and a carefully curated list of products ensures a superior procurement experience."
      },
      {
        "question": "Is there a minimum purchase requirement on Jazzee?",
        "answer": "No, there is no minimum purchase requirement. You can use Jazzee to purchase any amount of SaaS products that meet your business needs."
      },
      {
        "question": "How do I become a vendor on Jazzee?",
        "answer": "If you're interested in becoming a vendor on Jazzee, you can straight away create an account and get started. Our team will review your application and get in touch with you to complete the onboarding process."
      }  
];

const FAQItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-500 py-3 sm:py-5 w-full">
      <button
        className="w-full text-left flex justify-between items-center focus:outline-none"
        onClick={toggle}
      >
        <span className="text-lg sm:text-xl font-medium">{question}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
          &#9660;
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="mt-2 text-gray-400">{answer}</p>
      </motion.div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="max-w-3xl mx-auto p-4 flex flex-col items-center justify-center py-10 sm:py-20">
      <h2 className="text-2xl sm:text-6xl font-bold mb-8 text-center max-w-2xl">
        Let's get all your questions answered, shall we?
      </h2>
      {faqData.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          toggle={() => toggleFAQ(index)}
        />
      ))}
    </div>
  );
};

export default FAQ;
