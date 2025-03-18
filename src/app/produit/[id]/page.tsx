import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';

type Props = {
  params: { id: string }
}

export default function ProductPage(props: Props) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProductDetailClient params={props.params} />
    </Suspense>
  );
} 