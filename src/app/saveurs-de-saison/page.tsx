'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SaveursDeSaison() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f5f0] py-8">
        <div className="container mx-auto px-4">
          <section className="mb-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Les Saveurs de Saison</h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="prose max-w-none text-center">
                <p className="text-lg mb-6">
                  Je vous invite à découvrir ma carte des saveurs, qui se renouvellera chaque saison avec quatre parfums uniques. 
                  Chacun d&apos;eux a été minutieusement élaboré à partir de produits locaux et de haute qualitée, 
                  soigneusement sélectionnés pour garantir une expérience gustative inégalée.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image à gauche */}
              <div className="relative h-[600px] rounded-lg overflow-hidden shadow-lg bg-white">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/saveur-saison.avif"
                    alt="Saveurs de saison"
                    fill
                    className="object-contain p-4"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Texte à droite */}
              <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center">
                <div className="prose max-w-none">
                  <p className="mb-6">
                    La Carte des Saisons évolue tout au long de l&apos;année pour célébrer les saveurs de chaque saison : 
                    printemps, été, automne, hiver.
                  </p>

                  <p className="mb-6">
                    Chaque saison, découvrez 4 saveurs uniques déclinées dans 3 créations pâtissières :
                  </p>

                  <ul className="list-disc list-inside mb-6 space-y-2">
                    <li>une boîte à choux</li>
                    <li>une boîte à macarons</li>
                    <li>une boîte à flower cakes</li>
                  </ul>

                  <p className="mb-6">
                    Chaque boîte contient les 4 saveurs de la saison, les compositions des boîtes sont fixes 
                    et ne peuvent pas être modifiées ni divisées.
                  </p>

                  <p className="text-lg font-semibold text-amber-600 italic">
                    Une invitation gourmande à savourer les saisons, sans compromis !
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
} 