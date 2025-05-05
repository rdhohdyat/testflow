import { Card, CardContent } from "../ui/card";
import coding from "../../assets/coding.svg"; // ganti dengan ilustrasi yang sesuai

const About = () => {
  return (
    <section id="about" className="py-20 container">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Section */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
            About TestFlow
          </h2>
          <p className="text-muted-foreground mb-6 text-base md:text-lg">
            Empowering developers with visual tools to understand and optimize code logic.
          </p>

          <Card className="bg-background border text-left">
            <CardContent className="px-6 md:px-10 py-8 flex flex-col gap-6 text-neutral-700 dark:text-white text-base leading-relaxed">
              <p>
                <span className="font-medium text-neutral-900 dark:text-white">TestFlow</span> is a developer-focused platform designed to simplify code logic analysis through clear and interactive{" "}
                <span className="text-primary font-medium">Control Flow Graphs</span>. Our visual tools help you break down complex logic into understandable segments.
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
