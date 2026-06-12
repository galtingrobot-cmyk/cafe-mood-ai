"use client";

import Link from "next/link";
import { Coffee, MessageCircle, ShoppingBag, Send, Star, Quote, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import { useState, useRef } from "react";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useMenu } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import heroCafe from "@/assets/hero-cafe.jpg";
import kopiMoodLogo from "@/assets/kopi-mood.png";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/MagneticButton";
import WaveBackground from "@/components/WaveBackground";

const CoffeeSteam = dynamic(() => import("@/components/CoffeeSteam"), { ssr: false });

// ─── Framer Motion Variants ──────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.6 } },
};

// ─── Marquee (smooth infinite) ───────────────────────────────────────────────
function Marquee() {
  const text = "✦ 100% BIJI KOPI PILIHAN ✦ REKOMENDASI AI BARISTA ✦ TEMPAT NONGKRONG TERBAIK ✦ RACIKAN PENUH CINTA ";
  const items = Array(8).fill(text);

  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden flex whitespace-nowrap">
      <motion.div
        className="flex gap-0 font-medium tracking-wider text-sm shrink-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 28 }}
        onHoverStart={(e) => {
          const el = e.target as HTMLElement;
          el.style.animationPlayState = "paused";
        }}
      >
        {items.map((t, i) => (
          <span key={i} className="pr-0">{t}</span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Feedback Form ────────────────────────────────────────────────────────────
function FeedbackForm() {
  const { addFeedback } = useFeedback();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!message.trim()) { toast.error("Pesan saran tidak boleh kosong"); return; }
    addFeedback(name, message);
    setName(""); setMessage("");
    toast.success("Terima kasih atas saranmu! 🙏");
  };

  return (
    <Card className="p-6 bg-secondary/40 border-accent/20">
      <h3 className="text-xl font-bold text-primary mb-1 text-center">💌 Saran untuk Kami</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">Bantu kami jadi lebih baik!</p>
      <div className="space-y-3">
        <Input placeholder="Nama (opsional)" value={name} onChange={e => setName(e.target.value)} />
        <Textarea placeholder="Tulis saran atau masukanmu di sini..." value={message} onChange={e => setMessage(e.target.value)} rows={3} />
        <MagneticButton className="w-full">
          <Button onClick={submit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Send className="h-4 w-4 mr-2" /> Kirim Saran
          </Button>
        </MagneticButton>
      </div>
    </Card>
  );
}

const features = [
  { icon: Coffee, title: "Menu Pilihan", desc: "Koleksi kopi, minuman, dan camilan terbaik kami", link: "/menu" },
  { icon: MessageCircle, title: "AI Barista", desc: "Ceritakan mood-mu, kami rekomendasikan minuman yang pas", link: "/chat" },
  { icon: ShoppingBag, title: "Order Mudah", desc: "Pilih, pesan, dan nikmati — semudah itu", link: "/menu" },
];

// ─── Parallax Gallery Item ────────────────────────────────────────────────────
function ParallaxGalleryItem({ src, index }: { src: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Each column gets different speed for depth effect
  const speeds = [0.12, -0.08, 0.15, -0.10];
  const y = useTransform(scrollYProgress, [0, 1], [`${speeds[index] * -120}px`, `${speeds[index] * 120}px`]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="aspect-square rounded-2xl overflow-hidden group relative shadow-sm"
    >
      <motion.img
        src={src}
        alt={`Gallery ${index}`}
        style={{ y }}
        className="w-full h-[120%] object-cover group-hover:scale-105 transition-transform duration-700 -mt-[10%]"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ImageIcon className="text-white h-8 w-8" />
      </div>
    </motion.div>
  );
}

// ─── Hero Parallax Background ─────────────────────────────────────────────────
function HeroParallaxBg({ src }: { src: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], ["0%", "25%"]);

  return (
    <motion.div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${src})`, y }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Index() {
  const { feedbacks } = useFeedback();
  const { menuItems } = useMenu();
  const { addItem } = useCart();

  const bestSellers = menuItems.slice(0, 3);

  const displayFeedbacks = feedbacks.length >= 3 ? feedbacks.slice(0, 3) : [
    { id: "1", name: "Budi Santoso", message: "Rekomendasi matcha-nya pas banget buat nugas! Vibesnya juga dapet.", date: new Date().toISOString() },
    { id: "2", name: "Siti Aminah", message: "Kopi susu gula aren terbaik yang pernah saya coba. AI baristanya sangat membantu!", date: new Date().toISOString() },
    { id: "3", name: "Andi Wijaya", message: "Sangat inovatif. Bisa curhat sama AI dan dikasih rekomendasi minuman yang cocok.", date: new Date().toISOString() },
    ...feedbacks
  ].slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative flex items-center justify-center min-h-[80dvh] overflow-hidden">
        <HeroParallaxBg src={heroCafe.src} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-background/90" />

        {/* WebGL Steam Particles */}
        <CoffeeSteam />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center px-4 max-w-2xl z-20"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full flex items-center justify-center"
            >
              <img src={kopiMoodLogo.src} alt="Kopi Mood Logo" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-2 mb-4 bg-accent/90 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium backdrop-blur">
            ☕ Selamat datang di Kopi Mood
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight font-serif drop-shadow-lg">
            Minuman Sempurna untuk Setiap <span className="text-accent">Mood</span>-mu
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-lg mx-auto drop-shadow">
            Biarkan AI Barista kami merekomendasikan minuman yang pas dengan perasaanmu hari ini.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <MagneticButton>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
                <Link href="/menu">📋 Lihat Menu</Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8">
                <Link href="/chat">💬 Rekomendasi</Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Promo Banner ── */}
      <section className="px-4 mt-8 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-gradient-to-r from-accent to-primary text-primary-foreground p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center gap-4 md:gap-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl"
            >🎉</motion.div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-1">Promo Happy Hour!</h3>
              <p className="text-sm md:text-base opacity-90">Setiap jam 15.00–17.00 — Diskon 20% untuk semua kopi ☕</p>
            </div>
            <MagneticButton>
              <Button asChild variant="secondary" size="lg" className="shrink-0">
                <Link href="/menu">Pesan Sekarang</Link>
              </Button>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ── Best Sellers — staggered variants ── */}
      <section className="py-16 px-4 bg-secondary/30 mt-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-primary mb-3">Menu Terfavorit</h2>
            <p className="text-muted-foreground">Pilihan terbaik yang selalu habis dipesan</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {bestSellers.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Card className="overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group border-primary/10">
                  <div className="h-48 overflow-hidden bg-white relative p-4">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <Coffee className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">⭐ Bestseller</div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg text-primary mb-1">{item.name}</h3>
                    <p className="font-bold text-accent mb-3">Rp {item.price.toLocaleString("id-ID")}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{item.description}</p>
                    <MagneticButton className="w-full" strength={0.15}>
                      <Button
                        onClick={() => { addItem(item); toast.success(`${item.name} ditambahkan ke keranjang`); }}
                        className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Pesan Sekarang
                      </Button>
                    </MagneticButton>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <MagneticButton>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary/20 hover:bg-primary/5 text-primary">
                <Link href="/menu">Lihat Semua Menu</Link>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── Features — staggered ── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-primary mb-12"
          >
            Kenapa Kopi Mood?
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-4 sm:gap-8"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link href={f.link} className="block p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow text-center group">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/25 transition-colors"
                  >
                    <f.icon className="h-7 w-7 text-accent" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Gallery — parallax per column ── */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-primary mb-3">Suasana Kopi Mood</h2>
            <p className="text-muted-foreground">Estetika di setiap sudut kafe kami 📸</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {[
              "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80",
              "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80",
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80",
              "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=500&q=80",
            ].map((img, i) => (
              <ParallaxGalleryItem key={i} src={img} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials — WebGL wave background ── */}
      <section className="py-16 px-4 mb-16 relative overflow-hidden">
        {/* WebGL animated gradient replaces the old solid bg */}
        <WaveBackground />

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-3 text-primary-foreground">Apa Kata Mereka?</h2>
            <p className="text-primary-foreground/80">Cerita pelanggan bersama Kopi Mood</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-4 sm:gap-6"
          >
            {displayFeedbacks.map((fb, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="bg-white/10 border-none text-primary-foreground h-full backdrop-blur-sm">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Quote className="h-8 w-8 text-accent mb-4 opacity-50" />
                    <p className="mb-6 flex-1 text-primary-foreground/90 leading-relaxed">"{fb.message}"</p>
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg"
                      >
                        {fb.name ? fb.name.charAt(0).toUpperCase() : "A"}
                      </motion.div>
                      <div>
                        <p className="font-semibold">{fb.name || "Anonim"}</p>
                        <div className="flex text-accent text-xs mt-1">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Feedback ── */}
      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-xl">
          <FeedbackForm />
        </div>
      </section>

    </motion.div>
  );
}
