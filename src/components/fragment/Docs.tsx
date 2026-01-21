import { motion } from "framer-motion";
import docsImage from "../../assets/docs.svg";
import StepCard from "../step-card";
import { ChartGantt, Code, Combine, GitCommitVertical, GitFork, Wallpaper } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: any;
};

const Docs = () => {
  const steps: Step[] = [
    {
      title: "Baca Kode Python",
      description:
        "Sistem membaca kode Python Anda dan mengubahnya menjadi struktur data pohon (AST) agar lebih mudah diproses komputer.",
      icon: <Code />,
    },
    {
      title: "Identifikasi Komponen Kode",
      description:
        "Menganalisis setiap bagian kode untuk membedakan mana yang merupakan perintah biasa, percabangan (if), atau perulangan (loop).",
      icon: <ChartGantt />,
    },
    {
      title: "Pengelompokan Logika",
      description:
        "Mengelompokkan baris kode ke dalam blok-blok logis berdasarkan cara perintah tersebut dijalankan.",
      icon: <Combine />,
    },
    {
      title: "Pembuatan Node Alur",
      description:
        "Mengubah kelompok kode tadi menjadi titik-titik (node) di dalam grafik alur.",
      icon: <GitCommitVertical />,
    },
    {
      title: "Menghubungkan Alur",
      description:
        "Menarik garis penghubung antar titik untuk menunjukkan urutan eksekusi program dari awal sampai akhir.",
      icon: <GitFork />,
    },
    {
      title: "Visualisasi Grafik (CFG)",
      description:
        "Menampilkan hasil akhir dalam bentuk grafik interaktif yang mudah dipahami secara visual.",
      icon: <Wallpaper />,
    },
  ];

  return (
    <section id="docs" className="container px-6 py-20 bg-white dark:bg-neutral-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
            Bagaimana TestFlow Bekerja?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Proses sederhana di balik layar untuk mengubah baris kode Anda menjadi grafik alur yang rapi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-12 items-center">
          {/* Kolom Kiri: Langkah-langkah */}
          <div className="space-y-4 xl:col-span-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <StepCard
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
              </motion.div>
            ))}
          </div>

          {/* Kolom Kanan: Ilustrasi */}
          <motion.div 
            className="flex justify-center xl:col-span-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <img
              src={docsImage}
              alt="Ilustrasi Cara Kerja"
              className="w-full max-w-md rounded-lg opacity-90 drop-shadow-md"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Docs;