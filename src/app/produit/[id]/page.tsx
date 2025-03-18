import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

// Définition du type pour le composant page de Next.js
export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductDetailClient params={params} />
    </Suspense>
  );
} 