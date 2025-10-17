import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, Package, DollarSign, Info, User, LogOut } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { 
      name: "Cursuri", 
      onClick: () => scrollToSection("cursuri"),
      icon: Home
    },
    { 
      name: "Tool-uri", 
      onClick: () => scrollToSection("tool-uri"),
      icon: Package
    },
    { 
      name: "Prețuri", 
      onClick: () => scrollToSection("preturi"),
      icon: DollarSign
    },
    { 
      name: "Despre", 
      onClick: () => scrollToSection("despre"),
      icon: Info
    },
  ];

  const logo = (
    <span className="text-lg font-bold bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent whitespace-nowrap">
      Finora
    </span>
  );

  const rightButtons = user ? (
    <>
      <Button
        variant="ghost"
        onClick={() => navigate("/profile")}
        className="text-foreground hover:bg-[hsl(var(--aqua))]/10 px-5 py-2.5 text-sm rounded-full font-medium w-full md:w-auto justify-center"
      >
        <User className="w-4 h-4 mr-2" />
        Profil
      </Button>
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="text-foreground hover:bg-destructive/10 hover:text-destructive px-5 py-2.5 text-sm rounded-full font-medium w-full md:w-auto justify-center"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </>
  ) : (
    <>
      <Button
        variant="ghost"
        onClick={() => navigate("/auth")}
        className="text-foreground hover:bg-[hsl(var(--aqua))]/10 px-5 py-2.5 text-sm rounded-full font-medium w-full md:w-auto justify-center"
      >
        Login
      </Button>
      <Button
        className="bg-gradient-to-r from-[hsl(var(--minty-green))] to-[hsl(var(--aqua))] hover:opacity-90 text-white font-semibold rounded-full px-5 py-2.5 text-sm shadow-glow transition-opacity w-full md:w-auto justify-center"
        onClick={() => navigate("/auth")}
      >
        Crează cont
      </Button>
    </>
  );

  return (
    <>
      <NavBar 
        items={navItems}
        logo={logo}
        rightButtons={rightButtons}
      />
      {/* Spacer to prevent content from going under navbar */}
      <div className="h-[120px] lg:h-[68px]" />
    </>
  );
};

export default Navbar;