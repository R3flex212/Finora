"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X, User as UserIcon, LogOut, Settings, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import finoraLogo from "@/assets/finora-logo-new.png";

function Header1() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  // Scroll behavior
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY < 50) {
          // Always show at top
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (sectionId: string, path?: string) => {
    setOpen(false);
    if (isHomePage) {
      scrollToSection(sectionId);
    } else {
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
    setOpen(false);
  };

  const navigationItems = [
    {
      title: "Cursuri",
      onClick: () => handleNavigation("cursuri", isHomePage ? undefined : "/courses"),
    },
    {
      title: "Prețuri",
      onClick: () => handleNavigation("preturi"),
    },
    {
      title: "Despre",
      onClick: () => handleNavigation("despre"),
    },
    ...(user ? [{
      title: "Lista Cursuri",
      onClick: () => {
        navigate("/courses");
        setOpen(false);
      },
    }] : []),
  ];

  return (
    <header 
      className={`w-full z-[5000] fixed left-0 bg-background/95 backdrop-blur-md border-b border-border/20 transition-all duration-300 ${
        isVisible ? 'top-0' : '-top-24'
      }`}
    >
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-[200px_1fr_auto] items-center px-4">
        <div className="flex justify-start items-center">
          <button 
            onClick={() => navigate("/")}
            className="hover:opacity-80 transition-opacity cursor-pointer flex items-center"
          >
            <img src={finoraLogo} alt="Finora" className="h-12 w-auto lg:h-16" />
          </button>
        </div>
        
        <div className="justify-center items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-center items-center">
            <NavigationMenuList className="flex justify-center gap-4 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <button onClick={item.onClick}>
                    <Button 
                      variant="ghost" 
                      className="text-foreground hover:bg-[hsl(var(--aqua))]/10 transition-all font-medium"
                    >
                      {item.title}
                    </Button>
                  </button>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="hidden lg:flex justify-end w-full gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/admin")}
                  className="text-foreground hover:bg-[hsl(var(--minty-green))]/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => navigate("/profile")}
                className="text-foreground hover:bg-[hsl(var(--aqua))]/10"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Profil
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
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
                className="text-foreground hover:bg-[hsl(var(--aqua))]/10"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white hover:opacity-90 transition-opacity"
              >
                Creează cont gratuit
              </Button>
            </>
          )}
        </div>
        
        <div className="flex w-12 shrink lg:hidden items-end justify-end ml-auto">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background/98 backdrop-blur-lg shadow-lg py-4 container gap-4 z-[5001]">
              {navigationItems.map((item) => (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  className="flex justify-between items-center hover:bg-[hsl(var(--aqua))]/10 px-4 py-3 rounded-lg transition-all text-left"
                >
                  <span className="text-foreground font-medium">{item.title}</span>
                  <MoveRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
              
              <div className="border-t border-border/20 pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/admin");
                          setOpen(false);
                        }}
                        className="w-full justify-start text-foreground hover:bg-[hsl(var(--minty-green))]/10"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="w-full justify-start text-foreground hover:bg-[hsl(var(--aqua))]/10"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Profil
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full justify-start border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigate("/auth");
                        setOpen(false);
                      }}
                      className="w-full justify-start text-foreground hover:bg-[hsl(var(--aqua))]/10"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate("/auth");
                        setOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white hover:opacity-90 transition-opacity"
                    >
                      Creează cont gratuit
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header1 };
