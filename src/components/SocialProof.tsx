import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonials';

const testimonials = [
  {
    name: 'Andrei Popescu',
    username: '@andreipop',
    body: 'Am ieșit din roșu în 3 luni cu instrumentele Finora!',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Maria Ionescu',
    username: '@maria_io',
    body: 'Știu acum exact unde îmi merg banii. Schimbare imensă!',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Vlad Constantin',
    username: '@vlad_c',
    body: 'Template-urile m-au ajutat să economisesc 500€ lunar.',
    img: 'https://randomuser.me/api/portraits/men/51.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Elena Dumitrescu',
    username: '@elena_d',
    body: 'Comunitatea e super activă și m-a ajutat enorm!',
    img: 'https://randomuser.me/api/portraits/women/53.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Mihai Radu',
    username: '@mihai_r',
    body: 'Cursurile sunt clare și foarte practice pentru România.',
    img: 'https://randomuser.me/api/portraits/men/33.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Alexandra Stan',
    username: '@alexa_s',
    body: 'Am început să investesc cu încredere după Finora.',
    img: 'https://randomuser.me/api/portraits/women/22.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Cristian Munteanu',
    username: '@cris_m',
    body: 'Platform perfectă pentru libertate financiară în Romania!',
    img: 'https://randomuser.me/api/portraits/men/85.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Ioana Popa',
    username: '@ioana_p',
    body: 'Tool-urile de buget mi-au schimbat viața financiară!',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Dan Georgescu',
    username: '@dan_geo',
    body: 'Comunitate activă, cursuri practice, rezultate reale!',
    img: 'https://randomuser.me/api/portraits/men/61.jpg',
    country: '🇷🇴 România',
  },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-foreground">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

const SocialProof = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ce spun utilizatorii
          </h2>
          <p className="text-muted-foreground">
            Testatori beta din România care au experimentat Finora înainte de lansare
          </p>
        </div>

        <div className="flex justify-center">
          <div className="border border-border rounded-lg relative flex h-96 w-full max-w-[800px] overflow-hidden gap-1.5 [perspective:300px]">
            <div
              className="flex flex-row items-center gap-4"
              style={{
                transform:
                  'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
              }}
            >
              <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-muted/30"></div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-muted/30"></div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-muted/30"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-muted/30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;