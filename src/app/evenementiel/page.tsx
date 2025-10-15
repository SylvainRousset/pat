'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function Evenementiel() {
  const [showLayerCakeModal, setShowLayerCakeModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#8B6F47] py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-2 sm:px-3 md:px-4 max-w-7xl">
          {/* Titre principal */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center text-[#FAF0E6] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            L&apos;Événementiel
          </h1>

          {/* Texte de présentation */}
          <div className="bg-[#6B4E31] rounded-xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-10 mb-8 sm:mb-10 md:mb-12 border-2 border-[#E8A870]/40">
            <p className="text-sm sm:text-base md:text-lg text-[#E8DED0] text-center leading-relaxed mb-3 sm:mb-4">
              Pour tous vos <span className="font-semibold text-[#E8A870]">événements privés ou professionnels</span> : mariage, anniversaire, baptême, baby shower, gender reveal, communion, fiançailles, EVJF, événements d&apos;entreprise, inaugurations, etc.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-[#E8DED0] text-center leading-relaxed">
              Je vous propose une <span className="font-semibold text-[#E8A870]">offre gourmande, florale et raffinée</span>, réalisée sur-mesure selon vos envies, réalisé avec des <span className="font-semibold text-[#E8A870]">produits de haute qualité</span> pour une expérience unique.
            </p>
          </div>

          {/* Section L'éclosion de vos moments précieux */}
          <div className="mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-[#f1e9dc] mb-4 sm:mb-6 md:mb-8">
              L&apos;éclosion de vos moments précieux
            </h2>

            <div className="bg-[#6B4E31] rounded-xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-10 border-2 border-[#E8A870]/40">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#E8A870] mb-3 sm:mb-4 md:mb-6 text-center">
                L&apos;Événementiel
              </h3>
              <h4 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#f1e9dc] mb-4 sm:mb-6 text-center italic">
                Pour sublimer vos plus beaux moments
              </h4>

              <p className="text-sm sm:text-base md:text-lg text-[#E8DED0] text-center leading-relaxed mb-6 sm:mb-8">
                Parce que chaque instant de vie mérite une attention douce et gourmande, Coquelicot vous accompagne dans vos événements avec des <span className="font-semibold text-[#E8A870]">créations fleuries et sucrées</span>, pensées avec cœur.
              </p>

              {/* Les douceurs proposées */}
              <div className="space-y-4 sm:space-y-6">
                <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#f1e9dc] mb-4 sm:mb-6 text-center">
                  Les douceurs proposées
                </h4>

                {/* Buffet sucré */}
                <div className="bg-[#5C3A1E] p-3 sm:p-4 md:p-6 rounded-lg border border-[#E8A870]/30">
                  <h5 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2 sm:mb-3">
                    Buffet sucré de mignardises
                  </h5>
                  <p className="text-sm sm:text-base text-[#E8DED0] leading-relaxed">
                    Choux, macarons, tartelettes, pavlovas, chouquettes garnies, mini cookies… Une table raffinée, colorée et vibrante, qui reflète les saveurs de saison. Chaque bouchée est facile à déguster, pour le plaisir des yeux et la simplicité pour vos convives.
                  </p>
                </div>

                {/* Layer Cakes */}
                <div className="bg-[#5C3A1E] p-3 sm:p-4 md:p-6 rounded-lg border border-[#E8A870]/30">
                  <h5 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2 sm:mb-3">
                    Layer Cakes décorés à thème
                  </h5>
                  <p className="text-sm sm:text-base text-[#E8DED0] leading-relaxed">
                    Gâteaux généreux à base de génoise moelleuse, crème légère et insert gourmand et fruité, avec plusieurs textures pour surprendre à chaque bouchée. Le tout recouvert d&apos;un glaçage crème au beurre, décoré selon votre thème, pour éblouir les yeux autant que les papilles. <span className="font-semibold text-[#E8A870]">À partir de 7€ la part.</span>
                  </p>
                </div>

                {/* Alpha' Choux & Numé' Choux */}
                <div className="bg-[#5C3A1E] p-3 sm:p-4 md:p-6 rounded-lg border border-[#E8A870]/30">
                  <h5 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2 sm:mb-3">
                    Alpha&apos; Choux & Numé&apos; Choux
                  </h5>
                  <p className="text-sm sm:text-base text-[#E8DED0] leading-relaxed">
                    Gâteaux en forme de lettres, chiffres ou symboles, composés de choux ou de macarons, pour 5, 6, 8, 10 ou 12 parts. Réalisables également sur base sablée basque ou pavlova, pour une présentation originale et raffinée.
                  </p>
                </div>

                {/* Pyramides florales */}
                <div className="bg-[#5C3A1E] p-3 sm:p-4 md:p-6 rounded-lg border border-[#E8A870]/30">
                  <h5 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2 sm:mb-3">
                    Pyramides florales
                  </h5>
                  <p className="text-sm sm:text-base text-[#E8DED0] leading-relaxed">
                    Des pyramides élégantes, composées de 40 choux ou 40 macarons, souvent sur un thème floral ou adaptées à votre thème personnel. Une composition raffinée, visuellement spectaculaire et délicieusement gourmande.
                  </p>
                </div>

                {/* Créations boutiques */}
                <div className="bg-[#5C3A1E] p-3 sm:p-4 md:p-6 rounded-lg border border-[#E8A870]/30">
                  <h5 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2 sm:mb-3">
                    Créations boutiques à partager
                  </h5>
                  <p className="text-sm sm:text-base text-[#E8DED0] leading-relaxed">
                    Toutes mes créations boutique (tartes, entremets, pavlovas, Paris-Brest…) peuvent être adaptées pour vos événements, en format partage. Des desserts audacieux ou classiques, selon vos envies et les saveurs de saison.
                  </p>
                </div>

                {/* Maxi Flower Cakes */}
                <div className="bg-[#5C3A1E] p-3 sm:p-4 md:p-6 rounded-lg border border-[#E8A870]/30">
                  <h5 className="text-base sm:text-lg md:text-xl font-semibold text-[#E8A870] mb-2 sm:mb-3">
                    Maxi Flower Cakes
                  </h5>
                  <p className="text-sm sm:text-base text-[#E8DED0] leading-relaxed">
                    Une revisite des cupcakes : base financier, décorée comme une fleur, avec crèmes légères et inserts gourmands ou fruités. Des desserts rares en sucre, élégants et légers, parfaits pour une dégustation raffinée et esthétique.
                  </p>
                </div>

                <p className="text-center text-sm sm:text-base text-[#E8DED0] italic pt-3 sm:pt-4">
                  Toutes mes créations sont préparées avec des <span className="font-semibold text-[#E8A870]">ingrédients frais, de saison et de grande qualité</span>, pour offrir un moment unique et gourmand.
                </p>
              </div>

              {/* Contact */}
              <div className="mt-6 sm:mt-8 bg-[#5C3A1E] text-[#f1e9dc] p-3 sm:p-4 md:p-6 rounded-lg text-center border-2 border-[#E8A870]/40">
                <h5 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Pour toute demande</h5>
                <p className="mb-3 sm:mb-4 text-sm sm:text-base">Merci de me contacter au moins <span className="font-bold text-[#E8A870]">15 jours à l&apos;avance</span>, et <span className="font-bold text-[#E8A870]">3 mois avant</span> pour les mariages.</p>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-sm sm:text-base md:text-lg">📞 <a href="tel:0608021622" className="hover:text-[#D9844A] transition-colors">06 08 02 16 22</a></p>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg">📩 <a href="mailto:coquelicot.traiteursucre@gmail.com" className="hover:text-[#D9844A] transition-colors">coquelicot.traiteursucre@gmail.com</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Un aperçu des douceurs */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-[#f1e9dc] mb-4 sm:mb-6">
              Un aperçu des douceurs que je propose pour vos événements
            </h2>
            <p className="text-center text-sm sm:text-base text-[#E8DED0] mb-6 sm:mb-8">
              Retrouvez la carte évènementielle juste en dessous
            </p>

            {/* Le Layer Cake c'est quoi ? */}
            <div className="bg-[#6B4E31] rounded-xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 mb-6 sm:mb-8 border-2 border-[#E8A870]/40 text-center">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#f1e9dc] mb-3 sm:mb-4">
                Le Layer Cake c&apos;est quoi ?
              </h3>
              <p className="text-sm sm:text-base text-[#E8DED0] mb-4 sm:mb-6">
                Le Layer Cake, ce n&apos;est pas qu&apos;un simple gâteau...<br />
                Découvrez tous ses secrets et apprenez ce qui le rend si gourmand
              </p>
              <button
                onClick={() => setShowLayerCakeModal(true)}
                className="bg-[#D9844A] hover:bg-[#C27340] text-white font-medium py-2 sm:py-3 px-4 sm:px-6 md:px-8 rounded-md transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                En savoir plus
              </button>
            </div>
          </div>

          {/* Cartes Événementielles */}
          <div className="space-y-8 md:space-y-12 mb-16">
            {/* Carte Évènementielle */}
            <div className="bg-[#E8DED0] rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border-2 border-[#E8A870]/40">
              <div className="text-center mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#421500]">
                  Carte Évènementielle
                </h3>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
                <div className="flex-1 w-full">
                  <div
                    className="rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-[#6B4E31] p-0 sm:p-1"
                    onClick={() => setZoomedImage('/images/cardevenementiel.avif')}
                  >
                    <div className="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] overflow-hidden w-full">
                      <Image
                        src="/images/cardevenementiel.avif"
                        alt="Carte Évènementielle"
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300 w-full h-full"
                        sizes="(max-width: 1023px) 100vw, 50vw"
                      />
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-[#D9844A] text-white p-1 sm:p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#D9844A]/90 text-white px-2 py-1 rounded-full text-xs text-center mt-2 w-fit mx-auto">
                    Cliquez pour agrandir
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm sm:text-base md:text-lg text-[#421500]/85 leading-relaxed">
                    <p>
                      Pour garantir une organisation optimale, les commandes pour les événements de <span className="font-semibold text-[#D9844A]">plus de 20 personnes</span> doivent être passées <span className="font-semibold text-[#D9844A]">15 jours à l&apos;avance</span>.
                    </p>
                    <p className="mt-3">
                      Contactez-moi via le formulaire, par mail ou téléphone : nous convenons ensemble d&apos;un rendez-vous pour définir vos envies, puis un devis personnalisé vous est transmis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte des Saveurs de saison */}
            <div className="bg-[#E8DED0] rounded-xl shadow-xl p-4 sm:p-6 md:p-8 border-2 border-[#E8A870]/40">
              <div className="text-center mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#421500]">
                  Carte des Saveurs de saison
                </h3>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
                <div className="flex-1 w-full">
                  <div
                    className="rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-[#6B4E31] p-0 sm:p-1"
                    onClick={() => setZoomedImage('/images/cardevenementiel2.avif')}
                  >
                    <div className="relative h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] overflow-hidden w-full">
                      <Image
                        src="/images/cardevenementiel2.avif"
                        alt="Carte des Saveurs de saison"
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300 w-full h-full"
                        sizes="(max-width: 1023px) 100vw, 50vw"
                      />
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-[#D9844A] text-white p-1 sm:p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#D9844A]/90 text-white px-2 py-1 rounded-full text-xs text-center mt-2 w-fit mx-auto">
                    Cliquez pour agrandir
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-sm sm:text-base md:text-lg text-[#421500]/85 leading-relaxed">
                    <p>
                      Ce sont les saveurs que je propose pour vos événements. <span className="font-semibold text-[#D9844A]">Allergies, goûts particuliers ou envies spéciales ?</span>
                    </p>
                    <p className="mt-3">
                      Chaque création peut être adaptée, remplacée ou même entièrement personnalisée selon vos souhaits. N&apos;hésitez pas à me partager vos envies pour rendre votre événement unique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Les Services */}
          <div className="bg-[#E8DED0] rounded-xl shadow-xl p-3 sm:p-4 md:p-6 lg:p-10 border-2 border-[#E8A870]/40">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-[#421500] mb-3 sm:mb-4">
              Les Services
            </h2>
            <p className="text-center text-sm sm:text-base text-[#421500]/85 mb-6 sm:mb-8">
              Découvrez les créations sur mesure pour tous vos événements, des gâteaux aux mignardises sucrées.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Gâteaux Sur Mesure */}
              <div className="text-center">
                <div className="relative h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-lg mb-3 sm:mb-4 w-full">
                  <Image
                    src="/images/surmesure2.avif"
                    alt="Gâteaux Sur Mesure"
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300 w-full h-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#D9844A] mb-2">
                  Gâteaux Sur Mesure
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-[#421500]/85 leading-relaxed">
                  Des gâteaux personnalisés pour mariages, anniversaires et baptêmes....etc, adaptés à vos envies et besoins.
                </p>
              </div>

              {/* Boîte pour toute occasion */}
              <div className="text-center">
                <div className="relative h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-lg mb-3 sm:mb-4 w-full">
                  <Image
                    src="/images/surmesure4.avif"
                    alt="Boîte pour toute occasion"
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300 w-full h-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#D9844A] mb-2">
                  Boîte pour toute occasion
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-[#421500]/85 leading-relaxed">
                  Les boîtes à gourmandises sont idéales pour les plaisirs du quotidien ou sublimer vos événements et apporter une touche de douceur à chaque occasion.
                </p>
              </div>

              {/* Service de Livraison */}
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="relative h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden shadow-lg mb-3 sm:mb-4 w-full">
                  <Image
                    src="/images/surmesure3.avif"
                    alt="Service de Livraison"
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300 w-full h-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#D9844A] mb-2">
                  Service de Livraison
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-[#421500]/85 leading-relaxed">
                  Service de livraison pour vos événements, garantissant une expérience culinaire inoubliable et pratique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Zoom Image */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 bg-[#D9844A] hover:bg-[#C27340] text-white p-3 rounded-full shadow-lg transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full h-full">
              <Image
                src={zoomedImage}
                alt="Image agrandie"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Layer Cake */}
      {showLayerCakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#FAF0E6] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-[#421500]">
                Le Layer Cake, c&apos;est quoi ?
              </h3>
              <button
                onClick={() => setShowLayerCakeModal(false)}
                className="text-[#421500] hover:text-[#D9844A] text-3xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 text-[#421500]/85">
              <p>
                Le <span className="font-semibold text-[#D9844A]">Layer Cake</span> est bien plus qu&apos;un simple gâteau ! C&apos;est une véritable création pâtissière composée de plusieurs étages de génoise moelleuse, alternés avec des crèmes onctueuses et des inserts fruités ou gourmands.
              </p>
              
              <p>
                Chaque bouchée vous fait découvrir une <span className="font-semibold text-[#D9844A]">explosion de textures et de saveurs</span> : le moelleux de la génoise, la légèreté de la crème, et la surprise de l&apos;insert qui apporte du croquant ou de la fraîcheur.
              </p>
              
              <p>
                Le tout est recouvert d&apos;un <span className="font-semibold text-[#D9844A]">glaçage crème au beurre</span> savoureux et décoré selon vos envies et votre thème, pour un résultat aussi beau que délicieux.
              </p>
              
              <p>
                Parfait pour les <span className="font-semibold text-[#D9844A]">mariages, anniversaires, baptêmes</span> et tous vos événements spéciaux !
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLayerCakeModal(false)}
                className="bg-[#D9844A] hover:bg-[#C27340] text-white font-medium py-3 px-8 rounded-md transition-all duration-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ScrollToTop />
    </>
  );
}

