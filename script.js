// ===== VARIABLES GLOBALES =====
let clients = [];
let currentTestimonial = 0;
const totalTestimonials = 6;
let carouselInterval;

// ===== FUNCIONES DE CAPITALIZACIÓN =====
function capitalizeName(name) {
    return name.split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
}

// ===== FUNCIONES DE VALIDACIÓN =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return re.test(phone);
}

function validateGoogleMapsUrl(url) {
    return url.includes('maps.google.com') || url.includes('goo.gl') || url.includes('maps.app.goo.gl');
}

// ===== FUNCIONES DE UI PARA VALIDACIÓN =====
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showFieldSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    errorDiv.style.display = 'none';
}

function clearValidation(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.remove('error', 'success');
    errorDiv.style.display = 'none';
}

// ===== VALIDACIÓN COMPLETA DE FORMULARIOS =====
function validateBusinessConfig() {
    let isValid = true;
    
    const businessName = document.getElementById('business-name').value.trim();
    const businessType = document.getElementById('business-type').value.trim();
    const googleMapsLink = document.getElementById('google-maps-link').value.trim();

    if (!businessName) {
        showFieldError('business-name', 'El nombre del negocio es obligatorio');
        isValid = false;
    } else if (businessName.length < 2) {
        showFieldError('business-name', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    } else {
        showFieldSuccess('business-name');
    }

    if (!businessType) {
        showFieldError('business-type', 'El tipo de negocio es obligatorio');
        isValid = false;
    } else {
        showFieldSuccess('business-type');
    }

    if (!googleMapsLink) {
        showFieldError('google-maps-link', 'El link de Google Maps es obligatorio');
        isValid = false;
    } else if (!validateGoogleMapsUrl(googleMapsLink)) {
        showFieldError('google-maps-link', 'Debe ser un link válido de Google Maps');
        isValid = false;
    } else {
        showFieldSuccess('google-maps-link');
    }

    return isValid;
}

function validateClientForm() {
    let isValid = true;
    
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();

    if (!name) {
        showFieldError('client-name', 'El nombre es obligatorio');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('client-name', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    } else {
        showFieldSuccess('client-name');
    }

    if (!phone) {
        showFieldError('client-phone', 'El teléfono es obligatorio');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showFieldError('client-phone', 'Formato de teléfono inválido');
        isValid = false;
    } else {
        showFieldSuccess('client-phone');
    }

    if (!email) {
        showFieldError('client-email', 'El email es obligatorio');
        isValid = false;
    } else if (!validateEmail(email)) {
        showFieldError('client-email', 'Formato de email inválido');
        isValid = false;
    } else if (clients.some(client => client.email.toLowerCase() === email.toLowerCase())) {
        showFieldError('client-email', 'Este email ya fue agregado');
        isValid = false;
    } else {
        showFieldSuccess('client-email');
    }

    return isValid;
}

// ===== VALIDACIÓN DE CAMPOS INDIVIDUALES =====
function validateBusinessField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    if (fieldId === 'business-name') {
        if (!value) {
            showFieldError(fieldId, 'El nombre del negocio es obligatorio');
        } else if (value.length < 2) {
            showFieldError(fieldId, 'El nombre debe tener al menos 2 caracteres');
        } else {
            showFieldSuccess(fieldId);
        }
    } else if (fieldId === 'business-type') {
        if (!value) {
            showFieldError(fieldId, 'El tipo de negocio es obligatorio');
        } else if (value.length < 2) {
            showFieldError(fieldId, 'El tipo debe tener al menos 2 caracteres');
        } else {
            showFieldSuccess(fieldId);
        }
    } else if (fieldId === 'google-maps-link') {
        if (!value) {
            showFieldError(fieldId, 'El link de Google Maps es obligatorio');
        } else if (!validateGoogleMapsUrl(value)) {
            showFieldError(fieldId, 'Debe ser un link válido de Google Maps');
        } else {
            showFieldSuccess(fieldId);
        }
    }
}

function validateClientField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    if (fieldId === 'client-name') {
        if (!value) {
            showFieldError(fieldId, 'El nombre es obligatorio');
        } else if (value.length < 2) {
            showFieldError(fieldId, 'El nombre debe tener al menos 2 caracteres');
        } else {
            showFieldSuccess(fieldId);
        }
    } else if (fieldId === 'client-phone') {
        if (!value) {
            showFieldError(fieldId, 'El teléfono es obligatorio');
        } else if (!validatePhone(value)) {
            showFieldError(fieldId, 'Formato de teléfono inválido (ej: +54 9 11 1234-5678)');
        } else {
            showFieldSuccess(fieldId);
        }
    } else if (fieldId === 'client-email') {
        if (!value) {
            showFieldError(fieldId, 'El email es obligatorio');
        } else if (!validateEmail(value)) {
            showFieldError(fieldId, 'Formato de email inválido');
        } else if (clients.some(client => client.email.toLowerCase() === value.toLowerCase())) {
            showFieldError(fieldId, 'Este email ya fue agregado');
        } else {
            showFieldSuccess(fieldId);
        }
    }
}

