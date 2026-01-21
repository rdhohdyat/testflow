import { motion } from "framer-motion";
import ServiceCard from "../service-card";
import flowGraphImage from "../../assets/flowgraph.svg"; 
import { GitFork, ListTree, CheckCircle2 } from "lucide-react";

type ServiceItem = {
  title: string;
  icon: any;
  description: string;
};

const Service = () => {
  const services: ServiceItem[] = [
    {
      title: "Visualisasi Grafik Alur",
      icon: <GitFork className="text-primary" />,
      description:
        "Otomatis mengubah kode program Anda menjadi grafik alur (CFG) untuk melihat bagaimana logika program berjalan.",
    },
    {
      title: "Analisis Jalur Eksekusi",
      icon: <ListTree className="text-primary" />,
      description:
        "Mendeteksi semua kemungkinan jalur yang bisa dilewati oleh program, membantu Anda memahami struktur kode.",
    },
    {
      title: "Cek Skenario Pengujian",
      icon: <CheckCircle2 className="text-primary" />,
      description:
        "Uji input data Anda dan lihat jalur mana saja yang berhasil dilewati untuk memastikan tidak ada logika yang terlewat.",
    },
  ];

  return (
    <section id="service" className="px-6 py-20 bg-neutral-50 dark:bg-neutral-900/10">
      <div className="container flex flex-col items-center max-w-6xl mx-auto text-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          src={flowGraphImage}
          alt="Ilustrasi Layanan"
          className="w-full max-w-sm mb-10 opacity-80"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
            Fitur Utama
          </h2>
          <p className="max-w-2xl mb-12 text-base text-muted-foreground">
            Beberapa hal yang bisa Anda lakukan di TestFlow untuk membantu mempermudah
            analisis logika program sederhana.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;