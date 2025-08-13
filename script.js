// URLs de los webhooks
const WEBHOOKS = {
    comenzarAhora: 'https://n8n-n8n.kapi8o.easypanel.host/webhook/comenzar_ahora',
    verDemo: 'http://localhost:5678/webhook/ver_demo',
    chat: 'https://n8n-n8n.kapi8o.easypanel.host/webhook-test/Pagina-inteligente'
};

// Función para enviar datos a webhooks
async function sendToWebhook(webhookUrl, data) {
    try {
        console.log(`Enviando datos a: ${webhookUrl}`, data);
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                timestamp: new Date().toISOString(),
                source: 'AutoIA-Web'
            })
        });
        
        console.log(`Respuesta del webhook: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Respuesta del webhook:', result);
        return result;
        
    } catch (error) {
        console.error('Error al enviar al webhook:', error);
        return null;
    }
}

// Función mejorada para manejar "Comenzar Ahora"
async function handleComenzarAhora(button) {
    const originalText = button.textContent;
    button.textContent = 'Conectando...';
    button.disabled = true;
    
    const data = {
        action: 'comenzar_ahora',
        userAgent: navigator.userAgent,
        currentPage: window.location.href,
        sessionId: 'session_' + Date.now()
    };
    
    const result = await sendToWebhook(WEBHOOKS.comenzarAhora, data);
    
    if (result) {
        button.textContent = '¡Conectado!';
        button.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        
        // Abrir el chatbot automáticamente
        if (typeof window.chatbot !== 'undefined') {
            // Esperar un poco para que el usuario vea el cambio del botón
            setTimeout(() => {
                window.chatbot.toggleChat();
                
                // Añadir mensaje después de abrir el chat
                setTimeout(() => {
                    let message = '';
                    
                    // Buscar el mensaje en diferentes ubicaciones posibles
                    if (result.respuestass) {
                        message = result.respuestass;
                    } else if (result.message) {
                        message = result.message;
                    } else if (result.output) {
                        message = result.output;
                    } else if (result.response) {
                        message = result.response;
                    } else if (typeof result === 'string') {
                        message = result;
                    } else {
                        // Mensaje por defecto si no hay respuesta específica
                        message = '¡Perfecto! Para comenzar con tu automatización necesito algunos datos:\n\n📧 Tu email\n🤖 Tipo de automatización que necesitas\n📝 Descripción breve de tu proceso actual\n\n¿Podrías proporcionarme esta información?';
                    }
                    
                    window.chatbot.addMessage(message, 'bot');
                    
                    // Mensaje adicional de instrucciones
                    setTimeout(() => {
                        window.chatbot.addMessage(
                            'Puedes responder directamente aquí en el chat. ¡Empecemos! 🚀', 
                            'bot'
                        );
                    }, 1500);
                }, 500);
            }, 800);
        }
        
        // Si hay URL de redirección (opcional)
        if (result.redirectUrl) {
            setTimeout(() => {
                window.open(result.redirectUrl, '_blank');
            }, 2000);
        }
        
    } else {
        button.textContent = 'Error de conexión';
        button.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
        
        // Mostrar mensaje de error en consola y opcionalmente en chat
        console.error('No se pudo conectar con el servidor');
        if (typeof window.chatbot !== 'undefined') {
            window.chatbot.toggleChat();
            setTimeout(() => {
                window.chatbot.addMessage(
                    'Ups! Hubo un problema de conexión. Por favor, intenta nuevamente o contacta nuestro soporte.', 
                    'bot'
                );
            }, 500);
        }
    }
    
    // Restaurar botón después de 4 segundos
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = 'linear-gradient(135deg, #00d4ff, #7877c6)';
    }, 4000);
}

// Función mejorada para manejar "Ver Demo"
async function handleVerDemo(button) {
    const originalText = button.textContent;
    button.textContent = 'Preparando Demo...';
    button.disabled = true;
    
    const data = {
        action: 'ver_demo',
        userAgent: navigator.userAgent,
        currentPage: window.location.href,
        sessionId: 'session_' + Date.now()
    };
    
    const result = await sendToWebhook(WEBHOOKS.verDemo, data);
    
    if (result) {
        button.textContent = '¡Demo Lista!';
        button.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        
        // Abrir el chatbot con contenido de demo
        if (typeof window.chatbot !== 'undefined') {
            setTimeout(() => {
                window.chatbot.toggleChat();
                
                setTimeout(() => {
                    let demoMessage = '';
                    
                    // Buscar contenido de demo en la respuesta
                    if (result.demoContent) {
                        demoMessage = result.demoContent;
                    } else if (result.respuestass) {
                        demoMessage = result.respuestass;
                    } else if (result.message) {
                        demoMessage = result.message;
                    } else {
                        // Mensaje de demo por defecto
                        demoMessage = '🎯 **Demo de AutoIA**\n\n✨ Automatización de Chatbots\n🔄 Procesamiento inteligente de documentos\n📧 Gestión automática de emails\n📊 Análisis predictivo de datos\n\n¿Te interesa alguna de estas automatizaciones en particular?';
                    }
                    
                    window.chatbot.addMessage(demoMessage, 'bot');
                    
                    // Mensaje de seguimiento
                    setTimeout(() => {
                        window.chatbot.addMessage(
                            '¿Qué te gustaría ver en detalle? Pregúntame sobre cualquier automatización 💡', 
                            'bot'
                        );
                    }, 2000);
                }, 500);
            }, 800);
        }
        
        // Si hay URL de demo externa
        if (result.demoUrl) {
            setTimeout(() => {
                window.open(result.demoUrl, '_blank');
            }, 2000);
        }
        
    } else {
        button.textContent = 'Error al cargar demo';
        button.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
        
        // Mostrar error en chat
        if (typeof window.chatbot !== 'undefined') {
            window.chatbot.toggleChat();
            setTimeout(() => {
                window.chatbot.addMessage(
                    'Lo siento, no pude cargar la demo en este momento. ¿Te gustaría que te cuente sobre nuestros servicios manualmente?', 
                    'bot'
                );
            }, 500);
        }
    }
    
    // Restaurar botón
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = 'linear-gradient(135deg, #00d4ff, #7877c6)';
    }, 4000);
}

// Función para mostrar notificación visual (opcional)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Colores según tipo
    const colors = {
        info: 'linear-gradient(135deg, #00d4ff, #7877c6)',
        success: 'linear-gradient(135deg, #00ff88, #00d4ff)',
        error: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos para las notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Smooth scrolling para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a elementos
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .benefit-item, .section-title');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Efecto de partículas en el fondo
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '1';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = '#00d4ff';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
        particlesContainer.appendChild(particle);
    }
}

// Efecto de hover para las tarjetas de servicio
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Efecto de typing en el título principal
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Contador animado para beneficios
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + (element.dataset.suffix || '');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Activar animaciones cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    
    // Animación de typing para el título (opcional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
    
    // Animación de contadores (si tienes números)
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        animateCounter(counter, 0, target, 2000);
    });
    
    // *** FUNCIONALIDAD PRINCIPAL: Event listeners para botones ***
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        const buttonText = btn.textContent.trim();
        
        if (buttonText === 'Comenzar Ahora') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                handleComenzarAhora(this);
                showNotification('Iniciando proceso de automatización...', 'info');
            });
        }
        
        if (buttonText === 'Ver Demo') {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                handleVerDemo(this);
                showNotification('Cargando demostración...', 'info');
            });
        }
        
        // Mantener funcionalidad para otros botones
        if (buttonText.includes('Consulta') || (buttonText.includes('Comenzar') && buttonText !== 'Comenzar Ahora')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const originalText = this.textContent;
                this.textContent = 'Enviando...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = '¡Enviado!';
                    this.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
                    showNotification('Consulta enviada correctamente', 'success');
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.disabled = false;
                        this.style.background = 'linear-gradient(135deg, #00d4ff, #7877c6)';
                    }, 2000);
                }, 1500);
            });
        }
    });
});

// Efecto de parallax simple
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Cambiar color del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Efecto de pulse en botones (sin interferir con webhooks)
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const buttonText = this.textContent.trim();
        if (buttonText !== 'Comenzar Ahora' && buttonText !== 'Ver Demo') {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
});

// Estilos CSS dinámicos
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Exponer funciones globalmente
window.WEBHOOKS = WEBHOOKS;
window.sendToWebhook = sendToWebhook;
window.showNotification = showNotification;