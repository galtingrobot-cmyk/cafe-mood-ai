"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";;
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Coffee, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();

  useEffect(() => {
    // Check if already logged in via Supabase Auth
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate.push("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Silakan masukkan email dan password");
      return;
    }

    try {
      setLoading(true);

      // Gunakan Supabase Auth (lebih aman!)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        toast.error("Gagal login. Periksa kembali email & password Anda.");
        return;
      }

      toast.success("Berhasil login ke portal admin");
      navigate.push("/admin");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan yang tidak terduga");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen flex items-center justify-center bg-background/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />

      <Card className="w-full max-w-md shadow-2xl border-primary/20 backdrop-blur-sm bg-card/90 relative z-10">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-serif font-bold text-primary">Portal Admin</CardTitle>
          <CardDescription className="text-base">
            Kawasan terbatas. Silakan masuk untuk mengelola Kopi Mood.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kopimood.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            </Button>
          </form>

          <div className="mt-8 text-center flex items-center justify-center text-sm text-muted-foreground gap-2">
            <Coffee className="w-4 h-4" />
            <span>Kopi Mood Internal System</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </>
  );
}
