const { Resend } = require('resend');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = req.body;
    
    const { 
      to_email, 
      to_name, 
      business_name, 
      business_type, 
      google_maps_url,
      custom_message 
    } = data;

    // Validar datos requeridos
    if (!to_email || !to_name || !business_name || !google_maps_url) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos',
        required: ['to_email', 'to_name', 'business_name', 'google_maps_url']
      });
    }

    // Template HTML del email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center;">
            <h3 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
              ¡Hola ${to_name}! 👋
            </h3>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Gracias por visitar <strong>${business_name}</strong>
            </p>
          </div>

          <!-- Contenido principal -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 20px;">⭐⭐⭐⭐⭐</div>
              <h4 style="color: #333; margin: 0 0 15px 0; font-size: 24px;">
                ¿Cómo fue tu experiencia?
              </h4>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0;">
                ¡Esperamos que hayas tenido una excelente experiencia!
              </p>
            </div>

            ${custom_message ? `
            <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="color: #333; margin: 0; font-size: 16px; line-height: 1.6;">
                ${custom_message}
              </p>
            </div>
            ` : ''}

            <div style="text-align: center; margin: 35px 0;">
              <a href="${google_maps_url}" style="display: inline-block; background: linear-gradient(45deg, #ff6b6b, #ee5a24); color: white; padding: 18px 35px; text-decoration: none; border-radius: 50px; font-size: 18px; font-weight: 600; box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);">
                ⭐ Dejar mi reseña en Google
              </a>
            </div>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; text-align: center; margin: 30px 0;">
              <h3 style="color: white; margin: 0 0 25px 0; font-size: 20px;">
                ¿Por qué es importante tu reseña?
              </h3>
              <table style="width: 100%; margin: 0 auto;">
                <tr>
                  <td style="color: white; text-align: center; padding: 15px; vertical-align: top; width: 33.33%;">
                    <div style="font-size: 28px; margin-bottom: 12px;">🤝</div>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9; line-height: 1.4;">
                      Ayuda a otros<br>clientes
                    </p>
                  </td>
                  <td style="color: white; text-align: center; padding: 15px; vertical-align: top; width: 33.33%;">
                    <div style="font-size: 28px; margin-bottom: 12px;">📈</div>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9; line-height: 1.4;">
                      Mejora nuestro<br>servicio
                    </p>
                  </td>
                  <td style="color: white; text-align: center; padding: 15px; vertical-align: top; width: 33.33%;">
                    <div style="font-size: 28px; margin-bottom: 12px;">💪</div>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9; line-height: 1.4;">
                      Fortalece nuestro<br>negocio
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">
                💡 Es súper fácil:
              </h4>
              <ol style="color: #856404; margin: 10px 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li>Hace clic en el botón de arriba</li>
                <li>Elegí cuántas estrellas nos das</li>
                <li>Escribí un comentario (opcional)</li>
                <li>¡Listo! Solo toma 30 segundos</li>
              </ol>
            </div>
          </div>

          <div style="background: #f8f9ff; padding: 25px 30px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
              ¡Muchas gracias! 🙏
            </p>
            <p style="color: #333; margin: 0; font-size: 16px; font-weight: 500;">
              El equipo de <span style="color: #667eea; font-weight: 700;">${business_name}</span>
            </p>
            
            <div style="margin: 20px auto; width: 60px; height: 3px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 2px;"></div>
            
            <p style="color: #999; margin: 15px 0 0 0; font-size: 12px;">
              Este email fue enviado porque visitaste nuestro ${business_type || 'negocio'}.<br>
              Tu privacidad es importante para nosotros.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar email con Resend
    const result = await resend.emails.send({
      from: 'Impulso 5 Estrellas <onboarding@resend.dev>',
      to: [to_email],
      subject: `${business_name} - ¡Nos encantaría conocer tu opinión! ⭐`,
      html: htmlContent,
    });

    return res.status(200).json({ 
      success: true,
      message: 'Email enviado exitosamente',
      id: result.id 
    });

  } catch (error) {
    console.error('Error enviando email:', error);
    
    return res.status(500).json({ 
      error: 'Error al enviar email',
      details: error.message 
    });
  }
};