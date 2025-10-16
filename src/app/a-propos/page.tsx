'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function APropos() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#8B6F47] py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Titre principal */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center text-[#FAF0E6] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            La délicatesse du Coquelicot, la force d&apos;une idée
          </h1>

          {/* Mon Ambition */}
          <div className="mb-16">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-[#f1e9dc] mb-4 sm:mb-6 md:mb-8">
              Mon Ambition
            </h2>

            <div className="bg-[#6B4E31] rounded-xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-10 border-2 border-[#E8A870]/40">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
                {/* Texte à gauche */}
                <div className="space-y-3 sm:space-y-4 text-[#E8DED0] leading-relaxed">
                  <p className="text-sm sm:text-base md:text-lg">
                    Bienvenue chez <span className="font-semibold text-[#E8A870]">Coquelicot</span>, où la passion pour la pâtisserie rencontre l&apos;art de célébrer les moments précieux de votre vie avec des créations sur mesure, mais pas que.
                  </p>

                  <p className="text-sm sm:text-base md:text-lg">
                    Dans un monde où la pâtisserie évolue constamment, j&apos;aimerais fusionner le <span className="font-semibold text-[#E8A870]">savoir-faire des pâtissiers restaurateurs</span> avec les techniques raffinées des boutiques de pâtisserie, tout en y intégrant l&apos;art sous forme de peinture et de dessin. Chaque création devient ainsi une pièce unique, conçue pour allier beauté et plaisir, afin de ravir le plus grand nombre d&apos;entre vous. Imaginez des desserts qui, non seulement émerveillent par leur goût, mais aussi par leur présentation délicate, alliant tradition et innovation.
                  </p>

                  <p className="text-sm sm:text-base md:text-lg">
                    Chaque création sera inspirée par la <span className="font-semibold text-[#E8A870]">délicatesse du coquelicot</span>, symbolisant la délicatesse et la beauté éphémère.
                  </p>

                  <p className="text-sm sm:text-base md:text-lg">
                    Cela permettrait ainsi de créer une <span className="font-semibold text-[#E8A870]">expérience culinaire holistique</span>, où chaque bouchée raconte une histoire et où chaque pâtisserie est une œuvre d&apos;art.
                  </p>
                </div>

                {/* Image à droite */}
                <div className="order-first lg:order-last">
                  <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[450px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/images/apropofleur.avif"
                      alt="Délicatesse florale"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1023px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coquelicot c'est qui... */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-[#f1e9dc] mb-4 sm:mb-6 md:mb-8">
              Coquelicot c&apos;est qui...
            </h2>

            <div className="bg-[#6B4E31] rounded-xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-10 border-2 border-[#E8A870]/40">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
                {/* Texte à gauche */}
                <div className="space-y-3 sm:space-y-4 text-[#E8DED0] leading-relaxed">
                  <p className="text-sm sm:text-base md:text-lg">
                    <span className="font-semibold text-[#E8A870]">Bonjour, je m&apos;appelle Julie Ferioli</span> et je suis pâtissière spécialisée dans la restauration gastronomique depuis 18 ans.
                  </p>

                  <p className="text-sm sm:text-base md:text-lg">
                    Au cours de ma carrière, j&apos;ai eu le privilège de travailler dans des <span className="font-semibold text-[#E8A870]">établissements prestigieux</span> de la gastronomie française et de côtoyer de grands chefs étoilés.
                  </p>

                  <p className="text-sm sm:text-base md:text-lg">
                    Aujourd&apos;hui, je souhaite partager mon univers avec vous en proposant des <span className="font-semibold text-[#E8A870]">créations originales</span> qui éveilleront vos papilles. Chaque dessert que je prépare est le fruit de mes années d&apos;expérience et de ma passion pour la pâtisserie.
                  </p>

                  <p className="text-sm sm:text-base md:text-lg">
                    Mon objectif est de vous offrir des <span className="font-semibold text-[#E8A870]">saveurs uniques</span> qui reflètent mon savoir-faire et ma vision de la gourmandise.
                  </p>

                  <p className="text-sm sm:text-base md:text-lg">
                    Rejoignez-moi dans cette aventure culinaire où l&apos;innovation rencontre la tradition, et laissez-vous séduire par des douceurs à la fois délicates et audacieuses.
                  </p>
                </div>

                {/* Image à droite */}
                <div>
                  <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[450px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src="/images/profil.avif"
                      alt="Julie Ferioli"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1023px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Les Services */}
          <div className="bg-[#6B4E31] rounded-xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-10 border-2 border-[#E8A870]/40 mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-[#f1e9dc] mb-3 sm:mb-4">
              Les Services
            </h2>
            <p className="text-center text-sm sm:text-base text-[#E8DED0] mb-6 sm:mb-8">
              Découvrez les créations sur mesure pour tous vos événements, des gâteaux aux mignardises sucrées.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Gâteaux Sur Mesure */}
              <div className="text-center">
                <div className="relative h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] rounded-lg overflow-hidden shadow-lg mb-3 sm:mb-4">
                  <Image
                    src="/images/surmesure2.avif"
                    alt="Gâteaux Sur Mesure"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2">
                  Gâteaux Sur Mesure
                </h3>
                <p className="text-sm sm:text-base text-[#E8DED0]">
                  Des gâteaux personnalisés pour mariages, anniversaires et baptêmes....etc, adaptés à vos envies et besoins.
                </p>
              </div>

              {/* Boîte pour toute occasion */}
              <div className="text-center">
                <div className="relative h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] rounded-lg overflow-hidden shadow-lg mb-3 sm:mb-4">
                  <Image
                    src="/images/surmesure4.avif"
                    alt="Boîte pour toute occasion"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2">
                  Boîte pour toute occasion
                </h3>
                <p className="text-sm sm:text-base text-[#E8DED0]">
                  Les boîtes à gourmandises sont idéales pour les plaisirs du quotidien ou sublimer vos événements et apporter une touche de douceur à chaque occasion.
                </p>
              </div>

              {/* Service de Livraison */}
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="relative h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] rounded-lg overflow-hidden shadow-lg mb-3 sm:mb-4">
                  <Image
                    src="/images/surmesure3.avif"
                    alt="Service de Livraison"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2">
                  Service de Livraison
                </h3>
                <p className="text-sm sm:text-base text-[#E8DED0]">
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
              <div className="absolute inset-0 bg-[#421500]/85"></div>
            </div>

            {/* Contenu des avis */}
            <div className="relative z-10 p-4 sm:p-6 lg:p-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-white mb-6 sm:mb-8 lg:mb-10">
                Ils ont aimé Coquelicot
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Avis 1 */}
                <div className="bg-white/95 rounded-lg p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-[#a75120]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-[#421500]/90 leading-relaxed mb-3 sm:mb-4 italic">
                    &quot;Nous avons commandé une pièce pour 16 personnes pour l&apos;anniversaire de notre fils. La réalisation était aussi belle que délicieuse. Une pâtisserie gourmande mais équilibrée ! Un travail de stylisme fin et élégant. Je recommande un million de fois de s&apos;en remettre à Coquelicot Traiteur Sucré pour vos futurs événements 👌🏻&quot;
                  </p>
                  <p className="text-[#a75120] font-semibold text-sm sm:text-base">
                    - Charlène C.
                  </p>
                </div>

                {/* Avis 2 */}
                <div className="bg-white/95 rounded-lg p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex text-[#a75120]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-[#421500]/90 leading-relaxed mb-3 sm:mb-4 italic">
                    &quot;Une très belle découverte ! Une belle découverte autant visuelle que gustative ! Aucune déception sur les 3 commandes réalisées ! La satisfaction est complète : dès la réception de la commande on découvre un emballage soigné et avec beaucoup de goût tout en simplicité, ensuite on découvre la (les) pâtisserie(s) on en prends plein les yeux et puis pour finir la dégustation qui est un pur régal tout en légèreté ! Les pâtisseries de coquelicot traiteur sucré font partie des « œuvres d&apos;art » culinaires que l&apos;on découpe à contre cœur de peur de les abîmer à la découpe ! Pas d&apos;hésitation à avoir en commandant auprès de Julie qui sait répondre aux attentes de par un contact très simple et très agréable !&quot;
                  </p>
                  <p className="text-[#a75120] font-semibold text-sm sm:text-base">
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

