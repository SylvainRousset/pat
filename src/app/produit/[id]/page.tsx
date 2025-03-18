import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductPage({ params }: {
  params?: { id: string } | Promise<{ id: string }>
}) {
  // Résoudre la promesse si params est une Promise
  const resolvedParams = params instanceof Promise ? await params : (params || { id: '' });
  
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductDetailClient params={{ id: resolvedParams.id }} />
    </Suspense>
  );
} 