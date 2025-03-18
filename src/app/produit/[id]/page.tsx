import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

type Params = {
  id: string
}

export default function ProductPage(props: { params: Params }) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductDetailClient params={props.params} />
    </Suspense>
  );
} 