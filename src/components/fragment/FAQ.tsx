import { motion } from "framer-motion";
import FaQAccordion from "../faq-accordion";
import faqIllustration from "../../assets/faq.svg"

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ = () => {
  const faqs: FAQItem[] = [
    {
      question: "Apa itu Control Flow Graph (CFG)?",
      answer:
        "Singkatnya, CFG adalah gambaran alur program. Ini membantu kita melihat semua kemungkinan jalan yang bisa dilewati kode saat dijalankan.",
    },
    {
      question: "Apa kegunaan utama TestFlow?",
      answer:
        "TestFlow membantu mahasiswa atau developer melihat struktur logika kode mereka secara visual, sehingga lebih mudah dipahami daripada hanya membaca teks baris per baris.",
    },
    {
      question: "Bagaimana cara aplikasi ini membuat grafik?",
      answer:
        "Aplikasi akan membaca kode Python Anda, mencari perintah seperti perulangan (loop) dan percabangan (if), lalu menghubungkannya menjadi sebuah grafik.",
    },
    {
      question: "Bahasa pemrograman apa saja yang didukung?",
      answer:
        "Untuk saat ini, fokus utama aplikasi kami adalah mendukung bahasa Python.",
    },
    {
      question: "Apakah saya bisa menyimpan hasil analisisnya?",
      answer:
        "Tentu! Kamu bisa membuat proyek, menyimpan riwayat analisis, dan mengekspor hasilnya dalam format PDF atau JSON.",
    },
    {
      question: "Apa itu Cyclomatic Complexity yang ada di aplikasi?",
      answer:
        "Itu adalah metrik sederhana untuk mengukur seberapa kompleks kode kamu berdasarkan jumlah jalur yang ada di dalam grafik alur.",
    },
  ];

  return (
    <section id="faq" className="container px-6 py-20 bg-white dark:bg-neutral-900/10">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-3xl font-bold text-center text-neutral-900 dark:text-white"
        >
          Pertanyaan Umum
        </motion.h2>
  
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Ilustrasi */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <img
              src={faqIllustration}
              alt="FAQ Ilustrasi"
              className="w-full max-w-sm mx-auto opacity-80"
            />
          </motion.div>
  
          {/* Daftar FAQ */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FaQAccordion
                  question={faq.question}
                  answer={faq.answer}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;