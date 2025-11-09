import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/firebaseAdmin';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative">
      <div className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px] xl:w-[260px] xl:h-[260px] 2xl:w-[280px] 2xl:h-[280px] overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75 mx-auto relative">
        <Image
          src={product.image}
          alt={product.name}
          width={280}
          height={280}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
        {product.isNew && (
          <div className="absolute top-2 right-2 bg-[#D9844A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            Nouveauté
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/produit/${product.id}`}>{product.name}</Link>
          </h3>
          <div 
            className="mt-1 text-sm text-gray-500 product-description"
            dangerouslySetInnerHTML={{ 
              __html: product.description.includes('<') && product.description.includes('>') 
                ? product.description 
                : product.description.replace(/\n/g, '<br>')
            }}
          />
        </div>
        <p className="text-sm font-medium text-gray-900">
          {(() => {
            // Remplacer les virgules par des points pour la conversion
            const cleanPrice = product.price.replace(',', '.');
            const price = Number(cleanPrice);
            return isNaN(price) ? 'Prix non disponible' : `${price.toFixed(2)} €`;
          })()}
        </p>
      </div>
    </div>
  );
} 