import { Card } from "../ui/card";
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
    <section id="docs" className="container px-6 py-20 ">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-10 text-3xl font-bold text-center text-neutral-900 dark:text-white">
          How TestFlow Works ?
        </h2>

        <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-5">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          <div className="flex justify-center xl:col-span-7">
            <img
              src={docsImage}
              alt="Services Illustration"
              className="w-full rounded-lg drop-shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Docs;