// ===== GESTIÓN DE CLIENTES =====
function addClient() {
    if (!validateClientForm()) {
        return;
    }

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();

    const client = { 
        name: capitalizeName(name), 
        phone, 
        email: email.toLowerCase(), 
        id: Date.now(),
        sent: false
    };
    clients.push(client);
    
    ['client-name', 'client-phone', 'client-email'].forEach(fieldId => {
        document.getElementById(fieldId).value = '';
        clearValidation(fieldId);
    });
    
    updateClientsList();
    showSuccessMessage('¡Cliente agregado exitosamente! 🎉');
}

function updateClientsList() {
    const container = document.getElementById('clients-list');
    const actionsContainer = document.getElementById('clients-actions');
    
    if (clients.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No hay clientes agregados aún</p>';
        actionsContainer.style.display = 'none';
        return;
    }

    actionsContainer.style.display = 'block';

    const pendingClients = clients.filter(client => !client.sent).length;
    const sentClients = clients.filter(client => client.sent).length;

    container.innerHTML = `
        <div style="background: #e3f2fd; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
            <strong>📊 Resumen:</strong> ${clients.length} clientes total | 
            <span style="color: #28a745;">${sentClients} enviados</span> | 
            <span style="color: #667eea;">${pendingClients} pendientes</span>
        </div>
        ${clients.map(client => `
            <div class="client-item ${client.sent ? 'sent' : ''}">
                <div class="client-info">
                    <strong>${client.name}</strong><br>
                    ${client.phone} • ${client.email}
                    ${client.sent ? '<br><small style="color: #28a745; font-weight: 600;">✅ Email enviado</small>' : ''}
                </div>
                <div>
                    ${!client.sent ? 
                        `<button onclick="sendReviewEmail(${client.id})" class="send-btn">Enviar Email</button>` :
                        `<button class="send-btn" disabled>Email enviado ✅</button>`
                    }
                    <button onclick="removeClient(${client.id})" class="remove-btn">Eliminar</button>
                </div>
            </div>
        `).join('')}
    `;
}

function removeClient(id) {
    clients = clients.filter(client => client.id !== id);
    updateClientsList();
}

function removeAll() {
    if (clients.length === 0) {
        alert('ℹ️ No hay clientes para eliminar');
        return;
    }

    if (!confirm(`¿Eliminar todos los ${clients.length} clientes de la lista?`)) {
        return;
    }

    clients = [];
    updateClientsList();
    showSuccessMessage('🗑️ Todos los clientes eliminados');
}

