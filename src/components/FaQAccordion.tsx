import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

type FaQAccordionProps = {
  question: string;
  answer: string;
  index: number;
};

const FaQAccordion = ({ question, answer, index }: FaQAccordionProps) => {
  return (
    <Accordion 
      type="single" 
      collapsible 
      className="border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-sm"
    >
      <AccordionItem value={`item-${index}`} className="border-b-0">
        <AccordionTrigger className="px-4 py-3 text-neutral-900 font-medium hover:bg-neutral-50 hover:no-underline">
          {question}
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 text-neutral-600">
          {answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FaQAccordion;