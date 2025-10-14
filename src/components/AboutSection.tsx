'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutSection = () => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  return (
    <section className="py-16 bg-[#8B6F47]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section principale de bienvenue */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#FAF0E6]">
            Bienvenue dans l&apos;univers fleuri de Coquelicot
          </h2>
          <p className="text-lg text-[#E8DED0] leading-relaxed mb-4">
            Chez <span className="font-semibold text-[#E8A870]">Coquelicot</span>, la nature inspire chaque création, entre délicatesse florale, notes végétales et touches audacieuses.
          </p>
        </div>

        {/* Description des produits */}
        <div className="space-y-6 text-[#E8DED0] leading-relaxed mb-12">
          <p>
            Les <span className="font-semibold text-[#E8A870]">Mignardises fleuries</span> ouvrent la danse : une <span className="font-semibold text-[#E8A870]">carte de saison</span>, composée de <span className="font-semibold text-[#E8A870]">quatre saveurs audacieuses</span>, qui se réinvente au rythme du printemps, de l&apos;été, de l&apos;automne et de l&apos;hiver.
            Pour les plaisirs du quotidien, dans l&apos;esprit tendre d&apos;un goûter, retrouvez mes <span className="font-semibold text-[#E8A870]">cookies mini ou maxi</span> et de <span className="font-semibold text-[#E8A870]">gourmandes chouquettes garnies</span>.
          </p>
          
          <p>
            Chaque mois, une <span className="font-semibold text-[#E8A870]">Boîte à Création</span> vous propose une <span className="font-semibold text-[#E8A870]">pâtisserie individuelle inédite</span>, née de l&apos;inspiration et des saisons.
            Viennent ensuite les <span className="font-semibold text-[#E8A870]">gâteaux à partager</span> : tartes, entremets, pavlovas, Paris-Brest, Charlottes… des créations <span className="font-semibold text-[#E8A870]">originales et audacieuses</span>, toujours portées par les saveurs du moment.
          </p>
          
          <p>
            Et pour vos instants uniques, je vous accompagne avec un <span className="font-semibold text-[#E8A870]">service événementiel sur mesure</span>, élégant et raffiné.
          </p>
          
          <p className="text-sm italic text-[#E8A870] font-medium">
            Les <span className="font-bold text-[#E8A870]">cartes boutique et événementielle</span> se trouvent juste en dessous : pour les détails des saveurs, compositions ou allergènes, rendez-vous directement sur chaque fiche produit.
            Pour l&apos;événementiel, vous pouvez me contacter par mail (<a href="mailto:coquelicot.traiteursucre@gmail.com" className="font-bold text-[#E8A870] hover:underline hover:text-[#D9A066] transition-colors">coquelicot.traiteursucre@gmail.com</a>), via le formulaire ou par téléphone (<a href="tel:0608021622" className="font-bold text-[#E8A870] hover:underline hover:text-[#D9A066] transition-colors">06 08 02 16 22</a>).
          </p>
        </div>

        {/* Section Les Cartes Coquelicot */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#f1e9dc]">
            Les Cartes Coquelicot
          </h3>
          <p className="text-center text-[#E8DED0] mb-8">
            Retrouvez ici mes deux cartes Coquelicot :<br />
            La carte <span className="font-semibold text-[#E8A870]">Boutique</span> pour vos douceurs à emporter, et la carte <span className="font-semibold text-[#E8A870]">Évènementielle</span> pour vos moments à célébrer
          </p>
          
          {/* Images des cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
            <div 
              className="relative h-[380px] md:h-[700px] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-[#6B4E31] px-3 pt-2 pb-8 md:p-2"
              onClick={() => setZoomedImage('/images/carteacc1.avif')}
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/carteacc1.avif"
                  alt="Carte Boutique Coquelicot"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute top-2 right-2 bg-[#a75120] text-white p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              <div className="absolute bottom-2 left-2 bg-[#a75120]/90 text-white px-3 py-1 rounded-full text-xs md:hidden">
                Cliquez pour agrandir
              </div>
            </div>
            <div 
              className="relative h-[380px] md:h-[700px] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-[#6B4E31] px-3 pt-2 pb-8 md:p-2"
              onClick={() => setZoomedImage('/images/carteacc2.avif')}
            >
              <div className="relative w-full h-full">
                <Image
                  src="/images/carteacc2.avif"
                  alt="Carte Évènementielle Coquelicot"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute top-2 right-2 bg-[#a75120] text-white p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              <div className="absolute bottom-2 left-2 bg-[#a75120]/90 text-white px-3 py-1 rounded-full text-xs md:hidden">
                Cliquez pour agrandir
              </div>
            </div>
          </div>
        </div>

        {/* Section Réservez Votre Gâteau */}
        <div className="bg-[#5C3A1E] rounded-xl shadow-xl p-8 md:p-12 border-2 border-[#a75120]/40">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#f1e9dc]">
            Réservez Votre Gâteau
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Première carte - Boutique */}
            <div className="bg-[#6B4E31] p-6 rounded-lg border-2 border-[#a75120]/40 hover:border-[#a75120] transition-all duration-300 shadow-md hover:shadow-lg">
              <p className="text-[#f1e9dc] leading-relaxed mb-6">
                Choisissez votre date et heure de retrait pour vos créations sucrées sur la boutique en ligne. Commandez 48h à l&apos;avance.
              </p>
              <Link 
                href="/boutique" 
                className="block w-full text-center bg-[#a75120] hover:bg-[#8a421a] text-white font-medium py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Réserver
              </Link>
            </div>
            
            {/* Deuxième carte - Contact */}
            <div className="bg-[#6B4E31] p-6 rounded-lg border-2 border-[#a75120]/40 hover:border-[#a75120] transition-all duration-300 shadow-md hover:shadow-lg">
              <p className="text-[#f1e9dc] leading-relaxed mb-6">
                Contactez-moi pour sublimer vos plus beaux moments. Pensez à le faire minimum 15 jours avant la date de l&apos;événement.
              </p>
              <Link 
                href="/contact" 
                className="block w-full text-center bg-[#a75120] hover:bg-[#8a421a] text-white font-medium py-3 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Réserver
              </Link>
            </div>
          </div>
        </div>
      </div>

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
    </section>
  );
};

export default AboutSection; 