import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

// Page côté serveur avec typage correct pour Next.js App Router
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductDetailClient params={params} />
    </Suspense>
  );
} 