'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function APropos() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f1e9dc] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Titre principal */}
          <h1 className="text-3xl md:text-5xl font-bold text-center text-[#421500] mb-4 md:mb-6">
            La délicatesse du Coquelicot, la force d&apos;une idée
          </h1>

          {/* Mon Ambition */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#a75120] mb-8">
              Mon Ambition
            </h2>

            <div className="bg-[#f8f3eb] rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#a75120]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Texte à gauche */}
                <div className="space-y-4 text-[#421500]/85 leading-relaxed">
                  <p className="text-base md:text-lg">
                    Bienvenue chez <span className="font-semibold text-[#a75120]">Coquelicot</span>, où la passion pour la pâtisserie rencontre l&apos;art de célébrer les moments précieux de votre vie avec des créations sur mesure, mais pas que.
                  </p>

                  <p className="text-base md:text-lg">
                    Dans un monde où la pâtisserie évolue constamment, j&apos;aimerais fusionner le <span className="font-semibold text-[#a75120]">savoir-faire des pâtissiers restaurateurs</span> avec les techniques raffinées des boutiques de pâtisserie, tout en y intégrant l&apos;art sous forme de peinture et de dessin. Chaque création devient ainsi une pièce unique, conçue pour allier beauté et plaisir, afin de ravir le plus grand nombre d&apos;entre vous. Imaginez des desserts qui, non seulement émerveillent par leur goût, mais aussi par leur présentation délicate, alliant tradition et innovation.
                  </p>

                  <p className="text-base md:text-lg">
                    Chaque création sera inspirée par la <span className="font-semibold text-[#a75120]">délicatesse du coquelicot</span>, symbolisant la délicatesse et la beauté éphémère.
                  </p>

                  <p className="text-base md:text-lg">
                    Cela permettrait ainsi de créer une <span className="font-semibold text-[#a75120]">expérience culinaire holistique</span>, où chaque bouchée raconte une histoire et où chaque pâtisserie est une œuvre d&apos;art.
                  </p>
                </div>

                {/* Image à droite */}
                <div className="order-first md:order-last">
                  <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/images/apropofleur.avif"
                      alt="Délicatesse florale"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coquelicot c'est qui... */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#421500] mb-8">
              Coquelicot c&apos;est qui...
            </h2>

            <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#a75120]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Texte à gauche */}
                <div className="space-y-4 text-[#421500]/85 leading-relaxed">
                  <p className="text-base md:text-lg">
                    <span className="font-semibold text-[#a75120]">Bonjour, je m&apos;appelle Julie Ferioli</span> et je suis pâtissière spécialisée dans la restauration gastronomique depuis 18 ans.
                  </p>

                  <p className="text-base md:text-lg">
                    Au cours de ma carrière, j&apos;ai eu le privilège de travailler dans des <span className="font-semibold text-[#a75120]">établissements prestigieux</span> de la gastronomie française et de côtoyer de grands chefs étoilés.
                  </p>

                  <p className="text-base md:text-lg">
                    Aujourd&apos;hui, je souhaite partager mon univers avec vous en proposant des <span className="font-semibold text-[#a75120]">créations originales</span> qui éveilleront vos papilles. Chaque dessert que je prépare est le fruit de mes années d&apos;expérience et de ma passion pour la pâtisserie.
                  </p>

                  <p className="text-base md:text-lg">
                    Mon objectif est de vous offrir des <span className="font-semibold text-[#a75120]">saveurs uniques</span> qui reflètent mon savoir-faire et ma vision de la gourmandise.
                  </p>

                  <p className="text-base md:text-lg">
                    Rejoignez-moi dans cette aventure culinaire où l&apos;innovation rencontre la tradition, et laissez-vous séduire par des douceurs à la fois délicates et audacieuses.
                  </p>
                </div>

                {/* Image à droite */}
                <div>
                  <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/images/profil.avif"
                      alt="Julie Ferioli"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Les Services */}
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#a75120]/20 mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#421500] mb-4">
              Les Services
            </h2>
            <p className="text-center text-[#421500]/85 mb-8">
              Découvrez les créations sur mesure pour tous vos événements, des gâteaux aux mignardises sucrées.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Gâteaux Sur Mesure */}
              <div className="text-center">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg mb-4">
                  <Image
                    src="/images/surmesure2.avif"
                    alt="Gâteaux Sur Mesure"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-[#a75120] mb-2">
                  Gâteaux Sur Mesure
                </h3>
                <p className="text-[#421500]/85">
                  Des gâteaux personnalisés pour mariages, anniversaires et baptêmes....etc, adaptés à vos envies et besoins.
                </p>
              </div>

              {/* Boîte pour toute occasion */}
              <div className="text-center">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg mb-4">
                  <Image
                    src="/images/surmesure4.avif"
                    alt="Boîte pour toute occasion"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-[#a75120] mb-2">
                  Boîte pour toute occasion
                </h3>
                <p className="text-[#421500]/85">
                  Les boîtes à gourmandises sont idéales pour les plaisirs du quotidien ou sublimer vos événements et apporter une touche de douceur à chaque occasion.
                </p>
              </div>

              {/* Service de Livraison */}
              <div className="text-center">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg mb-4">
                  <Image
                    src="/images/surmesure3.avif"
                    alt="Service de Livraison"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-[#a75120] mb-2">
                  Service de Livraison
                </h3>
                <p className="text-[#421500]/85">
                  Service de livraison pour vos événements, garantissant une expérience culinaire inoubliable et pratique.
                </p>
              </div>
            </div>
          </div>

          {/* Section Avis */}
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            {/* Image de fond */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/avisimage.avif"
                alt="Avis clients"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-[#421500]/80"></div>
            </div>

            {/* Contenu des avis */}
            <div className="relative z-10 p-6 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10">
                Ils ont aimé Coquelicot
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Avis 1 */}
                <div className="bg-white/95 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-[#a75120]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[#421500]/90 leading-relaxed mb-4 italic">
                    &quot;Nous avons commandé une pièce pour 16 personnes pour l&apos;anniversaire de notre fils. La réalisation était aussi belle que délicieuse. Une pâtisserie gourmande mais équilibrée ! Un travail de stylisme fin et élégant. Je recommande un million de fois de s&apos;en remettre à Coquelicot Traiteur Sucré pour vos futurs événements 👌🏻&quot;
                  </p>
                  <p className="text-[#a75120] font-semibold">
                    - Charlène C.
                  </p>
                </div>

                {/* Avis 2 */}
                <div className="bg-white/95 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-[#a75120]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-[#421500]/90 leading-relaxed mb-4 italic">
                    &quot;Une très belle découverte ! Une belle découverte autant visuelle que gustative ! Aucune déception sur les 3 commandes réalisées ! La satisfaction est complète : dès la réception de la commande on découvre un emballage soigné et avec beaucoup de goût tout en simplicité, ensuite on découvre la (les) pâtisserie(s) on en prends plein les yeux et puis pour finir la dégustation qui est un pur régal tout en légèreté ! Les pâtisseries de coquelicot traiteur sucré font partie des « œuvres d&apos;art » culinaires que l&apos;on découpe à contre cœur de peur de les abîmer à la découpe ! Pas d&apos;hésitation à avoir en commandant auprès de Julie qui sait répondre aux attentes de par un contact très simple et très agréable !&quot;
                  </p>
                  <p className="text-[#a75120] font-semibold">
                    - AG
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
}

