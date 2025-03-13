'use client';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SurMesure() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f5f0] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Le Sur-Mesure</h1>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <div className="prose max-w-none">
                <p className="mb-6">Chez Coquelicot, je crois en la personnalisation et en la créativité pour vos événements spéciaux.</p>
                
                <p className="mb-6">Que ce soit pour un mariage, un PACS, un baptême, une baby shower, un gender reveal, un anniversaire ou même un événement d&apos;entreprise, les créations telles que le layer cake, le wedding cake, la pyramide de choux ou buffet sucré sont entièrement adaptables.</p>
                
                <p className="mb-6">Vous avez la liberté de choisir les saveurs et le design qui vous reflètent le mieux, dans une ambiance bohème et florale. Je ne travaille pas la pâte à sucre, privilégiant des textures, des goûts, et des créations peu sucrées. Laissez libre cours à votre imagination, et ensemble, créons des douceurs inoubliables pour chaque moment précieux de votre vie.</p>
              </div>
            </div>

            <div className="relative h-[400px] w-full mb-12">
              <Image
                src="/images/surmesure1.avif"
                alt="Sur-mesure chez Coquelicot"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-semibold mb-6">L&apos;éclosion de vos moments précieux</h2>
              <p className="mb-6">Pour vos événements uniques, je vous propose des créations sur-mesure adaptées à vos envies et à votre moment précieux. Voici comment cela fonctionne :</p>
              
              <ol className="list-decimal list-inside space-y-4 mb-8">
                <li><strong>Prendre contact :</strong> Vous pouvez me joindre par téléphone, par e-mail (l&apos;adresse est indiquée sur le site) ou via le formulaire de contact disponible directement en ligne.</li>
                <li><strong>Un rendez-vous personnalisé :</strong> Si nécessaire, nous convenons ensemble d&apos;un rendez-vous pour discuter de vos souhaits et idées. Ce moment d&apos;échange me permet de mieux comprendre vos attentes pour votre événement.</li>
                <li><strong>Croquis et devis :</strong> À partir de vos idées, je réalise un croquis de votre gâteau ou pièce montée, accompagné d&apos;un devis détaillé.</li>
                <li><strong>Validation et organisation :</strong> Une fois le devis accepté, des arrhes seront demandées pour confirmer la prestation. Nous finalisons ensuite la date et les derniers détails.</li>
              </ol>

              <p className="mb-6">Les créations sur-mesure sont disponibles pour les wedding cakes, layer cakes, pyramides de choux, ainsi que pour les plateaux de choux, macarons ou flower cakes, ou toute envie particulière. Chaque réalisation est pensée pour sublimer votre événement et le rendre inoubliable.</p>
              
              <p className="mb-6">N&apos;hésitez pas à me contacter pour donner vie à votre moment unique !</p>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <p className="text-amber-700">⚠️ Pour toute commande sur-mesure il est nécessaire de la passer au minimum 2 semaines avant la date de l&apos;événement ! Le prix de la part commence à partir de 6€ pour les layers cake.</p>
              </div>
            </div>

            <h2 className="text-3xl font-semibold text-center mb-12">Les Services</h2>
            <p className="text-center text-lg mb-12">Découvrez les créations sur mesure pour tous vos événements, des gâteaux aux mignardises sucrées.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/images/surmesure2.avif"
                    alt="Gâteaux Sur Mesure"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Gâteaux Sur Mesure</h3>
                  <p>Des gâteaux personnalisés pour mariages, anniversaires et baptêmes....etc, adaptés à vos envies et besoins.</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/images/surmesure3.avif"
                    alt="Boîte pour toute occasion"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Boîte pour toute occasion</h3>
                  <p>Les boîtes à gourmandises sont idéales pour les plaisirs du quotidien ou sublimer vos événements et apporter une touche de douceur à chaque occasion.</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/images/surmesure4.avif"
                    alt="Service de Livraison"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Service de Livraison</h3>
                  <p>Service de livraison pour vos événements, garantissant une expérience culinaire inoubliable et pratique.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 