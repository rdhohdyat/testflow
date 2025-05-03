import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Send } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="container py-20 px-6 bg-neutral-50 rounded-xl"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-neutral-900">
          Contact Us
        </h2>
        <p className=" mb-8 text-neutral-600">
          Have any questions or feedback? We would love to hear from you!
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="text-start">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Your name" 
                  className="mt-1" 
                  required 
                />
              </div>

              <div className="text-start">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="your.email@example.com" 
                  className="mt-1" 
                  required 
                />
              </div>

              <div className="text-start">
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="Your message" 
                  className="mt-1" 
                  rows={5} 
                  required
                ></Textarea>
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                <Send/>
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;
