async function downloadPDF() {
  const button = document.getElementById('btnPDF');
  const originalText = button.innerHTML;

  try {
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    const cvElement = document.getElementById('cv');
    const canvas = await html2canvas(cvElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 794,
      windowHeight: 1123,
    });
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= pageHeight;
    }
    pdf.save('CV_Julio_Cesar_Sarauz.pdf');
    showNotification('PDF descargado correctamente', 'success');

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    showNotification('Error al generar el PDF. Por favor, intenta nuevamente.', 'error');
  } finally {

    button.disabled = false;
    button.innerHTML = originalText;
  }
}


function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}


function checkLibraries() {
  if (typeof html2canvas === 'undefined') {
    console.error('html2canvas no está cargado');
    showNotification('Error: Librería html2canvas no disponible', 'error');
    return false;
  }
  if (typeof window.jspdf === 'undefined') {
    console.error('jsPDF no está cargado');
    showNotification('Error: Librería jsPDF no disponible', 'error');
    return false;
  }
  return true;
}


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!checkLibraries()) {
      const button = document.getElementById('btnPDF');
      if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error: Librerías no cargadas';
      }
    }
  }, 500);
});