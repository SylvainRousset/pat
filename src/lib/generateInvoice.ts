import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Étendre le type jsPDF pour inclure lastAutoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  flavor?: string;
  selectedFlavors?: string[];
  portions?: string;
}

interface Order {
  id: string;
  orderId: string;
  clientInfo: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
  orderDetails: {
    dateRetrait: string;
    heureRetrait: string;
  };
  cartItems: OrderItem[];
  totalPrice: string;
  status: string;
  createdAt?: { seconds: number };
}

export const generateInvoice = (order: Order) => {
  // Créer un nouveau document PDF
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Couleurs du thème
  const primaryColor: [number, number, number] = [165, 81, 32]; // #a75120
  const textColor: [number, number, number] = [66, 21, 0]; // #421500
  const lightBg: [number, number, number] = [248, 245, 240]; // #f8f5f0

  // En-tête avec logo et informations de la pâtisserie
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Pâtisserie Artisanale', 105, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Le Coquelicot', 105, 22, { align: 'center' });
  doc.text('contact@patisserie-lecoquelicot.fr', 105, 28, { align: 'center' });
  doc.text('Tél: 06 XX XX XX XX', 105, 34, { align: 'center' });

  // Titre de la facture
  doc.setTextColor(...textColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURE', 20, 55);

  // Numéro de commande et date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° Commande: ${order.orderId}`, 20, 65);
  
  const dateCommande = order.createdAt
    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR');
  doc.text(`Date: ${dateCommande}`, 20, 71);

  // Informations client
  doc.setFillColor(...lightBg);
  doc.rect(120, 50, 70, 35, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENT', 125, 58);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.clientInfo.prenom} ${order.clientInfo.nom}`, 125, 65);
  doc.text(`${order.clientInfo.email}`, 125, 70);
  doc.text(`${order.clientInfo.telephone}`, 125, 75);
  doc.text(`Retrait: ${order.orderDetails.dateRetrait}`, 125, 80);

  // Tableau des articles
  const tableData = order.cartItems.map((item) => {
    const details = [];
    if (item.flavor) details.push(`Saveur: ${item.flavor}`);
    if (item.selectedFlavors && item.selectedFlavors.length > 0) {
      details.push(`Saveurs: ${item.selectedFlavors.join(', ')}`);
    }
    if (item.portions) details.push(`Portions: ${item.portions}`);

    return [
      item.name + (details.length > 0 ? '\n' + details.join('\n') : ''),
      item.quantity.toString(),
      `${item.price} €`,
      `${(parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) * item.quantity).toFixed(2)} €`,
    ];
  });

  autoTable(doc, {
    startY: 95,
    head: [['Produit', 'Qté', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: textColor,
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: lightBg,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
  });

  // Récupérer la position Y après le tableau
  const finalY = doc.lastAutoTable?.finalY || 95;

  // Total
  doc.setFillColor(...primaryColor);
  doc.rect(130, finalY + 10, 60, 12, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL TTC', 135, finalY + 18);
  
  const totalPrice = order.totalPrice.replace(/[€\s]/g, '').trim();
  doc.text(`${totalPrice} €`, 185, finalY + 18, { align: 'right' });

  // Pied de page
  doc.setTextColor(...textColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const footerY = finalY + 40;
  doc.text('Merci pour votre commande !', 105, footerY, { align: 'center' });
  doc.text('Pâtisserie artisanale - Produits frais et faits maison', 105, footerY + 5, { align: 'center' });

  // Ligne de séparation
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, footerY + 10, 190, footerY + 10);

  // Informations légales en bas de page
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('TVA non applicable - Article 293 B du CGI', 105, 280, { align: 'center' });
  doc.text('Conditions de paiement : Paiement à la commande', 105, 285, { align: 'center' });

  // Sauvegarder le PDF
  doc.save(`Facture_${order.orderId}_${order.clientInfo.nom}.pdf`);
};

