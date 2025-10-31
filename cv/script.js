/**
 * Función para descargar el CV como PDF. 
 * Usa jsPDF.html() para renderizar el contenido como texto vectorial real, 
 * en lugar de como una imagen (bitmap).
 */
window.jsPDF = window.jspdf.jsPDF;

function downloadPDF() {
    const element = document.getElementById('cv');
    const filename = 'Julio_Sarauz_CV.pdf';
    const btn = document.getElementById('btnPDF');

    // Mostrar indicador de carga
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando PDF (Texto)...';
    btn.disabled = true;

    // Crear la instancia de jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Opciones de configuración
    const options = {
        callback: function (doc) {
            // Guardar el archivo después de que la conversión esté completa
            doc.save(filename);
            
            // Restaurar el botón en el 'finally' simulado
            btn.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar CV en PDF';
            btn.disabled = false;
        },
        margin: [10, 10, 10, 10], // Márgenes [top, right, bottom, left]
        autoPaging: 'text', // Permite que el texto se divida automáticamente en páginas
        x: 0,
        y: 0,
        width: 190, // Ancho interno del documento A4 (210 - 2*10 de margen)
        windowWidth: 794, // Ancho de la ventana que simula (similar al ancho de A4 en px a 96dpi)
        html2canvas: { // Opciones si aún se necesita un canvas para gráficos complejos
            scale: 0.8 // Baja escala para mejorar la velocidad y reducir el peso de las imágenes incrustadas
        }
    };

    // Usar el método html() de jsPDF para renderizar el contenido
    pdf.html(element, options)
        .catch(error => {
            console.error("Error generating PDF:", error);
            
            let userMessage = 'Error al generar PDF. Asegúrese de que el HTML esté bien estructurado.';
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + userMessage;
        })
        .finally(() => {
            // Restaurar el botón solo si la descarga falla o ya terminó
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar CV en PDF';
                btn.disabled = false;
            }, 5000); 
        });
}