import Image from 'next/image';

const AboutSection = () => {
  return (
    <section className="py-16 bg-[#f8f5f0]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="order-2 md:order-1 space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Bienvenue chez Coquelicot</h2>
              <p className="text-xl md:text-2xl text-amber-700 italic mb-6">
                L&apos;atelier sucré qui sublime vos envies !
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Chez Coquelicot, je créé des douceurs artisanales pensées pour tous vos plaisirs sucrés, qu&apos;ils soient du quotidien ou des grands moments à célébrer.
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
                  Boîte à revisites : chaque mois, une pâtisserie classique revisitée en 4 déclinaisons, dont une fidèle à l&apos;originale, avec une touche créative et un soupçon d&apos;inspiration gastronomique. Ces boîtes peuvent également se transformer en éditions spéciales, adaptées aux événements de l&apos;année tels que la Chandeleur, la Saint-Valentin, Mardi Gras, Pâques ou la Fête des Mères.....etc, pour une expérience gourmande encore plus festive.
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
                  Mariages, anniversaires, baby showers, gender reveal, événements d&apos;entreprise… Tout peut être personnalisé ! Wedding Cake, Layer Cake, pyramides de choux, plateaux gourmands, et buffet sucré : je réalise vos idées avec style et passion.
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
            </div>

          
          </div>

          <div className="order-1 md:order-2 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Image de pâtisserie</span>
            </div>
            
            <Image
              src="/images/logo_coquelicot.avif"
              alt="Nos créations pâtissières"
              fill
              style={{ objectFit: 'cover' }}
            /> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 