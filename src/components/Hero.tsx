import Image from 'next/image';
import Head from 'next/head';

const Hero = () => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Vidéo d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/coquelciot_video.mp4" type="video/mp4" />
            {/* Fallback pour les navigateurs qui ne supportent pas la vidéo */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-amber-700"
            ></div>
          </video>
          
          {/* Superposition pour assurer la lisibilité du texte */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12">
          Pâtisserie Événementielle Élégante
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          L&apos;art de sublimer vos moments gourmands avec délicatesse et poésie.
        </p>
      </div>
    </div>
  );
};

export default Hero; 