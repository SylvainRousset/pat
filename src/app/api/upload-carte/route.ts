import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    if (!fileName || !['carteacc1.avif', 'carteacc2.avif'].includes(fileName)) {
      return NextResponse.json(
        { error: 'Nom de fichier invalide' },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Chemin vers le dossier public/images
    const publicPath = path.join(process.cwd(), 'public', 'images', fileName);

    // Écrire le fichier
    await writeFile(publicPath, buffer);

    return NextResponse.json({ 
      success: true,
      message: `Image ${fileName} mise à jour avec succès`,
      path: `/images/${fileName}`
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'image' },
      { status: 500 }
    );
  }
}

