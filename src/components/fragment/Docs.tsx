import { Card } from "../ui/card";
import docsImage from "../../assets/docs.svg";
import StepCard from "../StepCard";
import { ChartGantt, Code, Combine, GitCommitVertical, GitFork, Wallpaper } from "lucide-react";

type Step = {
  title: string;
  description: string;
  icon: any;
};

const Docs = () => {
  const steps: Step[] = [
    {
      title: "Transform Python Code to AST",
      description:
        "Convert the Python source code into an Abstract Syntax Tree (AST), which represents the syntactic structure of the code.",
      icon: <Code/>,
    },
    {
      title: "Identify AST Nodes",
      description:
        "Traverse the AST to identify and classify its nodes, which represent various syntactic constructs like loops, conditionals, and assignments.",
      icon: <ChartGantt />,
    },
    {
      title: "Separate Blocks Based on Rules",
      description:
        "Identify and group code statements into logical blocks based on control flow rules, such as loops and conditionals.",
      icon: <Combine />,
    },
    {
      title: "Create CFG Nodes from AST Nodes",
      description:
        "Convert the identified blocks into nodes in the Control Flow Graph (CFG), each representing a logical unit of execution.",
      icon: <GitCommitVertical />,
    },
    {
      title: "Add Edges Between CFG Nodes",
      description:
        "Add edges between the CFG nodes to represent the flow of control between different blocks in the program.",
      icon: <GitFork />,
    },
    {
      title: "Visualize the CFG",
      description:
        "Generate a visual representation of the Control Flow Graph (CFG) to easily understand the flow of execution in the code.",
      icon: <Wallpaper />,
    },
  ];

  return (
    <section id="docs" className="py-20 container ">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-neutral-900 dark:text-white">
          How TestFlow Works ?
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          <div className="xl:col-span-5 space-y-5">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          <div className="xl:col-span-7 flex  justify-center">
            <img
              src={docsImage}
              alt="Services Illustration"
              className="w-full drop-shadow-sm rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Docs;
