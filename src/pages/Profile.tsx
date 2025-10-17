import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Award, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProfileProps {
  user: User;
}

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

const Profile = ({ user }: ProfileProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [user.id]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut deconecta. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deconectat",
        description: "Te-ai deconectat cu succes din Finora.",
      });
      navigate("/");
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-glow border-[hsl(var(--aqua))]/20">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <Avatar className="w-24 h-24 border-4 border-[hsl(var(--aqua))]/20">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] text-white">
                    {getInitials(profile?.full_name || null, user.email || "")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--aqua))] to-[hsl(var(--minty-green))] bg-clip-text text-transparent">
                {profile?.full_name || "Utilizator Finora"}
              </CardTitle>
              <CardDescription className="text-base">
                Membru al comunității Finora
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="p-3 rounded-full bg-[hsl(var(--aqua))]/10">
                    <Mail className="w-5 h-5 text-[hsl(var(--aqua))]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="p-3 rounded-full bg-[hsl(var(--minty-green))]/10">
                    <Calendar className="w-5 h-5 text-[hsl(var(--minty-green))]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membru din</p>
                    <p className="font-medium">
                      {profile?.created_at ? formatDate(profile.created_at) : "..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-r from-[hsl(var(--aqua))]/10 to-[hsl(var(--minty-green))]/10 border border-[hsl(var(--aqua))]/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-[hsl(var(--aqua))]/20">
                    <Award className="w-6 h-6 text-[hsl(var(--aqua))]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      Progresul Tău
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Începe primul tău curs pentru a debloca badge-uri și a-ți urmări progresul.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        🎯 Începător
                      </Badge>
                      <Badge variant="outline" className="text-xs opacity-50">
                        🏆 Investitor Activ
                      </Badge>
                      <Badge variant="outline" className="text-xs opacity-50">
                        💎 Expert Finora
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Deconectează-te
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Ai nevoie de ajutor?{" "}
              <a href="#" className="text-[hsl(var(--aqua))] hover:underline font-medium">
                Contactează suportul
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
