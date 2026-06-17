"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { Coffee, MessageCircle, ShoppingBag, Star, Quote, Image as ImageIcon, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useFeedback } from "@/contexts/FeedbackContext";
import { useMenu } from "@/contexts/MenuContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import heroCafe from "@/assets/hero-cafe.jpg";
import kopiMoodLogo from "@/assets/kopi-mood.png";
import dynamic from 'next/dynamic';
import ParallaxImage from "@/components/ParallaxImage";
import { useScroll, useTransform } from "framer-motion";

const CoffeeSteam = dynamic(() => import('@/components/CoffeeSteam'), { ssr: false });
const WaveBackground = dynamic(() => import('@/components/WaveBackground'), { ssr: false });

const features = [
  { icon: Coffee, title: "Menu Pilihan Premium", desc: "Biji kopi pilihan terbaik yang dipanggang dengan sempurna untuk setiap cangkirnya.", link: "/menu" },
  { icon: MessageCircle, title: "AI Barista Personal", desc: "Konsultasikan mood Anda dan biarkan AI kami meracik minuman yang paling pas.", link: "/chat" },
  { icon: ShoppingBag, title: "Pemesanan Instan", desc: "Tanpa antre panjang. Pesan langsung dari meja atau sebelum Anda tiba.", link: "/menu" },
];

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

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], ["0%", "40%"]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[90dvh] pt-24 pb-12 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCafe.src})`, y: heroY, scale: 1.1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/30 to-primary z-0" />
        
        <CoffeeSteam />
        
        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl mb-5"
          >
            <img src={kopiMoodLogo.src} alt="Kopi Mood Logo" className="w-full h-full object-cover bg-white" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 mb-4 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground px-5 py-2 rounded-full text-sm font-medium backdrop-blur-md shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Harmoni Rasa & Teknologi</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4 leading-tight tracking-tight drop-shadow-md">
            Ceritakan <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300 drop-shadow-sm">Mood</span>-mu,<br /> Kami Racik Kopimu.
          </h1>
          
          <p className="text-base md:text-lg text-primary-foreground/90 mb-8 max-w-2xl font-light drop-shadow-md">
            Lebih dari sekadar kafe. Kopi Mood memadukan keahlian barista dan kecerdasan buatan untuk menemukan minuman yang paling mengerti perasaanmu hari ini.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Button asChild size="lg" className="h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 text-base rounded-full shadow-lg hover:shadow-accent/25 transition-all hover:-translate-y-1">
              <Link href="/chat">
                <MessageCircle className="mr-2 h-5 w-5" /> Curhat ke AI Barista
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-primary-foreground/5 backdrop-blur-sm text-base rounded-full transition-all hover:-translate-y-1">
              <Link href="/menu">
                Eksplor Menu <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <div className="bg-primary text-primary-foreground py-4 overflow-hidden flex whitespace-nowrap border-y border-primary/20 shadow-inner">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex gap-12 font-semibold tracking-widest text-sm uppercase opacity-90"
        >
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              <span>✦ 100% Biji Kopi Premium</span>
              <span>✦ AI Barista Pertama</span>
              <span>✦ Tempat Nugas Nyaman</span>
              <span>✦ Rasa Bintang Lima</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Features - Bento Grid Style */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-primary/5 skew-y-3 transform origin-top-left -z-10" />
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-primary mb-4">Pengalaman Ngopi Berbeda</h2>
            <p className="text-muted-foreground text-lg">Inovasi rasa dan teknologi berpadu untuk memberikan pelayanan terbaik untuk setiap pelanggan kami.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.2, duration: 0.5 }} 
                viewport={{ once: true, margin: "-100px" }}
              >
                <Link href={f.link} className="block group h-full">
                  <div className="bg-card/50 backdrop-blur-sm border border-primary/10 p-8 rounded-3xl hover:bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/5 flex items-center justify-center mb-6 text-accent shadow-inner border border-accent/10"
                    >
                      <f.icon className="h-8 w-8" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-primary mb-3 relative z-10">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed relative z-10 flex-1">{f.desc}</p>
                    <div className="mt-6 flex items-center text-accent font-medium text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      Jelajahi <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-primary mb-4">Favorit Pelanggan</h2>
              <p className="text-muted-foreground text-lg">Pilihan menu yang selalu berhasil mencuri hati. Cobalah sebelum kehabisan!</p>
            </div>
            <Button asChild variant="ghost" className="text-primary hover:bg-primary/10 rounded-full group">
              <Link href="/menu">
                Lihat Semua Menu <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((item, i) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i * 0.15, duration: 0.5 }} 
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="overflow-hidden border border-primary/5 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group bg-card rounded-3xl">
                  <div className="h-64 overflow-hidden bg-white relative p-6 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end justify-center pb-6 pointer-events-none">
                      <Button 
                        onClick={() => { addItem(item); toast.success(`${item.name} ditambahkan ke keranjang`); }} 
                        className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg translate-y-4 group-hover:translate-y-0 transition-all pointer-events-auto"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" /> Pesan Sekarang
                      </Button>
                    </div>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 relative z-0" />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center shadow-inner">
                        <Coffee className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10 flex items-center gap-1 border border-primary/10">
                      <Star className="w-3 h-3 text-accent fill-accent" /> Bestseller
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1 bg-gradient-to-b from-card to-card/95">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-bold text-xl text-primary">{item.name}</h3>
                      <p className="font-bold text-accent text-lg whitespace-nowrap">Rp {item.price.toLocaleString("id-ID")}</p>
                    </div>
                    <p className="text-muted-foreground mb-6 line-clamp-2 flex-1">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner - Redesigned to full width */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent z-0" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl text-primary-foreground"
          >
            <div className="inline-flex items-center gap-2 mb-4 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
              Penawaran Terbatas
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Happy Hour! <br/> <span className="text-accent">Diskon 20%</span> Semua Varian Kopi.
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-md">
              Manjakan dirimu dengan racikan kopi premium kami setiap hari pukul 15.00 – 17.00. Waktu santai jadi lebih nikmat.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full h-14 px-8 text-base shadow-xl">
              <Link href="/menu">Klaim Promo Sekarang</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Gallery - Masonry-ish style */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Sudut Kopi Mood</h2>
            <p className="text-muted-foreground text-lg">Tempat yang dirancang untuk kenyamanan, estetika, dan momen tak terlupakan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group aspect-[4/3] md:aspect-auto"
            >
              <ParallaxImage src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80" alt="Cafe Interior" speed={0.1} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <p className="text-white font-medium text-lg">Suasana hangat untuk setiap perbincangan.</p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}
              className="rounded-3xl overflow-hidden relative group aspect-square"
            >
              <ParallaxImage src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" alt="Coffee Pour" speed={0.15} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}
              className="rounded-3xl overflow-hidden relative group aspect-square"
            >
              <ParallaxImage src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=500&q=80" alt="Barista" speed={0.15} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </motion.div>
  );
}
