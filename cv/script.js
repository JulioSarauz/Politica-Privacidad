/**
 * Función para descargar el CV como PDF usando html2canvas y jsPDF.
 * Lógica ajustada para manejar posibles múltiples páginas A4 y COMPRIMIR el PDF
 * para evitar que supere los 40 MB.
 */
window.jsPDF = window.jspdf.jsPDF;

function downloadPDF() {
    const element = document.getElementById('cv');
    const filename = 'Julio_Sarauz_CV.pdf';
    const btn = document.getElementById('btnPDF');

    // --- CONFIGURACIÓN DE COMPRESIÓN ---
    // Ajustar la escala: 
    // 1. Una escala de 1 o 2 es suficiente para un CV. 
    // 2. Una escala de 3, como la tenías, genera archivos muy grandes.
    const SCALE_FACTOR = 2; 
    
    // Calidad del JPEG (0 a 1). 0.8 es una buena compresión sin pérdida de calidad notable.
    const JPEG_QUALITY = 0.8; 
    // ------------------------------------

    // Mostrar indicador de carga
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF...';
    btn.disabled = true;

    // Usar escala ajustada para mejor resolución sin exagerar el tamaño
    html2canvas(element, {
        scale: SCALE_FACTOR, // Reducido a 2 para compresión
        logging: true,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
    }).then(canvas => {
        try {
            // ** CAMBIO CLAVE 1: Convertir a JPEG con compresión **
            const imgData = canvas.toDataURL('image/jpeg', JPEG_QUALITY); 
            
            // Si el JPEG tiene transparencia o áreas blancas/negras muy definidas, el PNG puede ser mejor, 
            // pero el JPEG reduce drásticamente el tamaño del archivo.

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // Ancho A4 en mm
            const pageHeight = 297; // Alto A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Añadir la primera página
            // ** CAMBIO CLAVE 2: Especificar 'JPEG' como formato para jsPDF **
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight); 
            heightLeft -= pageHeight;

            // Bucle para añadir páginas adicionales si el contenido es demasiado largo
            while (heightLeft >= -1) { 
                position = heightLeft - imgHeight;
                pdf.addPage();
                // ** CAMBIO CLAVE 2: Especificar 'JPEG' como formato para jsPDF **
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight); 
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