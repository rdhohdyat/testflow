import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Send, Mail, MessageSquare } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="container py-20 px-6 bg-neutral-50 dark:bg-neutral-900/10 rounded-xl"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">
            Hubungi Kami
          </h2>
          <p className="mb-8 text-neutral-600 dark:text-neutral-300">
            Punya pertanyaan atau ingin memberikan masukan? Kami senang mendengar dari Anda!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Kirim Pesan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5">
                <div className="text-start">
                  <Label htmlFor="name" className="text-sm font-medium">Nama</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Nama lengkap Anda" 
                    className="mt-1.5" 
                    required 
                  />
                </div>

                <div className="text-start">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative mt-1.5">
                    <Input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="nama@contoh.com" 
                      className="pl-10" 
                      required 
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="text-start">
                  <Label htmlFor="message" className="text-sm font-medium">Pesan</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Apa yang ingin Anda sampaikan?" 
                    className="mt-1.5" 
                    rows={4} 
                    required
                  ></Textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center gap-2 h-11 transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  Kirim Pesan
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        
        <p className="mt-8 text-xs text-neutral-400">
          Pesan Anda akan sangat membantu pengembangan TestFlow ke depannya.
        </p>
      </div>
    </section>
  );
};

export default Contact;