// ===== ENVÍO DE EMAILS =====
function sendReviewEmail(clientId) {
    if (!validateBusinessConfig()) {
        alert('⚠️ Por favor completa correctamente la configuración del negocio antes de enviar emails');
        return;
    }

    const client = clients.find(c => c.id === clientId);
    const businessName = document.getElementById('business-name').value.trim();
    const businessType = document.getElementById('business-type').value.trim();
    const googleMapsLink = document.getElementById('google-maps-link').value.trim();

    // Obtener mensaje según el plan
    let customMessage;
    const planType = localStorage.getItem('premium_planType');
    
    if (planType === 'Pro') {
        customMessage = localStorage.getItem('premium_customMessage') || 
            'Nos encantaría conocer tu experiencia y que compartas tu opinión con otros clientes potenciales. Tu reseña nos ayuda a seguir mejorando cada día.';
    } else {
        customMessage = 'Nos encantaría conocer tu experiencia y que compartas tu opinión con otros clientes potenciales. Tu reseña nos ayuda a seguir mejorando cada día.';
    }

    showLoadingOverlay();

    fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to_email: client.email,
            to_name: client.name,
            business_name: businessName,
            business_type: businessType,
            google_maps_url: googleMapsLink,
            custom_message: customMessage
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingOverlay();
        
        if (data.success) {
            const clientIndex = clients.findIndex(c => c.id === clientId);
            if (clientIndex !== -1) {
                clients[clientIndex].sent = true;
            }
            
            updateClientsList();
            showSuccessMessage(`¡Email enviado exitosamente a ${client.name}! 🎉📧`);
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        hideLoadingOverlay();
        showErrorMessage(`Error al enviar email a ${client.name}: ${error.message}`);
    });
}

function sendToAll() {
    if (!validateBusinessConfig()) {
        alert('⚠️ Por favor completa correctamente la configuración del negocio antes de enviar emails');
        return;
    }

    const pendingClients = clients.filter(client => !client.sent);
    
    if (pendingClients.length === 0) {
        alert('ℹ️ No hay clientes pendientes para enviar emails');
        return;
    }

    if (!confirm(`¿Enviar emails a ${pendingClients.length} clientes pendientes?`)) {
        return;
    }

    const businessName = document.getElementById('business-name').value.trim();
    const businessType = document.getElementById('business-type').value.trim();
    const googleMapsLink = document.getElementById('google-maps-link').value.trim();

    showLoadingOverlay();
    let successCount = 0;
    let errorCount = 0;

    // Función recursiva asíncrona para enviar emails uno por uno
    const sendNextEmail = async (index) => {
        if (index >= pendingClients.length) {
            hideLoadingOverlay();
            updateClientsList();
            
            if (successCount > 0 && errorCount === 0) {
                showSuccessMessage(`¡Todos los emails enviados exitosamente! (${successCount}/${pendingClients.length})`);
            } else if (successCount > 0) {
                showSuccessMessage(`Proceso completado: ${successCount} enviados, ${errorCount} errores`);
            } else {
                showErrorMessage(`No se pudo enviar ningún email. Revisa la configuración.`);
            }
            return;
        }

        const client = pendingClients[index];
        
        // Obtener mensaje según el plan
        let customMessage;
        const planType = localStorage.getItem('premium_planType');
        
        if (planType === 'Pro') {
            customMessage = localStorage.getItem('premium_customMessage') || 
                'Nos encantaría conocer tu experiencia y que compartas tu opinión con otros clientes potenciales.';
        } else {
            customMessage = 'Nos encantaría conocer tu experiencia y que compartas tu opinión con otros clientes potenciales.';
        }
        
        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to_email: client.email,
                    to_name: client.name,
                    business_name: businessName,
                    business_type: businessType,
                    google_maps_url: googleMapsLink,
                    custom_message: customMessage
                })
            });

            const data = await response.json();

            if (data.success) {
                console.log(`Email ${index + 1} enviado exitosamente a:`, client.name);
                successCount++;
                
                const clientIndex = clients.findIndex(c => c.id === client.id);
                if (clientIndex !== -1) {
                    clients[clientIndex].sent = true;
                }
            } else {
                throw new Error(data.error || 'Error desconocido');
            }
        } catch (error) {
            console.error(`Error enviando email ${index + 1} a:`, client.name, error);
            errorCount++;
        }

        // Esperar 1 segundo y continuar con el siguiente
        setTimeout(() => sendNextEmail(index + 1), 1000);
    };

    // Iniciar el envío desde el índice 0
    sendNextEmail(0);
}

