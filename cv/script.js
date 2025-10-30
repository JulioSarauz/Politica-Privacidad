 async function downloadPDF() {
      const element = document.getElementById("cv");
      const button = document.getElementById("btnPDF"); 
      button.style.display = "none";
      await new Promise(resolve => setTimeout(resolve, 50));
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "pt", "a4");
      const marginTop = 5;
      const marginBottom = 40;
      const marginLeft = 30;
      const marginRight = 30;
      const pageWidth = pdf.internal.pageSize.getWidth() - marginLeft - marginRight;
      const pageHeight = pdf.internal.pageSize.getHeight() - marginTop - marginBottom;
      const canvas = await html2canvas(element, {
        scale: 5, 
        useCORS: true,
        scrollY: -window.scrollY,
        backgroundColor: "#ffffff",
        logging: false,
        width: element.scrollWidth,
        windowWidth: document.documentElement.offsetWidth
      });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      let heightLeft = imgHeight;
      let position = marginTop;
      pdf.addImage(imgData, "PNG", marginLeft, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + marginTop;
        pdf.addImage(imgData, "PNG", marginLeft, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }
      pdf.save("CV_Julio_Sarauz.pdf");
      button.style.display = "block";
    }