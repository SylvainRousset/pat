'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function Evenementiel() {
  const [showLayerCakeModal, setShowLayerCakeModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f1e9dc] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Titre principal */}
          <h1 className="text-3xl md:text-5xl font-bold text-center text-[#421500] mb-8 md:mb-12">
            L&apos;Événementiel
          </h1>
          
          {/* Texte de présentation */}
          <div className="bg-[#f8f3eb] rounded-xl shadow-lg p-6 md:p-10 mb-12 border-2 border-[#a75120]/20">
            <p className="text-base md:text-lg text-[#421500]/85 text-center leading-relaxed mb-4">
              Pour tous vos <span className="font-semibold text-[#a75120]">événements privés ou professionnels</span> : mariage, anniversaire, baptême, baby shower, gender reveal, communion, fiançailles, EVJF, événements d&apos;entreprise, inaugurations, etc.
            </p>
            <p className="text-base md:text-lg text-[#421500]/85 text-center leading-relaxed">
              Je vous propose une <span className="font-semibold text-[#a75120]">offre gourmande, florale et raffinée</span>, réalisée sur-mesure selon vos envies, réalisé avec des <span className="font-semibold text-[#a75120]">produits de haute qualité</span> pour une expérience unique.
            </p>
          </div>

          {/* Section L'éclosion de vos moments précieux */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#421500] mb-8">
              L&apos;éclosion de vos moments précieux
            </h2>
            
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#a75120]/20">
              <h3 className="text-xl md:text-2xl font-semibold text-[#a75120] mb-6 text-center">
                L&apos;Événementiel
              </h3>
              <h4 className="text-lg md:text-xl font-semibold text-[#421500] mb-6 text-center italic">
                Pour sublimer vos plus beaux moments
              </h4>
              
              <p className="text-base md:text-lg text-[#421500]/85 text-center leading-relaxed mb-8">
                Parce que chaque instant de vie mérite une attention douce et gourmande, Coquelicot vous accompagne dans vos événements avec des <span className="font-semibold text-[#a75120]">créations fleuries et sucrées</span>, pensées avec cœur.
              </p>

              {/* Les douceurs proposées */}
              <div className="space-y-6">
                <h4 className="text-xl md:text-2xl font-bold text-[#421500] mb-6 text-center">
                  Les douceurs proposées
                </h4>

                {/* Buffet sucré */}
                <div className="bg-[#f8f3eb] p-6 rounded-lg">
                  <h5 className="text-lg md:text-xl font-semibold text-[#a75120] mb-3">
                    Buffet sucré de mignardises
                  </h5>
                  <p className="text-[#421500]/85 leading-relaxed">
                    Choux, macarons, tartelettes, pavlovas, chouquettes garnies, mini cookies… Une table raffinée, colorée et vibrante, qui reflète les saveurs de saison. Chaque bouchée est facile à déguster, pour le plaisir des yeux et la simplicité pour vos convives.
                  </p>
                </div>

                {/* Layer Cakes */}
                <div className="bg-[#f8f3eb] p-6 rounded-lg">
                  <h5 className="text-lg md:text-xl font-semibold text-[#a75120] mb-3">
                    Layer Cakes décorés à thème
                  </h5>
                  <p className="text-[#421500]/85 leading-relaxed">
                    Gâteaux généreux à base de génoise moelleuse, crème légère et insert gourmand et fruité, avec plusieurs textures pour surprendre à chaque bouchée. Le tout recouvert d&apos;un glaçage crème au beurre, décoré selon votre thème, pour éblouir les yeux autant que les papilles. <span className="font-semibold text-[#a75120]">À partir de 7€ la part.</span>
                  </p>
                </div>

                {/* Alpha' Choux & Numé' Choux */}
                <div className="bg-[#f8f3eb] p-6 rounded-lg">
                  <h5 className="text-lg md:text-xl font-semibold text-[#a75120] mb-3">
                    Alpha&apos; Choux & Numé&apos; Choux
                  </h5>
                  <p className="text-[#421500]/85 leading-relaxed">
                    Gâteaux en forme de lettres, chiffres ou symboles, composés de choux ou de macarons, pour 5, 6, 8, 10 ou 12 parts. Réalisables également sur base sablée basque ou pavlova, pour une présentation originale et raffinée.
                  </p>
                </div>

                {/* Pyramides florales */}
                <div className="bg-[#f8f3eb] p-6 rounded-lg">
                  <h5 className="text-lg md:text-xl font-semibold text-[#a75120] mb-3">
                    Pyramides florales
                  </h5>
                  <p className="text-[#421500]/85 leading-relaxed">
                    Des pyramides élégantes, composées de 40 choux ou 40 macarons, souvent sur un thème floral ou adaptées à votre thème personnel. Une composition raffinée, visuellement spectaculaire et délicieusement gourmande.
                  </p>
                </div>

                {/* Créations boutiques */}
                <div className="bg-[#f8f3eb] p-6 rounded-lg">
                  <h5 className="text-lg md:text-xl font-semibold text-[#a75120] mb-3">
                    Créations boutiques à partager
                  </h5>
                  <p className="text-[#421500]/85 leading-relaxed">
                    Toutes mes créations boutique (tartes, entremets, pavlovas, Paris-Brest…) peuvent être adaptées pour vos événements, en format partage. Des desserts audacieux ou classiques, selon vos envies et les saveurs de saison.
                  </p>
                </div>

                {/* Maxi Flower Cakes */}
                <div className="bg-[#f8f3eb] p-6 rounded-lg">
                  <h5 className="text-lg md:text-xl font-semibold text-[#a75120] mb-3">
                    Maxi Flower Cakes
                  </h5>
                  <p className="text-[#421500]/85 leading-relaxed">
                    Une revisite des cupcakes : base financier, décorée comme une fleur, avec crèmes légères et inserts gourmands ou fruités. Des desserts rares en sucre, élégants et légers, parfaits pour une dégustation raffinée et esthétique.
                  </p>
                </div>

                <p className="text-center text-[#421500]/85 italic pt-4">
                  Toutes mes créations sont préparées avec des <span className="font-semibold text-[#a75120]">ingrédients frais, de saison et de grande qualité</span>, pour offrir un moment unique et gourmand.
                </p>
              </div>

              {/* Contact */}
              <div className="mt-8 bg-[#a75120] text-white p-6 rounded-lg text-center">
                <h5 className="text-xl font-semibold mb-4">Pour toute demande</h5>
                <p className="mb-4">Merci de me contacter au moins <span className="font-bold">15 jours à l&apos;avance</span>, et <span className="font-bold">3 mois avant</span> pour les mariages.</p>
                <div className="space-y-2">
                  <p className="text-lg">📞 <a href="tel:0608021622" className="hover:underline">06 08 02 16 22</a></p>
                  <p className="text-lg">📩 <a href="mailto:coquelicot.traiteursucre@gmail.com" className="hover:underline">coquelicot.traiteursucre@gmail.com</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Un aperçu des douceurs */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#421500] mb-6">
              Un aperçu des douceurs que je propose pour vos événements
            </h2>
            <p className="text-center text-[#421500]/85 mb-8">
              Retrouvez la carte évènementielle juste en dessous
            </p>

            {/* Le Layer Cake c'est quoi ? */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border-2 border-[#a75120]/20 text-center">
              <h3 className="text-xl md:text-2xl font-semibold text-[#421500] mb-4">
                Le Layer Cake c&apos;est quoi ?
              </h3>
              <p className="text-[#421500]/85 mb-6">
                Le Layer Cake, ce n&apos;est pas qu&apos;un simple gâteau...<br />
                Découvrez tous ses secrets et apprenez ce qui le rend si gourmand
              </p>
              <button
                onClick={() => setShowLayerCakeModal(true)}
                className="bg-[#a75120] hover:bg-[#8a421a] text-white font-medium py-3 px-8 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
              >
                En savoir plus
              </button>
            </div>
          </div>

          {/* Cartes Événementielles */}
          <div className="bg-[#f8f3eb] rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#a75120]/20 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Carte Évènementielle */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-center text-[#421500]">
                  Carte Évènementielle
                </h3>
                
                <div 
                  className="relative h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-xl bg-white cursor-pointer group"
                  onClick={() => setZoomedImage('/images/cardevenementiel.avif')}
                >
                  <Image
                    src="/images/cardevenementiel.avif"
                    alt="Carte Évènementielle"
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-2 right-2 bg-[#a75120] text-white p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-[#a75120]/90 text-white px-3 py-1 rounded-full text-xs md:hidden">
                    Cliquez pour agrandir
                  </div>
                </div>
                
                <p className="text-sm md:text-base text-[#421500]/85 leading-relaxed">
                  Pour garantir une organisation optimale, les commandes pour les événements de <span className="font-semibold text-[#a75120]">plus de 20 personnes</span> doivent être passées <span className="font-semibold text-[#a75120]">15 jours à l&apos;avance</span>. Contactez-moi via le formulaire, par mail ou téléphone : nous convenons ensemble d&apos;un rendez-vous pour définir vos envies, puis un devis personnalisé vous est transmis.
                </p>
              </div>

              {/* Carte des Saveurs de saison */}
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-center text-[#421500]">
                  Carte des Saveurs de saison
                </h3>
                
                <div 
                  className="relative h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-xl bg-white cursor-pointer group"
                  onClick={() => setZoomedImage('/images/cardevenementiel2.avif')}
                >
                  <Image
                    src="/images/cardevenementiel2.avif"
                    alt="Carte des Saveurs de saison"
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute top-2 right-2 bg-[#a75120] text-white p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-[#a75120]/90 text-white px-3 py-1 rounded-full text-xs md:hidden">
                    Cliquez pour agrandir
                  </div>
                </div>
                
                <p className="text-sm md:text-base text-[#421500]/85 leading-relaxed">
                  Ce sont les saveurs que je propose pour vos événements. <span className="font-semibold text-[#a75120]">Allergies, goûts particuliers ou envies spéciales ?</span> Chaque création peut être adaptée, remplacée ou même entièrement personnalisée selon vos souhaits. N&apos;hésitez pas à me partager vos envies pour rendre votre événement unique.
                </p>
              </div>
            </div>
          </div>

          {/* Les Services */}
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#a75120]/20">
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
              className="absolute top-4 right-4 z-10 bg-[#a75120] hover:bg-[#8a421a] text-white p-3 rounded-full shadow-lg transition-colors"
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-[#421500]">
                Le Layer Cake, c&apos;est quoi ?
              </h3>
              <button
                onClick={() => setShowLayerCakeModal(false)}
                className="text-[#421500] hover:text-[#a75120] text-3xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4 text-[#421500]/85">
              <p>
                Le <span className="font-semibold text-[#a75120]">Layer Cake</span> est bien plus qu&apos;un simple gâteau ! C&apos;est une véritable création pâtissière composée de plusieurs étages de génoise moelleuse, alternés avec des crèmes onctueuses et des inserts fruités ou gourmands.
              </p>
              
              <p>
                Chaque bouchée vous fait découvrir une <span className="font-semibold text-[#a75120]">explosion de textures et de saveurs</span> : le moelleux de la génoise, la légèreté de la crème, et la surprise de l&apos;insert qui apporte du croquant ou de la fraîcheur.
              </p>
              
              <p>
                Le tout est recouvert d&apos;un <span className="font-semibold text-[#a75120]">glaçage crème au beurre</span> savoureux et décoré selon vos envies et votre thème, pour un résultat aussi beau que délicieux.
              </p>
              
              <p>
                Parfait pour les <span className="font-semibold text-[#a75120]">mariages, anniversaires, baptêmes</span> et tous vos événements spéciaux !
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLayerCakeModal(false)}
                className="bg-[#a75120] hover:bg-[#8a421a] text-white font-medium py-3 px-8 rounded-md transition-all duration-300"
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

