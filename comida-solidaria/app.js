function showTab(tabName, btnElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
}

document.getElementById('form-venta').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectVendedor = document.getElementById('nombre-vendedor');
    const codigoVendedor = selectVendedor.value;
    const nombreVendedor = selectVendedor.options[selectVendedor.selectedIndex].text;
    
    const cedulaComprador = document.getElementById('cedula-comprador').value;
    const nombreComprador = document.getElementById('nombre-comprador').value;
    const telefonoComprador = document.getElementById('telefono-comprador').value;
    const direccionComprador = document.getElementById('direccion-comprador').value;
    
    const inputPedido = document.getElementById('pedido');
    const pedido = inputPedido ? inputPedido.value : 'Comida Solidaria';
    const idUnico = 'TKT-' + Date.now();

    const datosBoleto = {
        id: idUnico,
        codigoVendedor: codigoVendedor,
        vendedor: nombreVendedor,
        cedula: cedulaComprador,
        comprador: nombreComprador,
        telefono: telefonoComprador,
        direccion: direccionComprador,
        pedido: pedido,
        fecha: new Date().toLocaleString()
    };

    const llave = "muña"; 
    const stringDatos = JSON.stringify(datosBoleto);
    const datosEncriptados = CryptoJS.AES.encrypt(stringDatos, llave).toString();

    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = "";
    
    new QRCode(qrContainer, {
        text: datosEncriptados,
        width: 256,
        height: 256,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    setTimeout(() => {
        const qrCanvasElement = document.querySelector('#qrcode canvas');
        const qrImgElement = document.querySelector('#qrcode img');
        let qrDataUrl = '';
        
        if (qrCanvasElement) {
            qrDataUrl = qrCanvasElement.toDataURL();
        } else if (qrImgElement && qrImgElement.src) {
            qrDataUrl = qrImgElement.src;
        }

        const comidaImg = new Image();
        comidaImg.src = '/comida-solidaria/public/comida.png';
        comidaImg.onload = () => {
            const canvas = document.createElement('canvas');
            const padding = 40;
            
            const targetHeight = comidaImg.height; 
            const qrDrawSize = targetHeight; 
            const imgDrawWidth = qrDrawSize * 2; 
            const imgDrawHeight = targetHeight;
            
            canvas.width = padding + imgDrawWidth + padding + qrDrawSize + padding;
            canvas.height = padding + targetHeight + padding;
            
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.drawImage(comidaImg, padding, padding, imgDrawWidth, imgDrawHeight);
            
            const qrImg = new Image();
            qrImg.src = qrDataUrl;
            qrImg.onload = () => {
                const qrX = padding + imgDrawWidth + padding;
                ctx.drawImage(qrImg, qrX, padding, qrDrawSize, qrDrawSize);
                
                const finalDataUrl = canvas.toDataURL('image/png');
                document.getElementById('final-ticket-img').src = finalDataUrl;
                document.getElementById('qr-result').style.display = 'block';
                
                document.getElementById('btn-descargar').onclick = () => {
                    const link = document.createElement('a');
                    link.download = `Boleto-${idUnico}.png`;
                    link.href = finalDataUrl;
                    link.click();
                };
                
                document.getElementById('btn-whatsapp').onclick = async () => {
                    if (navigator.share) {
                        try {
                            const res = await fetch(finalDataUrl);
                            const blob = await res.blob();
                            const file = new File([blob], `Boleto-${idUnico}.png`, { type: 'image/png' });
                            await navigator.share({
                                title: 'Boleto Comida Solidaria',
                                files: [file]
                            });
                        } catch(err) {
                        }
                    } else {
                        alert('Tu navegador no permite compartir directamente. Presiona "Descargar" y envíalo manualmente.');
                    }
                };
            };
        };
        
        comidaImg.onerror = () => {
            alert('Asegúrate de que la imagen exista en la ruta: public/comida.png');
        }
    }, 250);

    this.reset();
});

const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);

function onScanSuccess(decodedText, decodedResult) {
    const clave = document.getElementById('clave-acceso').value;
    const divResultado = document.getElementById('resultado-validacion');

    if (clave !== "muña") {
        divResultado.innerHTML = `<p style="color: red;">Error: Llave de desencriptación incorrecta o vacía.</p>`;
        return;
    }

    try {
        const bytes = CryptoJS.AES.decrypt(decodedText, clave);
        const datosDesencriptados = bytes.toString(CryptoJS.enc.Utf8);
        
        if(!datosDesencriptados) throw new Error("Fallo");

        const boleto = JSON.parse(datosDesencriptados);

        divResultado.innerHTML = `
            <div class="success-card">
                <h3>✅ Boleto Válido</h3>
                <p><strong>ID:</strong> ${boleto.id}</p>
                <p><strong>Comprador:</strong> ${boleto.comprador}</p>
                <p><strong>Cédula:</strong> ${boleto.cedula}</p>
                <p><strong>Teléfono:</strong> ${boleto.telefono}</p>
                <p><strong>Dirección:</strong> ${boleto.direccion || 'N/A'}</p>
                <hr style="margin: 10px 0; border: 0; border-top: 1px solid #b2f2bb;">
                <p><strong>Pedido:</strong> ${boleto.pedido}</p>
                <p><strong>Vendedor:</strong> ${boleto.vendedor} (${boleto.codigoVendedor})</p>
                <p><strong>Fecha:</strong> ${boleto.fecha}</p>
            </div>
        `;
        
        html5QrcodeScanner.pause(true);
        setTimeout(() => html5QrcodeScanner.resume(), 5000);

    } catch (error) {
        divResultado.innerHTML = `<p style="color: red;">Error: El código QR no es válido o está corrupto.</p>`;
    }
}

function onScanFailure(error) {
}

html5QrcodeScanner.render(onScanSuccess, onScanFailure);