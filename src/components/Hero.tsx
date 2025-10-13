const Hero = () => {
  return (
    <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] overflow-hidden">
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
          <div className="absolute inset-0 bg-[#421502]/50" />
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-3 md:px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-[#e3cfb3] drop-shadow-lg">
          Pâtisserie Événementielle Élégante
        </h1>
        <p className="text-sm sm:text-base md:text-lg mb-2 md:mb-4 max-w-md md:max-w-xl text-[#d9dacd] font-semibold drop-shadow-lg">
          L&apos;art de sublimer vos moments gourmands avec délicatesse et poésie.
        </p>
      </div>
    </div>
  );
};

export default Hero; 