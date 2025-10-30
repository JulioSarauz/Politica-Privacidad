  /**
     * Función para descargar el CV como PDF usando html2canvas y jsPDF.
     * La lógica ha sido ajustada para manejar posibles múltiples páginas A4.
     */
    window.jsPDF = window.jspdf.jsPDF;

    function downloadPDF() {
      const element = document.getElementById('cv');
      const filename = 'Julio_Sarauz_CV.pdf';
      const btn = document.getElementById('btnPDF');

      // Mostrar indicador de carga
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
      btn.disabled = true;

      // Usar escala superior para mejor resolución
      html2canvas(element, {
        scale: 3,
        logging: true,
        useCORS: true,
        allowTaint: true, // Advertencia: 'allowTaint: true' no evita SecurityError con toDataURL
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      }).then(canvas => {
        // *** POSIBLE PUNTO DE FALLO: Si canvas está 'tainted', toDataURL fallará aquí. ***
        try {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Añadir la primera página
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Bucle para añadir páginas adicionales si el contenido es demasiado largo
            while (heightLeft >= -1) { 
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }

            pdf.save(filename);

        } catch (dataURLError) {
            // Manejar el error de toDataURL específicamente
            throw new Error("Error de Seguridad/CORS: El canvas contiene recursos externos ('tainted') y no se puede exportar a imagen. Verifique los enlaces de iconos/imágenes.");
        }

      }).catch(error => {
        console.error("Error generating PDF:", error);
        
        // Mostrar mensaje de error al usuario
        let userMessage = 'Error al generar PDF. Causa: Problema de seguridad (CORS) con recursos externos (imágenes/iconos).';
        if (error.message.includes('SecurityError') || error.message.includes('CORS')) {
             userMessage = 'Error de seguridad (CORS). Verifique que sus iconos y/o imágenes se carguen de la misma fuente.';
        }
        
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + userMessage;
      }).finally(() => {
        // Restaurar el botón
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar CV en PDF';
          btn.disabled = false;
        }, 5000); // 5 segundos para que el usuario lea el error.
      });
    }