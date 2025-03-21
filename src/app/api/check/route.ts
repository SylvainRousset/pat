import { NextResponse } from 'next/server';

// Simple API pour vérifier si les API fonctionnent sur Vercel
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'L\'API fonctionne correctement!',
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasFirebaseConfig: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        vercelEnv: process.env.VERCEL_ENV || 'non défini'
      }
    });
  } catch (error) {
    console.error('Erreur dans l\'API de test:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue', details: (error as Error).message },
      { status: 500 }
    );
  }
} 