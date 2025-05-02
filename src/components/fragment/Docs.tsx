import { Card } from "../ui/card";
import FlowChart from "../FlowGraph";
import StepCard from "../StepCard";

type Step = {
  title: string;
  description: string;
  icon: string;
};

const Docs = () => {
  const steps: Step[] = [
    {
      title: "Transform Python Code to AST",
      description:
        "Convert the Python source code into an Abstract Syntax Tree (AST), which represents the syntactic structure of the code.",
      icon: "📜",
    },
    {
      title: "Identify AST Nodes",
      description:
        "Traverse the AST to identify and classify its nodes, which represent various syntactic constructs like loops, conditionals, and assignments.",
      icon: "🔍",
    },
    {
      title: "Separate Blocks Based on Rules",
      description:
        "Identify and group code statements into logical blocks based on control flow rules, such as loops and conditionals.",
      icon: "🔲",
    },
    {
      title: "Create CFG Nodes from AST Nodes",
      description:
        "Convert the identified blocks into nodes in the Control Flow Graph (CFG), each representing a logical unit of execution.",
      icon: "🧩",
    },
    {
      title: "Add Edges Between CFG Nodes",
      description:
        "Add edges between the CFG nodes to represent the flow of control between different blocks in the program.",
      icon: "🔗",
    },
    {
      title: "Visualize the CFG",
      description:
        "Generate a visual representation of the Control Flow Graph (CFG) to easily understand the flow of execution in the code.",
      icon: "📊",
    },
  ];

  return (
    <section id="docs" className="py-20 container bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-10 text-neutral-900">
          How CodeFlow Works
        </h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Step cards column */}
          <div className="xl:col-span-5 space-y-4">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
          
          {/* FlowChart column */}
          <div className="xl:col-span-7">
            <Card className="p-4 h-full shadow-sm overflow-hidden bg-white border border-neutral-200">
              <FlowChart />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Docs;