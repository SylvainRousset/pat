import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

interface Params {
  id: string;
}

interface PageProps {
  params: Params;
  searchParams?: Record<string, string | string[]>;
}

export default function ProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductDetailClient params={params} />
    </Suspense>
  );
} 