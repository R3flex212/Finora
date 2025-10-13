import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonials';

const testimonials = [
  {
    name: 'Ana-Maria Popescu',
    username: '@anamaria',
    body: 'Am ieșit din roșu în 3 luni folosind metodele din demo!',
    img: 'https://randomuser.me/api/portraits/women/32.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Radu Ionescu',
    username: '@raduion',
    body: 'Template-urile Excel sunt exact ce îmi trebuia.',
    img: 'https://randomuser.me/api/portraits/men/68.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Maria Constantin',
    username: '@mariacon',
    body: 'Calculatorul de buget m-a ajutat să economisesc 2000€.',
    img: 'https://randomuser.me/api/portraits/women/51.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Andrei Popa',
    username: '@andreip',
    body: 'Comunitatea e super activă și prietenoasă!',
    img: 'https://randomuser.me/api/portraits/men/53.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Elena Dumitrescu',
    username: '@elenad',
    body: 'Știu acum exact unde îmi merg banii lunar.',
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Mihai Stanciu',
    username: '@mihais',
    body: 'Demo-ul m-a convins instant. Tool-uri profesionale!',
    img: 'https://randomuser.me/api/portraits/men/22.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Diana Georgescu',
    username: '@dianag',
    body: 'Am reușit să consolidez toate creditele eficient.',
    img: 'https://randomuser.me/api/portraits/women/85.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Cristian Marin',
    username: '@cristianm',
    body: 'Cursurile video sunt clare și direct la subiect.',
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    country: '🇷🇴 România',
  },
  {
    name: 'Ioana Vasile',
    username: '@ioanav',
    body: 'Cea mai bună platformă de educație financiară!',
    img: 'https://randomuser.me/api/portraits/women/61.jpg',
    country: '🇷🇴 România',
  },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-80">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
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

const Testimonials = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce spun utilizatorii
          </h2>
          <p className="text-sm text-muted-foreground">
            Persoane reale care au testat platforma în perioada beta
          </p>
        </div>

        <div className="flex justify-center">
          <div className="border border-border rounded-lg relative flex h-96 w-full max-w-[800px] flex-row items-center justify-center overflow-hidden gap-1.5 [perspective:300px]">
            <div
              className="flex flex-row items-center gap-4"
              style={{
                transform:
                  'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
              }}
            >
              {/* Vertical Marquee (downwards) */}
              <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              {/* Vertical Marquee (upwards) */}
              <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              {/* Vertical Marquee (downwards) */}
              <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              {/* Vertical Marquee (upwards) */}
              <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
                {testimonials.map((review) => (
                  <TestimonialCard key={review.username} {...review} />
                ))}
              </Marquee>
              {/* Gradient overlays for vertical marquee */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;