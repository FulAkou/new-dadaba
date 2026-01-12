import { ChefHat, Heart, Star, Utensils } from "lucide-react";
import Image from "next/image";

export default function page() {
  return (
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-1" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-bold text-sm mb-8">
              <Star className="w-4 h-4 fill-primary" />
              <span>Notre Histoire</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Passionnés par le{" "}
              <span className="text-primary italic">Goût</span>, <br />
              Dévoués à la <span className="text-primary italic">Qualité</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Dadaba National est né d'une idée simple : rassembler les
              meilleurs chefs de bonne cuisine autour d'une expérience
              gastronomique inoubliable.
            </p>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Créer des plats et des boissons authentiques qui capturent
              l'esprit de notre culture tout en s'adaptant aux goûts modernes.
            </p>
          </div>
        </section>

        {/* Image Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="relative rounded-[40px] overflow-hidden shadow-2xl h-[400px] md:h-[600px]">
            <Image
              src="/equipe-cuisine.webp"
              alt=""
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:p-16">
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-2">Une équipe unie</h3>
                <p className="text-lg opacity-90">
                  Pour vous servir le meilleur chaque jour.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                  <Utensils className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  Qualité Premium
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Nous sélectionnons rigoureusement nos ingrédients auprès de
                  producteurs locaux passionnés pour garantir une fraîcheur
                  absolue.
                </p>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <ChefHat className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  Savoir-faire
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Nos chefs talentueux mettent tout leur cœur et leur expertise
                  pour transformer chaque plat en une œuvre d'art culinaire.
                </p>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  Passion
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Plus qu'un métier, la cuisine est notre passion. Nous aimons
                  partager, découvrir et innover pour votre plus grand plaisir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {/* <section className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-slate-900">2018</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fondation</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-slate-900">50k+</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Clients Heureux</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-slate-900">100+</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Partenaires</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black text-slate-900">15</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pays Représentés</div>
            </div>
          </div>
        </div>
      </section> */}
      </div>
    </div>
  );
}
