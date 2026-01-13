# Portafolio Web Espectacular

Un portafolio web único y moderno diseñado con una paleta de colores excepcional y efectos visuales impresionantes.

## 🎨 Paleta de Colores

- **SPACE CADET** (#25344F) - Color principal de fondo
- **SLATE GRAY** (#617891) - Elementos secundarios
- **TAN** (#D5B893) - Acentos y destacados
- **COFFEE** (#6F4D38) - Textos y bordes
- **CAPUT MORTUUM** (#632024) - Acentos especiales

## ✨ Características

- **Diseño Responsivo**: Adaptable a todos los dispositivos
- **Animaciones Suaves**: Efectos de entrada y transiciones fluidas
- **Sistema de Partículas**: Fondo animado en la sección hero
- **Efectos Glassmorphism**: Diseño moderno con efectos de vidrio
- **Navegación Suave**: Scroll suave entre secciones
- **Formulario de Contacto**: Funcional y estilizado
- **Contadores Animados**: Estadísticas con animación
- **Efectos Parallax**: Profundidad visual en el scroll

## 🚀 Uso

### Desarrollo Local
Simplemente abre el archivo `index.html` en tu navegador para ver el portafolio.

### Despliegue en Netlify

1. **Opción 1: Arrastrar y Soltar**
   - Ve a [Netlify Drop](https://app.netlify.com/drop)
   - Arrastra la carpeta del proyecto
   - ¡Listo! Tu sitio estará en línea

2. **Opción 2: Git Integration**
   - Sube tu proyecto a GitHub
   - Conecta tu repositorio con Netlify
   - Netlify detectará automáticamente la configuración

3. **Configuración Automática**
   - El archivo `netlify.toml` ya está configurado con:
     - Headers de seguridad
     - Cache optimization
     - Redirects para SPA
   - El archivo `_redirects` maneja las rutas

## 🔒 Seguridad

El proyecto incluye:
- ✅ Headers de seguridad configurados
- ✅ Content Security Policy (CSP)
- ✅ Enlaces externos con `rel="noopener noreferrer"`
- ✅ Iframes con sandbox attributes
- ✅ Validación de errores en JavaScript

## 📁 Estructura

```
PORTAFOLIO/
├── index.html          # Estructura HTML principal
├── _redirects          # Configuración de rutas para Netlify
├── netlify.toml        # Configuración de Netlify
├── README.md           # Documentación del proyecto
├── assets/
│   └── images/         # Imágenes del portafolio
│       ├── logo.jpg
│       ├── jefita.jpeg
│       └── ruben.jpeg
├── css/
│   └── styles.css      # Estilos y animaciones
└── js/
    └── script.js        # Interactividad y efectos
```

## 🎯 Secciones

1. **Hero**: Sección principal con animaciones y partículas
2. **Sobre Mí**: Información personal y estadísticas
3. **Habilidades**: Tecnologías y herramientas
4. **Proyectos**: Showcase de trabajos destacados
5. **Contacto**: Formulario y información de contacto

## 🛠️ Personalización

Puedes personalizar fácilmente:
- Colores en `:root` dentro de `styles.css`
- Contenido en `index.html`
- Animaciones en `script.js`
- Textos y enlaces de contacto

## 📱 Compatibilidad

Compatible con todos los navegadores modernos:
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

### Responsive Design
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (480px - 767px)
- ✅ Small Mobile (320px - 479px)

## ⚡ Optimizaciones

- **Performance**: Lazy loading de imágenes y recursos
- **SEO**: Meta tags optimizados
- **Accessibility**: Atributos ARIA y semántica HTML5
- **Security**: Headers de seguridad y CSP
- **Caching**: Configuración de cache para Netlify
- **Error Handling**: Validaciones y manejo de errores

## 📦 Archivos de Configuración

- `netlify.toml`: Configuración de Netlify (headers, cache, build)
- `_redirects`: Manejo de rutas para SPA
- `index.html`: Estructura principal con meta tags de seguridad
- `css/styles.css`: Estilos optimizados con responsive design
- `js/script.js`: JavaScript con error handling y validaciones

## 📂 Organización de Archivos

El proyecto está organizado en carpetas para mejor mantenimiento:
- **assets/images/**: Todas las imágenes del portafolio
- **css/**: Archivos de estilos
- **js/**: Archivos JavaScript
- **Raíz**: Archivos de configuración y HTML principal

¡Disfruta de tu portafolio espectacular y seguro!
