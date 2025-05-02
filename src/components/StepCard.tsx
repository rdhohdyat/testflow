import { Card, CardContent } from "./ui/card";

type StepCardProps = {
  icon: string;
  title: string;
  description: string;
};

const StepCard = ({ icon, title, description }: StepCardProps) => {
  return (
    <Card className="bg-white shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex justify-center items-center p-2 text-2xl rounded-full bg-neutral-100 h-12 w-12 flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-lg text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-600 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;