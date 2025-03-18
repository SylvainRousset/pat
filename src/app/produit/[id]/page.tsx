import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

// Définition d'un type compatible avec Next.js 15
type PageProps = {
  params: Promise<{ id: string }> | { id: string }
  searchParams?: Promise<Record<string, string | string[]>> | Record<string, string | string[]>
}

export default async function ProductPage({ params }: PageProps) {
  // Résoudre la promesse si params est une Promise
  const resolvedParams = params instanceof Promise ? await params : params;
  
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductDetailClient params={{ id: resolvedParams.id }} />
    </Suspense>
  );
} 