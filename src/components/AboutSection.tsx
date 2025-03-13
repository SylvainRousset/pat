import Image from 'next/image';
import Link from 'next/link';

const AboutSection = () => {
  return (
    <section className="py-16 bg-[#f8f5f0]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="order-2 md:order-1 space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Bienvenue chez Coquelicot</h2>
              <p className="text-xl md:text-2xl text-amber-700 italic mb-6">
                L'atelier sucré qui sublime vos envies !
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Chez Coquelicot, je créé des douceurs artisanales pensées pour tous vos plaisirs sucrés, qu'ils soient du quotidien ou des grands moments à célébrer.
            </p>

            <p className="text-gray-700 leading-relaxed font-medium">
              Voici ce que je propose :
            </p>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
                Les boîtes de saison :
                <span className="text-sm font-normal text-amber-700">(Délai 48h)</span>
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Boîte à choux, boîte à macarons et boîte à flowercakes, composées de 12 pièces aux 4 saveurs de saison. Non modifiables, elles sont idéales pour un plaisir instantané.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Boîte à revisites : chaque mois, une pâtisserie classique revisitée en 4 déclinaisons, dont une fidèle à l'originale, avec une touche créative et un soupçon d'inspiration gastronomique. Ces boîtes peuvent également se transformer en éditions spéciales, adaptées aux événements de l'année tels que la Chandeleur, la Saint-Valentin, Mardi Gras, Pâques ou la Fête des Mères.....etc, pour une expérience gourmande encore plus festive.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">
                Le sur-mesure :
              </h3>
              <div className="space-y-4">
                <p className="text-amber-700 font-medium text-sm mb-2">(Délai minimum 2 semaines)</p>
                <p className="text-gray-700 leading-relaxed">
                  Mariages, anniversaires, baby showers, gender reveal, événements d'entreprise… Tout peut être personnalisé ! Wedding Cake, Layer Cake, pyramides de choux, plateaux gourmands, et buffet sucré : je réalise vos idées avec style et passion.
                </p>
                <p className="text-amber-700 font-medium text-sm mb-2">(Délai 72h)</p>
                <p className="text-gray-700 leading-relaxed">
                  Je propose également un service de pâtisseries sur commande avec un délai plus court de 72h, selon mon agenda. Vous pouvez demander des tartes, charlottes, gros macarons, gros choux ou gros flowercakes. Les tarifs varient en fonction des saveurs et du produits et commencent à partir de 3,50€ la part ou la portion.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200">
              <p className="text-gray-700 leading-relaxed">
                Tout est disponible en ligne, prêt à être dégusté ou commandé pour vos moments précieux. Chez Coquelicot, chaque création raconte une histoire… la vôtre !
              </p>
              <div className="mt-6 text-center md:text-left">
                <Link href="/contact" className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-md transition-colors">
                  Envoyez-nous votre demande
                </Link>
              </div>
            </div>

          
          </div>

          <div className="order-1 md:order-2">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl mb-4">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Image de pâtisserie</span>
              </div>
             
              <Image
                src="/images/profil.avif"
                alt="Nos créations pâtissières"
                fill
                style={{ objectFit: 'cover' }}
              /> 
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-amber-500 ml-auto max-w-[90%]">
              <div className="text-gray-700 font-normal text-sm space-y-2">
                <p className="font-semibold text-amber-700 text-base">Bonjour, je m'appelle Julie Ferioli</p>
                <p>Pâtissière spécialisée dans la restauration gastronomique depuis 15 ans, j'ai eu le privilège de travailler dans des établissements prestigieux de la gastronomie française et de côtoyer de grands chefs étoilés.</p>
                <p>Aujourd'hui, je souhaite partager mon univers avec vous en proposant des créations originales qui éveilleront vos papilles. Chaque dessert que je prépare est le fruit de mes années d'expérience et de ma passion pour la pâtisserie.</p>
                <p>Mon objectif est de vous offrir des saveurs uniques qui reflètent mon savoir-faire et ma vision de la gourmandise.</p>
                <p>Rejoignez-moi dans cette aventure culinaire où l'innovation rencontre la tradition !</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 