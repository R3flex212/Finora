import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Care sunt diferențele dintre planuri?",
      answer:
        "Planul Start oferă fundamentele: ghid, mini-curs email și 5 lecții video. Smart adaugă module complete 101+201, calculatoare avansate și comunitate activă. Freedom include tot din Smart plus masterclass-uri lunare, simulatoare investiții și suport prioritar.",
    },
    {
      question: "Pot anula abonamentul oricând?",
      answer:
        "Da, poți anula oricând din contul tău. Nu există perioadă minimă de contract sau taxe de anulare. Vei avea acces la conținut până la sfârșitul perioadei pentru care ai plătit.",
    },
    {
      question: "Oferiți rambursări?",
      answer:
        "Da, oferim o garanție de 14 zile. Dacă nu ești mulțumit, poți solicita rambursarea completă a banilor în primele 14 zile de la abonare.",
    },
    {
      question: "Cine sunt autorii cursurilor?",
      answer:
        "Cursurile sunt create de profesioniști cu experiență în educație financiară, planificare bugetară și consultanță. Toate materialele sunt revizuite și actualizate periodic.",
    },
    {
      question: "Este potrivit pentru începători?",
      answer:
        "Absolut! Planul Start este creat special pentru cei care pornesc de la zero. Folosim limbaj simplu, exemple practice și exerciții pas-cu-pas. Nu sunt necesare cunoștințe prealabile.",
    },
    {
      question: "Primesc certificate?",
      answer:
        "Da, în planul Freedom primești certificate de finalizare pentru cursurile completate și insigne de progres care pot fi afișate pe LinkedIn.",
    },
    {
      question: "Cum sunt protejate datele mele?",
      answer:
        "Folosim criptare SSL, respectăm GDPR și nu vindem niciodată datele tale. Toate informațiile financiare pe care le introduci în calculatoare rămân local în browser-ul tău.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Întrebări frecvente
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
