import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const navigation = {
    main: [
      { name: "Cursuri", id: "cursuri" },
      { name: "Tool-uri", id: "tool-uri" },
      { name: "Prețuri", id: "preturi" },
      { name: "Despre", id: "despre" },
    ],
    legal: [
      { name: "Termeni și Condiții", href: "#" },
      { name: "Politica de Confidențialitate", href: "#" },
      { name: "GDPR", href: "#" },
    ],
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
              Finora
            </span>
            <p className="text-sm text-muted-foreground mt-4 max-w-md">
              Educație financiară de top, accesibilă tuturor. De la zero la libertate financiară.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gradient-to-r hover:from-[hsl(var(--aqua))] hover:to-[hsl(var(--minty-green))] hover:text-white transition-all"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gradient-to-r hover:from-[hsl(var(--aqua))] hover:to-[hsl(var(--minty-green))] hover:text-white transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gradient-to-r hover:from-[hsl(var(--aqua))] hover:to-[hsl(var(--minty-green))] hover:text-white transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-gradient-to-r hover:from-[hsl(var(--aqua))] hover:to-[hsl(var(--minty-green))] hover:text-white transition-all"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigare</h4>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm text-muted-foreground hover:text-[hsl(var(--aqua))] transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} />
              <a
                href="mailto:contact@finora.ro"
                className="hover:text-[hsl(var(--aqua))] transition-colors"
              >
                contact@finora.ro
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Finora. Toate drepturile rezervate.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {navigation.legal.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-[hsl(var(--aqua))] transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
