import FaQAccordion from "../faq-accordion";
import faqIllustration from "../../assets/faq.svg"

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ = () => {
  const faqs: FAQItem[] = [
    {
      question: "What is a Control Flow Graph (CFG)?",
      answer:
        "A Control Flow Graph is a representation of all possible paths that might be traversed through a program during its execution.",
    },
    {
      question: "What is TestFlow?",
      answer:
        "TestFlow is a feature in our application that visually represents the control flow of a program, helping developers understand and analyze their code.",
    },
    {
      question: "How does the application generate a CFG?",
      answer:
        "The application parses the source code and identifies control structures like loops, conditions, and function calls to construct the graph.",
    },
    {
      question: "Can I upload my own code to generate a graph?",
      answer:
        "Yes, you can upload your source code files, and the application will generate a corresponding Control Flow Graph.",
    },
    {
      question: "What programming languages are supported?",
      answer:
        "Currently, the application supports Python, JavaScript, and Java, with plans to add more languages in the future.",
    },
    {
      question: "Is the Control Flow Graph exportable?",
      answer:
        "Yes, you can export the graph as an image or PDF for documentation purposes.",
    },
    {
      question: "Does the application support static analysis tools?",
      answer:
        "Yes, the application integrates with static analysis tools to enhance the insights provided by the Control Flow Graph.",
    },
  ];

  return (
    <section className="py-20 container">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-white">
        Frequently Asked Questions
      </h2>
  
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Illustration */}
        <div className="hidden md:block">
          <img
            src={faqIllustration}
            alt="FAQ Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
  
        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaQAccordion
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export default FAQ;