// ===== MANEJO DE ARCHIVOS =====
function handleFileUpload(event) {
    const file = event.target.files[0];
    const statusDiv = document.getElementById('file-status');
    
    if (!file) return;

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
        statusDiv.innerHTML = '<span style="color: #dc3545;">❌ Formato no válido. Use Excel (.xlsx, .xls) o CSV</span>';
        return;
    }

    statusDiv.innerHTML = '<span style="color: #ffc107;">⏳ Procesando archivo...</span>';

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let data;
            
            if (fileExtension === 'csv') {
                const text = e.target.result;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                
                data = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] ? values[index].trim() : '';
                    });
                    return row;
                }).filter(row => row.nombre || row.name);
                
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                data = XLSX.utils.sheet_to_json(worksheet);
            }

            processImportedData(data, fileName);
            
        } catch (error) {
            console.error('Error procesando archivo:', error);
            statusDiv.innerHTML = '<span style="color: #dc3545;">❌ Error al procesar el archivo</span>';
        }
    };

    if (fileExtension === 'csv') {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

function processImportedData(data, fileName) {
    const statusDiv = document.getElementById('file-status');
    let imported = 0;
    let errors = [];

    console.log('=== IMPORTACIÓN ===');
    console.log('Archivo:', fileName);
    console.log('Número de filas:', data.length);

    if (data.length === 0) {
        statusDiv.innerHTML = '<span style="color: #dc3545;">❌ El archivo está vacío</span>';
        return;
    }

    ['client-name', 'client-phone', 'client-email'].forEach(fieldId => {
        clearValidation(fieldId);
    });

    data.forEach((row, index) => {
        const rowKeys = Object.keys(row);
        
        let name = null;
        for (let key of rowKeys) {
            if (key && (
                key.toLowerCase() === 'nombre' ||
                key.toLowerCase() === 'name' ||
                key.toLowerCase().includes('nombre') ||
                key.toLowerCase().includes('name')
            )) {
                name = row[key];
                break;
            }
        }

        let phone = null;
        for (let key of rowKeys) {
            if (key && (
                key.toLowerCase().includes('telefono') ||
                key.toLowerCase().includes('teléfono') ||
                key.toLowerCase().includes('phone') ||
                key.toLowerCase().includes('celular')
            )) {
                phone = row[key];
                break;
            }
        }

        let email = null;
        for (let key of rowKeys) {
            if (key && (
                key.toLowerCase().includes('email') ||
                key.toLowerCase().includes('mail') ||
                key.toLowerCase().includes('correo')
            )) {
                email = row[key];
                break;
            }
        }

        if (name && phone && email && name.toString().trim() && phone.toString().trim() && email.toString().trim()) {
            const nameStr = name.toString().trim();
            const phoneStr = phone.toString().trim();
            const emailStr = email.toString().trim();

            if (validateEmail(emailStr) && validatePhone(phoneStr)) {
                if (!clients.some(client => client.email.toLowerCase() === emailStr.toLowerCase())) {
                    clients.push({
                        name: capitalizeName(nameStr),
                        phone: phoneStr,
                        email: emailStr.toLowerCase(),
                        id: Date.now() + Math.random(),
                        sent: false
                    });
                    imported++;
                } else {
                    errors.push(`Fila ${index + 2}: Email duplicado`);
                }
            } else {
                errors.push(`Fila ${index + 2}: Email o teléfono inválido`);
            }
        } else if (name || phone || email) {
            const missing = [];
            if (!name || !name.toString().trim()) missing.push('Nombre');
            if (!phone || !phone.toString().trim()) missing.push('Teléfono');
            if (!email || !email.toString().trim()) missing.push('Email');
            
            errors.push(`Fila ${index + 2}: Faltan campos - ${missing.join(', ')}`);
        }
    });

    console.log(`Resultado: ${imported} importados, ${errors.length} errores`);

    if (imported > 0) {
        statusDiv.innerHTML = `
            <span style="color: #28a745;">✅ ${imported} clientes importados de "${fileName}"</span>
            ${errors.length > 0 ? `<br><span style="color: #ffc107;">⚠️ ${errors.length} filas con errores</span>` : ''}
        `;
        updateClientsList();
        showSuccessMessage(`¡${imported} clientes importados exitosamente! 🎉`);
    } else {
        statusDiv.innerHTML = `
            <span style="color: #dc3545;">❌ No se pudieron importar clientes.</span><br>
            <small style="color: #666;">
                Las columnas deben contener: <strong>Nombre, Teléfono, Email</strong>
            </small>
        `;
    }

    document.getElementById('file-upload').value = '';
}

// ===== UI HELPERS =====
function showLoadingOverlay() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoadingOverlay() {
    document.getElementById('loading-overlay').style.display = 'none';
}

function showSuccessMessage(message = '¡Email enviado exitosamente! 🎉') {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    document.getElementById('error-message').style.display = 'none';
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
    
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showErrorMessage(message = 'Error al enviar el email.') {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('success-message').style.display = 'none';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 8000);
    
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== CAROUSEL DE TESTIMONIOS =====
function initCarousel() {
    const dotsContainer = document.getElementById('carousel-dots');
    for (let i = 0; i < totalTestimonials; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToTestimonial(i);
        dotsContainer.appendChild(dot);
    }
}

function moveCarousel(direction) {
    currentTestimonial += direction;
    
    if (currentTestimonial < 0) {
        currentTestimonial = totalTestimonials - 1;
    } else if (currentTestimonial >= totalTestimonials) {
        currentTestimonial = 0;
    }
    
    updateCarousel();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.carousel-dot');
    
    track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ===== SISTEMA DE DETECCIÓN DE PLAN PREMIUM =====
function checkPremiumStatus() {
    const accessCode = localStorage.getItem('premium_accessCode');
    const planType = localStorage.getItem('premium_planType');
    const expirationDate = localStorage.getItem('premium_expirationDate');
    
    // Verificar si tiene plan activo y no expiró
    if (accessCode && expirationDate && new Date(expirationDate) > new Date()) {
        showPremiumInterface(accessCode, planType, expirationDate);
    } else {
        showBasicInterface();
    }
}

function showPremiumInterface(accessCode, planType, expirationDate) {
    // Mostrar banner premium si existe
    const premiumBanner = document.getElementById('premium-banner');
    if (premiumBanner) {
        premiumBanner.style.display = 'block';
        document.getElementById('premium-plan-name').textContent = `Plan ${planType}`;
        document.getElementById('premium-code-display').textContent = accessCode;
        
        const expDate = new Date(expirationDate);
        document.getElementById('premium-expiration-display').textContent = expDate.toLocaleDateString('es-AR');
        
        // Actualizar link al dashboard
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            dashboardLink.href = `dashboard.html?code=${accessCode}`;
        }
    }
    
    // Si es Plan Pro, mostrar editor
    if (planType === 'Pro') {
        document.getElementById('message-label-basic').style.display = 'none';
        document.getElementById('message-label-pro').style.display = 'inline';
        document.getElementById('message-basic').style.display = 'none';
        document.getElementById('message-pro').style.display = 'block';
        
        // Cargar mensaje guardado
        const savedMessage = localStorage.getItem('premium_customMessage');
        const textarea = document.getElementById('custom-message-editable');
        if (textarea) {
            if (savedMessage) {
                textarea.value = savedMessage;
            } else {
                textarea.value = 'Nos encantaría conocer tu experiencia y que compartas tu opinión con otros clientes potenciales. Tu reseña nos ayuda a seguir mejorando cada día.';
            }
            updateProPreview();
        }
    } else {
        // Plan Starter: mostrar versión básica
        showBasicInterface();
    }
}

function showBasicInterface() {
    const premiumBanner = document.getElementById('premium-banner');
    if (premiumBanner) {
        premiumBanner.style.display = 'none';
    }
    
    const labelBasic = document.getElementById('message-label-basic');
    const labelPro = document.getElementById('message-label-pro');
    const messageBasic = document.getElementById('message-basic');
    const messagePro = document.getElementById('message-pro');
    
    if (labelBasic) labelBasic.style.display = 'inline';
    if (labelPro) labelPro.style.display = 'none';
    if (messageBasic) messageBasic.style.display = 'block';
    if (messagePro) messagePro.style.display = 'none';
}

function syncMessageToDashboard() {
    const textarea = document.getElementById('custom-message-editable');
    const message = textarea.value.trim();
    
    if (!message) {
        alert('El mensaje no puede estar vacío');
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('premium_customMessage', message);
    
    // Mostrar confirmación
    const successMsg = document.getElementById('save-success-msg');
    if (successMsg) {
        successMsg.style.display = 'block';
        
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    }
}

function updateProPreview() {
    const textarea = document.getElementById('custom-message-editable');
    const preview = document.getElementById('pro-message-preview');
    const counter = document.getElementById('char-count-app');
    
    if (textarea && preview) {
        const message = textarea.value || 'Nos encantaría conocer tu experiencia y que compartas tu opinión con otros clientes potenciales. Tu reseña nos ayuda a seguir mejorando cada día.';
        preview.textContent = message;
    }
    
    if (textarea && counter) {
        counter.textContent = textarea.value.length;
    }
}

// ===== INICIALIZACIÓN AL CARGAR EL DOM =====
document.addEventListener('DOMContentLoaded', function() {
    updateClientsList();
    initCarousel();
    checkPremiumStatus();

    // Auto-play del carousel
    carouselInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000);

    // Pausar auto-play al hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(() => {
                moveCarousel(1);
            }, 5000);
        });
    }

    // Validación en tiempo real para campos de negocio
    document.getElementById('business-name').addEventListener('input', function() {
        if (this.value.trim()) validateBusinessField('business-name');
        else clearValidation('business-name');
    });

    document.getElementById('business-name').addEventListener('blur', function() {
        validateBusinessField('business-name');
    });
    
    document.getElementById('business-type').addEventListener('input', function() {
        if (this.value.trim()) validateBusinessField('business-type');
        else clearValidation('business-type');
    });

    document.getElementById('business-type').addEventListener('blur', function() {
        validateBusinessField('business-type');
    });
    
    document.getElementById('google-maps-link').addEventListener('input', function() {
        if (this.value.trim()) validateBusinessField('google-maps-link');
        else clearValidation('google-maps-link');
    });

    document.getElementById('google-maps-link').addEventListener('blur', function() {
        validateBusinessField('google-maps-link');
    });

    // Validación en tiempo real para campos de cliente
    document.getElementById('client-name').addEventListener('input', function() {
        if (this.value.trim()) validateClientField('client-name');
        else clearValidation('client-name');
    });

    document.getElementById('client-name').addEventListener('blur', function() {
        validateClientField('client-name');
    });
    
    document.getElementById('client-phone').addEventListener('input', function() {
        if (this.value.trim()) validateClientField('client-phone');
        else clearValidation('client-phone');
    });

    document.getElementById('client-phone').addEventListener('blur', function() {
        validateClientField('client-phone');
    });
    
    document.getElementById('client-email').addEventListener('input', function() {
        if (this.value.trim()) validateClientField('client-email');
        else clearValidation('client-email');
    });

    document.getElementById('client-email').addEventListener('blur', function() {
        validateClientField('client-email');
    });

    document.getElementById('client-email').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addClient();
        }
    });
});
// ===== SISTEMA DE DETECCIÓN DE PLAN PREMIUM =====

