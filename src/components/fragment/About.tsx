import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import coding from "../../assets/coding.svg";
import { Code2, Search, BookOpen } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="px-6 py-20 bg-neutral-50/50 dark:bg-neutral-900/10">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row">
          
          {/* Bagian Teks */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
              Tentang <span className="text-primary">TestFlow</span>
            </h2>
            
            <p className="mb-6 text-base text-muted-foreground">
              Alat bantu sederhana untuk membantu mahasiswa atau pengembang pemula memahami alur logika kode program melalui visualisasi grafik.
            </p>

            <Card className="border shadow-sm bg-background">
              <CardContent className="flex flex-col gap-5 p-6 md:p-8">
                <div className="flex gap-4">
                  <div className="p-2 h-fit rounded-md bg-primary/10">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    <span className="font-semibold text-neutral-900 dark:text-white">TestFlow</span> dibuat untuk mengubah kode Python menjadi diagram alur (CFG). Tujuannya agar logika yang bercabang atau berulang bisa dilihat lebih jelas secara visual.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="p-2 h-fit rounded-md bg-primary/10">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    Aplikasi ini membantu mengecek apakah ada bagian kode yang tidak akan pernah dijalankan serta menghitung kompleksitas dasar dari fungsi yang Anda buat.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="p-2 h-fit rounded-md bg-primary/10">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    Sangat cocok digunakan sebagai alat bantu belajar bagi yang sedang mendalami algoritma atau ingin mempermudah proses dokumentasi alur program.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bagian Ilustrasi */}
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={coding}
              alt="Ilustrasi"
              className="w-full max-w-sm drop-shadow-md opacity-90"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;