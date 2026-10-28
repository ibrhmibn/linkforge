import { Gamepad2, Link2, Zap, ArrowRight, UserPlus, LogIn } from "lucide-react";
import ArcadeButton from "@/components/ArcadeButton";
import ArcadeCard from "@/components/ArcadeCard";
import HUDBar from "@/components/HUDBar";
import Image from "next/image";

    // mapping themes
const FEATURES = [
  {
    icon: Link2,
    title: "Drag & Drop",
    desc: "Atur urutan link kamu sesuka hati. Cukup klik dan geser, tanpa ngetik kode.",
    accent: "red",
  },
  {
    icon: Gamepad2,
    title: "Arcade Aesthetic",
    desc: "Tampil beda dari yang lain. Desain 8-bit retro yang bikin profil kamu standout.",
    accent: "yellow",
  },
  {
    icon: Zap,
    title: "Super Cepat",
    desc: "Dibangun dengan Next.js. Halaman profil kamu di-load secepat kilat.",
    accent: "white",
  },
];

export default function Home() {
  return (
    <main className="bg-grid-perspective min-h-screen relative overflow-hidden">
      <HUDBar score={1250} hiScore={99999} credits={1} />

      <div className="mx-auto max-w-5xl px-4 pb-24 pt-12 sm:px-6 sm:pt-20 relative z-10">
        
        {/* HERO SECTION */}
        <section className="relative pb-48 text-center pt-10">
          
          <div className="inline-block border-4 border-white bg-arcade-bg px-4 py-2 mb-6 shadow-hard-yellow relative z-30">
            <span className="font-pixel text-xs text-arcade-yellow animate-blink">
              ★ NEW PLAYER DETECTED ★
            </span>
          </div>
          
          <h1 className="text-shadow-hard-red text-4xl text-arcade-yellow sm:text-6xl md:text-7xl leading-tight relative z-30">
            LinkForge
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-2xl text-white sm:text-3xl leading-snug relative z-30">
            Tempa halaman link kamu jadi mesin arcade. Satu koin, satu halaman. Tampil beda dari developer lain.
          </p>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 relative z-30">
            <ArcadeButton variant="red" href="/dashboard" className="text-base sm:text-lg">
              <UserPlus size={20} className="mr-2 inline" /> Start Game
            </ArcadeButton>
            
            <ArcadeButton variant="yellow" href="/login" className="text-base sm:text-lg">
              <LogIn size={20} className="mr-2 inline" /> Login / Register
            </ArcadeButton>
          </div>

          {/* TULISAN SCROLL DOWN */}
          <div className="mt-16 flex flex-col items-center justify-center relative z-30">
            <div className="flex items-center justify-center gap-2 opacity-50 relative z-10">
              <span className="h-px w-16 bg-white"></span>
              <p className="font-pixel text-[10px] text-white">SCROLL DOWN</p>
              <span className="h-px w-16 bg-white"></span>
            </div>
          </div>

          <div className="hidden md:block absolute top-[50px] left-[calc(50%_-_50vw_+_12px)] z-10 pointer-events-none">
            <Image 
              src="/images/luigi.png" 
              alt="Luigi" 
              width={250} 
              height={250} 
              className="w-48 drop-shadow-[6px_6px_0_rgba(0,0,0,0.8)] opacity-90" 
            />
          </div>

          <div className="hidden md:block absolute top-[100px] right-[calc(50%_-_50vw_+_12px)] z-10 pointer-events-none">
            <Image 
              src="/images/mario.png" 
              alt="Mario" 
              width={250} 
              height={250} 
              className="w-48 drop-shadow-[6px_6px_0_rgba(0,0,0,0.8)] opacity-90" 
            />
          </div>

        </section>

        {/* FEATURES SECTION */}
        <section className="mb-24 relative mt-10">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-xl text-arcade-yellow inline-block border-b-4 border-arcade-red pb-2">
              WHY PLAY?
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((feat, idx) => (
              <ArcadeCard key={idx} title={`0${idx + 1} // ${feat.title}`} accent={feat.accent}>
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="p-4 border-4 border-white bg-arcade-bg text-white shadow-hard-red">
                    <feat.icon size={32} />
                  </div>
                  <p className="text-xl leading-relaxed text-gray-300">
                    {feat.desc}
                  </p>
                </div>
              </ArcadeCard>
            ))}
          </div>
        </section>

        {/* CTA SECTION (BOTTOM) */}
        <section className="text-center py-16 border-4 border-white bg-arcade-bg/80 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-arcade-red" />
          
          <h2 className="font-pixel text-2xl text-white mb-6">
            READY TO FORGE?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
            Gratis buat dimainin. Nggak perlu kartu kredit, cukup semangat 45.
          </p>
          
          <ArcadeButton variant="red" href="/dashboard" className="text-lg">
            Insert Coin <ArrowRight size={20} className="ml-2 inline" />
          </ArcadeButton>
          
          <p className="mt-8 font-pixel text-[10px] text-arcade-yellow">
            © {new Date().getFullYear()} LINKFORGE // MADE WITH NEXT.JS
          </p>
        </section>

      </div>
    </main>
  );
}