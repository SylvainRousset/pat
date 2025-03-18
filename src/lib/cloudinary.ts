import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'votre-cloud-name',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || 'votre-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'votre-api-secret',
  secure: true
});

// Fonction pour télécharger une image vers Cloudinary
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Convertir le fichier en base64
    const base64data = await fileToBase64(file);
    
    // Télécharger l'image vers Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64data,
        {
          folder: 'patisserie',
          resource_type: 'image',
          public_id: `product_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    // Retourner l'URL de l'image
    return result.secure_url;
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image vers Cloudinary:', error);
    throw new Error('Erreur lors du téléchargement de l\'image');
  }
};

// Fonction pour supprimer une image de Cloudinary
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extraire le public_id de l'URL
    // Format typique: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/patisserie/product_1234567890.jpg
    const urlParts = imageUrl.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const filename = filenameWithExtension.split('.')[0]; // Enlever l'extension
    
    // Construire le public_id complet (avec le dossier)
    const folderName = urlParts[urlParts.length - 2];
    const publicId = `${folderName}/${filename}`;
    
    console.log('Suppression de l\'image avec public_id:', publicId);
    
    // Supprimer l'image de Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    console.log('Résultat de la suppression:', result);
    
    // Vérifier si la suppression a réussi
    return result.result === 'ok';
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image de Cloudinary:', error);
    return false;
  }
};

// Fonction pour convertir un fichier en base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default cloudinary; 