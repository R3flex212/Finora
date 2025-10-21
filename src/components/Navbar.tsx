import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Home, DollarSign, Info, User, LogOut, Settings, BookOpen } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import finoraLogo from "@/assets/finora-logo.png";

const Navbar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (sectionId: string, path?: string) => {
    if (isHomePage) {
      // Pe homepage, scroll direct la secțiune
      scrollToSection(sectionId);
    } else {
      // Pe alte pagini, navigăm la homepage sau la pagina specificată, apoi scroll
      if (path) {
        navigate(path);
      } else {
        navigate("/");
        setTimeout(() => scrollToSection(sectionId), 100);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { 
      name: "Cursuri", 
      onClick: () => handleNavigation("cursuri", isHomePage ? undefined : "/courses"),
      icon: Home,
      isActive: location.pathname === "/courses" || (isHomePage && location.hash === "#cursuri")
    },
    { 
      name: "Prețuri", 
      onClick: () => handleNavigation("preturi"),
      icon: DollarSign,
      isActive: isHomePage && location.hash === "#preturi"
    },
    { 
      name: "Despre", 
      onClick: () => handleNavigation("despre"),
      icon: Info,
      isActive: isHomePage && location.hash === "#despre"
    },
    ...(user ? [{
      name: "Lista Cursuri",
      onClick: () => navigate("/courses"),
      icon: BookOpen,
      isActive: location.pathname === "/courses"
    }] : [])
  ];

  const logo = (
    <button 
      onClick={() => navigate("/")}
      className="hover:opacity-80 transition-opacity cursor-pointer flex items-center"
    >
      <img src={finoraLogo} alt="Finora" className="h-16 w-16" />
    </button>
  );

  const rightButtons = user ? (
    <>
      {isAdmin && (
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="text-foreground hover:bg-[hsl(var(--minty-green))]/10 px-5 py-2.5 text-sm rounded-full font-medium w-full md:w-auto justify-center"
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin
        </Button>
      )}
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