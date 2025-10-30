/**
 * Generar PDF del CV con texto real (no imagen) usando jsPDF v2.5+
 * Compatible con contenido multipágina y fuentes personalizadas.
 */
window.jsPDF = window.jspdf.jsPDF;

async function downloadPDF() {
  const element = document.getElementById('cv');
  const filename = 'Julio_Sarauz_CV.pdf';
  const btn = document.getElementById('btnPDF');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
  btn.disabled = true;

  try {
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    await pdf.html(element, {
      callback: (pdf) => {
        pdf.save(filename);
      },
      x: 10,
      y: 10,
      html2canvas: {
        scale: 1, // menor escala → menos peso, suficiente para texto
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      },
      autoPaging: 'text', // genera múltiples páginas si el contenido lo requiere
      margin: [10, 10, 10, 10],
    });

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error al generar PDF.';
  } finally {
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar CV en PDF';
      btn.disabled = false;
    }, 3000);
  }
}
