import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductPage({ params }: {
  params?: Promise<{ id: string }>
}) {
  // Résoudre la promesse si params est une Promise
  const resolvedParams = params ? await params : { id: '' };

  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductDetailClient params={{ id: resolvedParams.id }} />
    </Suspense>
  );
} 