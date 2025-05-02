import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ServiceCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  return (
    <Card className="h-full border rounded-xl transition-all hover:shadow-md hover:border-neutral-300">
      <CardHeader>
        <div className="flex items-center gap-3 text-start">
          {icon && <div className="text-primary rounded p-5 shadow border">{icon}</div>}
          <CardTitle className="text-lg font-semibold text-neutral-900">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