function checkPremiumStatus() {
    const accessCode = localStorage.getItem('premium_accessCode');
    const planType = localStorage.getItem('premium_planType');
    const expirationDate = localStorage.getItem('premium_expirationDate');
    
    // Verificar si tiene plan activo y no expiró
    if (accessCode && expirationDate && new Date(expirationDate) > new Date()) {
        showPremiumInterface(accessCode, planType, expirationDate);
    } else {
        showBasicInterface();
    }
}

function showPremiumInterface(accessCode, planType, expirationDate) {
    // Mostrar banner premium si existe
    const premiumBanner = document.getElementById('premium-banner');
    if (premiumBanner) {
        premiumBanner.style.display = 'block';
        document.getElementById('premium-plan-name').textContent = `Plan ${planType}`;
        document.getElementById('premium-code-display').textContent = accessCode;
        
        const expDate = new Date(expirationDate);
        document.getElementById('premium-expiration-display').textContent = expDate.toLocaleDateString('es-AR');
        
        // Actualizar link al dashboard
        const dashboardLink = document.getElementById('dashboard-link');
        if (dashboardLink) {
            dashboardLink.href = `dashboard.html?code=${accessCode}`;
        }
    }
    
    // Si es Plan Pro, mostrar editor
    if (planType === 'Pro') {
        document.getElementById('message-label-basic').style.display = 'none';
        document.getElementById('message-label-pro').style.display = 'inline';
        document.getElementById('message-basic').style.display = 'none';
        document.getElementById('message-pro').style.display = 'block';
        
        // Cargar mensaje guardado
        const savedMessage = localStorage.getItem('premium_customMessage');
        const textarea = document.getElementById('custom-message-editable');
        if (savedMessage) {
            textarea.value = savedMessage;
        } else {
            textarea.value = 'Nos encantaría conocer tu experiencia y que compartas tu opinión con otros clientes potenciales. Tu reseña nos ayuda a seguir mejorando cada día.';
        }
        updateProPreview();
    } else {
        // Plan Starter: mostrar versión básica
        showBasicInterface();
    }
}

