"use client";
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { FooterBackgroundGradient } from "@/components/ui/hover-footer";
import { TextHoverEffect } from "@/components/ui/hover-footer";

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

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#3ca2fa]" />,
      text: "contact@finora.ro",
      href: "mailto:contact@finora.ro",
    },
    {
      icon: <Phone size={18} className="text-[#3ca2fa]" />,
      text: "+40 123 456 789",
      href: "tel:+40123456789",
    },
    {
      icon: <MapPin size={18} className="text-[#3ca2fa]" />,
      text: "București, România",
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "#" },
  ];

  return (
    <footer className="bg-[#0F0F11]/10 relative h-fit overflow-hidden">
      <div className="max-w-7xl mx-auto p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[#3ca2fa] text-3xl font-extrabold">
                &hearts;
              </span>
              <span className="text-white text-3xl font-bold">Finora</span>
            </div>
            <p className="text-sm leading-relaxed">
              Educație financiară de top, accesibilă tuturor. De la zero la libertate financiară.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Navigare
            </h4>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="hover:text-[#3ca2fa] transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name} className="relative">
                  <a
                    href={item.href}
                    className="hover:text-[#3ca2fa] transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-[#3ca2fa] transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-[#3ca2fa] transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Copyright section */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">
              Social
            </h4>
            <div className="flex space-x-4 text-gray-400 mb-6">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="hover:text-[#3ca2fa] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Finora. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36">
        <TextHoverEffect text="FINORA" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
};

export default Footer;
