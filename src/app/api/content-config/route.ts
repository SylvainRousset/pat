import { NextRequest, NextResponse } from 'next/server';
import { getContentConfig, updateContentConfig } from '@/lib/firebaseAdmin';

// GET - Récupérer la configuration du contenu
export async function GET() {
  try {
    const config = await getContentConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la configuration' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour la configuration du contenu
export async function PUT(request: NextRequest) {
  try {
    const configData = await request.json();
    console.log('Données reçues pour mise à jour:', configData);
    
    // Validation simple - au moins un champ doit être fourni
    if (!configData.seasonalFlavorsImage && !configData.eventCard1Image && !configData.eventCard2Image && 
        !configData.carteAccueil1Image && !configData.carteAccueil2Image) {
      console.log('Validation échouée: aucun champ fourni');
      return NextResponse.json(
        { error: 'Au moins un champ de configuration doit être fourni' },
        { status: 400 }
      );
    }
    
    console.log('Tentative de mise à jour de la configuration...');
    const updatedConfig = await updateContentConfig(configData);
    console.log('Configuration mise à jour avec succès:', updatedConfig);
    
    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    return NextResponse.json(
      { error: `Erreur serveur lors de la mise à jour de la configuration: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