function showBasicInterface() {
    const premiumBanner = document.getElementById('premium-banner');
    if (premiumBanner) {
        premiumBanner.style.display = 'none';
    }
    document.getElementById('message-label-basic').style.display = 'inline';
    document.getElementById('message-label-pro').style.display = 'none';
    document.getElementById('message-basic').style.display = 'block';
    document.getElementById('message-pro').style.display = 'none';
}

function syncMessageToDashboard() {
    const textarea = document.getElementById('custom-message-editable');
    const message = textarea.value.trim();
    
    if (!message) {
        alert('El mensaje no puede estar vacío');
        return;
    }
    
    // Guardar en localStorage
    localStorage.setItem('premium_customMessage', message);
    
    // Mostrar confirmación
    const successMsg = document.getElementById('save-success-msg');
    successMsg.style.display = 'block';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

function updateProPreview() {
    const textarea = document.getElementById('custom-message-editable');
    const preview = document.getElementById('pro-message-preview');
    const counter = document.getElementById('char-count-app');
    
    if (textarea && preview) {
        const message = textarea.value || 'Nos encantaría conocer tu experiencia y que compartas tu opinión con otros clientes potenciales. Tu reseña nos ayuda a seguir mejorando cada día.';
        preview.textContent = message;
    }
    
    if (textarea && counter) {
        counter.textContent = textarea.value.length;
    }
}