import {
  ChefHat,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-secondary-300 pt-12 pb-4 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="text-primary-500 w-8 h-8" />
              <span className="text-2xl font-bold font-outfit text-white">
                Dadaba National
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Une passion pour la gastronomie d&apos;exception. Nous
              sélectionnons les meilleurs ingrédients pour vous offrir une
              expérience culinaire inoubliable.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-500 hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold font-outfit text-lg">
              Liens Rapides
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-500 transition-colors"
                >
                  Notre Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="hover:text-primary-500 transition-colors"
                >
                  À Propos
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-primary-500 transition-colors"
                >
                  Mes Commandes
                </Link>
              </li>
              <li>
                <Link
                  href="/recrutements"
                  className="hover:text-primary-500 transition-colors"
                >
                  Recrutements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold font-outfit text-lg">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="text-primary-500 w-5 h-5" />
                <span>Angré, Côte d&apos;Ivoire</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary-500 w-5 h-5" />
                <span>+225 66 66 66 66</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary-500 w-5 h-5" />
                <span>contact@dadabanational.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-secondary-800 flex flex-col md:flex-row justify-center items-center gap-4 text-xs">
          <p>&copy; 2026 Dadaba National. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
