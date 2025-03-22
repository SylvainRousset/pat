import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Variables d'environnement Cloudinary
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    // Informations sur les variables d'environnement
    const envInfo = {
      cloudName: cloudName ? `${cloudName.substring(0, 3)}...` : 'non défini',
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'non défini',
      apiSecret: apiSecret ? 'défini (masqué)' : 'non défini',
      nodeEnv: process.env.NODE_ENV,
    };
    
    // Configuration de Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    
    // Test de ping Cloudinary
    const pingResult = await cloudinary.api.ping();
    
    return res.status(200).json({ 
      success: true, 
      envInfo,
      pingResult,
      message: 'Configuration Cloudinary OK'
    });
  } catch (error) {
    console.error('Erreur de test Cloudinary:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      message: 'Échec de la configuration Cloudinary'
    });
  }
} 