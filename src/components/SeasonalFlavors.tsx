import React from 'react';

const SeasonalFlavors = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#f8f5f0] rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Carte des Saveurs Hiver</h2>
            <p className="text-md text-center text-amber-700 mb-4">Janvier - Mars</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-amber-600 rounded-full mr-3 flex-shrink-0"></span>
                <span className="font-medium">Chocolat Passions</span>
              </div>
              <div className="flex items-center justify-end">
                <span className="w-3 h-3 bg-amber-600 rounded-full mr-3 flex-shrink-0"></span>
                <span className="font-medium">Noisette Vanille Popcorn</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-amber-600 rounded-full mr-3 flex-shrink-0"></span>
                <span className="font-medium">Caramel Fleur de Sel Kalamansi</span>
              </div>
              <div className="flex items-center justify-end">
                <span className="w-3 h-3 bg-amber-600 rounded-full mr-3 flex-shrink-0"></span>
                <span className="font-medium">Matcha Sésame Noir Noix de Coco Mangue Combava</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonalFlavors; 