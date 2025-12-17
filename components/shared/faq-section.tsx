"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I earn $G tokens?",
      answer: "You earn $G tokens by rating movies (5 $G per review), voting on other reviews (1 $G per vote), and maintaining daily streaks for bonus multipliers."
    },
    {
      question: "What is the $G token?",
      answer: "$G is our native utility token built on the Celo blockchain. It's used to reward community participation and can be redeemed for various benefits within the platform."
    },
    {
      question: "Do I need to pay gas fees?",
      answer: "No! We sponsor all gas fees on the Celo network, so you can rate movies and earn rewards without any transaction costs."
    },
    {
      question: "How does the AI recommendation work?",
      answer: "Our AI analyzes your rating patterns, viewing history, and community behavior to suggest movies you're likely to enjoy. The more you rate, the better it gets."
    },
    {
      question: "Can I withdraw my $G tokens?",
      answer: "Yes, $G tokens are real cryptocurrency that you fully own. You can view them in your connected wallet and use them as you wish."
    },
    {
      question: "Is MovieMeter free to use?",
      answer: "Absolutely! MovieMeter is completely free to use. In fact, we pay you to participate through our token rewards system."
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about MovieMeter
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-semibold pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus size={20} className="text-primary" />
                    ) : (
                      <Plus size={20} className="text-muted-foreground" />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pt-2 pb-5">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}