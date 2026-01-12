import FeaturedDishes from "@/components/dishes/FeaturedDishes";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen hero-gradient overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold tracking-wide">
              LE MEILLEUR DE LA VIANDE
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-outfit text-secondary-900 leading-tight">
              Savourez l&apos;excellence <br />
              <span className="text-primary-500">à chaque bouchée</span>
            </h1>
            <p className="text-lg text-secondary-600 max-w-xl mx-auto lg:mx-0">
              Découvrez une sélection unique de plats de viande préparés par les
              meilleurs chefs. Une expérience gastronomique livrée directement
              chez vous.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/">
                <Button size="lg" className="w-full sm:w-auto">
                  Découvrir le Menu
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Rejoindre l&apos;aventure
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 relative animate-fade-in delay-200">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Simple illustrative placeholder for dish */}
              <div className="absolute inset-0 bg-primary-500 rounded-3xl rotate-6 -z-10" />
              <div className="w-full h-full bg-secondary-100 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white">
                <Image
                  src="/photo-hero.avif"
                  alt="Featured Dish"
                  width={800}
                  height={500}
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-xl flex items-center gap-3 shadow-primary-500/20">
                <div className="bg-primary-500 p-2 rounded-lg text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-secondary-500 font-medium">
                    Qualité Premium
                  </p>
                  <p className="text-sm font-bold text-secondary-900">
                    100% Frais
                  </p>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse shadow-accent-500/20">
                <div className="bg-accent-500 p-2 rounded-lg text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-secondary-500 font-medium">
                    Livraison Rapide
                  </p>
                  <p className="text-sm font-bold text-secondary-900">
                    En 30 Mins
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <FeaturedDishes />

      {/* Social Proof */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex justify-center items-center text-xl font-bold font-outfit">
              FOODIES
            </div>
            <div className="flex justify-center items-center text-xl font-bold font-outfit">
              GOURMET
            </div>
            <div className="flex justify-center items-center text-xl font-bold font-outfit">
              CATERING
            </div>
            <div className="flex justify-center items-center text-xl font-bold font-outfit">
              CHEF-LIFE
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-secondary-50 py-24 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-secondary-900 leading-tight">
              Rejoignez la{" "}
              <span className="text-primary italic">communauté</span> des
              gourmets
            </h2>
            <p className="text-secondary-900 text-lg font-medium leading-relaxed">
              Plus de 12 000 passionnés de cuisine nous font confiance chaque
              année pour découvrir des saveurs uniques et inoubliables.
            </p>
            <div className="flex justify-center space-x-12">
              <div className="text-center">
                <div className="text-4xl font-black text-secondary-900">
                  4.9/5
                </div>
                <div className="text-sm font-bold text-secondary-500 uppercase mt-2">
                  Note Clients
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-secondary-900">
                  100%
                </div>
                <div className="text-sm font-bold text-secondary-500 uppercase mt-2">
                  Fait Maison
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
