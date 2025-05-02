import ServiceCard from "../ServiceCard";
import flowGraphImage from "../../assets/flowgraph.svg"; // ilustrasi topik service
import { GitFork, Layers, ClipboardCheck } from "lucide-react";

type ServiceItem = {
  title: string;
  icon: any;
  description: string;
};

const Service = () => {
  const services: ServiceItem[] = [
    {
      title: "Control Flow Graph Visualization",
      icon: <GitFork />,
      description:
        "Automatically generate Control Flow Graphs (CFG) from your code. Visualize the structure of your program to better understand its execution flow.",
    },
    {
      title: "Path Generation and Analysis",
      icon: <Layers />,
      description:
        "Identify all possible execution paths in your program. Generate test paths to support effective path-based testing strategies.",
    },
    {
      title: "Test Case Evaluation",
      icon: <ClipboardCheck />,
      description:
        "Input your test cases and validate them against the generated paths to ensure optimal code coverage and reliability.",
    },
  ];

  return (
    <section id="service" className="py-20 bg-neutral-50">
      <div className="container max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Gambar Ilustrasi */}
        <img
          src={flowGraphImage}
          alt="Services Illustration"
          className="w-full max-w-md mb-10 drop-shadow-sm rounded-lg"
        />

        {/* Judul dan Deskripsi */}
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Our Services
        </h2>
        <p className="text-muted-foreground mb-12 max-w-3xl text-base md:text-lg">
          Discover powerful tools for visualizing, analyzing, and evaluating
          your program's control flow with ease.
        </p>

        {/* Kartu Layanan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
