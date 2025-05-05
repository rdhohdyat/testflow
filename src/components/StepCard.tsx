import { Card, CardContent } from "./ui/card";

type StepCardProps = {
  icon: string;
  title: string;
  description: string;
};

const StepCard = ({ icon, title, description }: StepCardProps) => {
  return (
    <Card className="bg-white border border-neutral-200 hover:shadow-md transition-shadow rounded-xl">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="text-2xl bg-neutral-100 dark:bg-black dark:border dark:border-white rounded-full p-3 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
