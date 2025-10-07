import { Card, CardContent } from "../ui/card";
import coding from "../../assets/coding.svg";

const About = () => {
  return (
    <section id="about" className="px-6 py-20 continer">
      <div className="flex flex-col-reverse items-center max-w-6xl gap-12 mx-auto md:flex-row">
        {/* Text Section */}
        <div className="flex-1">
          <h2 className="mb-3 text-3xl font-bold md:text-4xl text-neutral-900 dark:text-white">
            About TestFlow
          </h2>
          <p className="mb-6 text-base text-muted-foreground md:text-lg">
            Empowering developers with visual tools to understand and optimize code logic.
          </p>

          <Card className="text-left border bg-background">
            <CardContent className="flex flex-col gap-6 px-6 py-8 text-base leading-relaxed md:px-10 text-neutral-700 dark:text-white">
              <p>
                <span className="font-medium text-neutral-900 dark:text-white">TestFlow</span> is a developer-focused platform designed to simplify code logic analysis through clear and interactive{" "}
                <span className="font-medium text-primary">Control Flow Graphs</span>. Our visual tools help you break down complex logic into understandable segments.
              </p>

              <p>
                From code comprehension to test case exploration, our mission is to provide tools that make your debugging and optimization process more efficient.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Image Section */}
        <div className="flex-1">
          <img
            src={coding}
            alt="Control Flow Graph Illustration"
            className="w-full max-w-md mx-auto drop-shadow-sm rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
