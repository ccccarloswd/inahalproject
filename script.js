document.querySelectorAll('.nav-links a, .logo a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    
    // Si es #inicio, haz scroll al top
    if (targetId === '#inicio') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const startPosition = window.pageYOffset;
      const targetPosition = targetElement.getBoundingClientRect().top + startPosition;
      const duration = 500;
      const startTime = performance.now();

      function scrollStep(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startPosition + (targetPosition - startPosition) * progress);
        
        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        }
      }
      
      requestAnimationFrame(scrollStep);
    }
  });
});
// Ciclo de imágenes para mostrar una por una con fade
const images = document.querySelectorAll('.hero-right img');
let current = 0;

function mostrarImagenActual() {
  images.forEach((img, index) => {
    img.style.opacity = index === current ? '1' : '0';
  });
  current = (current + 1) % images.length;
}

mostrarImagenActual();
setInterval(mostrarImagenActual, 7000); // Cambia cada 4 segundos

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  const seccionIntercambio = document.querySelector('#sobre-nosotros'); // O la sección donde debe ocurrir

  if (window.scrollY > 0) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  if (!navbar || !seccionIntercambio) return;

  const posicionSeccion = seccionIntercambio.getBoundingClientRect().top + window.scrollY;
  const scrollActual = window.scrollY;

if (window.innerWidth > 768) {
  if (scrollActual >= posicionSeccion - 100) {
    navbar.classList.add('swapped');
  } else {
    navbar.classList.remove('swapped');
  }
} else {
  navbar.classList.remove('swapped'); // Asegura quitarla en móviles
}
});

// — obtén referencias a track, botones y al primer panel —
const track    = document.querySelector('.carrusel-track');
const btnLeft  = document.querySelector('.carrusel-btn.izquierda');
const btnRight = document.querySelector('.carrusel-btn.derecha');
const gap      = parseFloat(getComputedStyle(track).gap);
const panel    = track.querySelector('.clase-panel');  // ← aquí defines panel

// — función para calcular el ancho + gap —
function getPanelWidth() {
  return panel.offsetWidth + gap;
}

// — scroll suave al pulsar flechas —
btnRight.addEventListener('click', () => {
  track.scrollBy({ left: getPanelWidth(), behavior: 'smooth' });
});
btnLeft.addEventListener('click', () => {
  track.scrollBy({ left: -getPanelWidth(), behavior: 'smooth' });
});

// — mostrar/ocultar botones según posición —
function updateButtons() {
  const maxScroll = track.scrollWidth - track.clientWidth;
  btnLeft .style.display = track.scrollLeft > 10              ? 'block' : 'none';
  btnRight.style.display = track.scrollLeft < maxScroll - 10 ? 'block' : 'none';
}

track.addEventListener('scroll', updateButtons);
window.addEventListener('resize', updateButtons);
updateButtons();



document.addEventListener('DOMContentLoaded', function() {
    const equipoTrack = document.querySelector('#equipo .carrusel-track');
    const equipoBtns = document.querySelectorAll('#equipo .carrusel-btn');
    
    if (equipoTrack && equipoBtns.length > 0) {
        const panels = equipoTrack.querySelectorAll('.clase-panel');
        const panelWidth = panels[0].offsetWidth + parseInt(getComputedStyle(equipoTrack).gap);
        
        // Función para desplazar el carrusel
        function scrollCarousel(direction) {
            const currentScroll = equipoTrack.scrollLeft;
            const visiblePanels = Math.floor(equipoTrack.clientWidth / panelWidth);
            const scrollAmount = visiblePanels * panelWidth * direction;
            
            equipoTrack.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Event listeners para los botones
        equipoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.classList.contains('izquierda') ? -1 : 1;
                scrollCarousel(direction);
            });
        });
        
        // Actualizar visibilidad de botones
        function updateButtons() {
            const maxScroll = equipoTrack.scrollWidth - equipoTrack.clientWidth;
            equipoBtns[0].style.visibility = equipoTrack.scrollLeft > 10 ? 'visible' : 'hidden';
            equipoBtns[1].style.visibility = equipoTrack.scrollLeft < maxScroll - 10 ? 'visible' : 'hidden';
        }
        
        // Inicializar
        updateButtons();
        
        // Event listeners
        equipoTrack.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
    }
});

const scrollPaso = panel.offsetWidth + parseFloat(getComputedStyle(track).gap || 0);

track.scrollBy({
  left: scrollPaso,
  behavior: 'smooth'
});

const maxScrollLeft = track.scrollWidth - track.clientWidth;
if (track.scrollLeft + scrollPaso <= maxScrollLeft) {
  track.scrollBy({ left: scrollPaso, behavior: 'smooth' });
} else {
  track.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
}

const hamburguesa = document.querySelector('.hamburguesa');
const navLinks = document.querySelector('.nav-links');

hamburguesa.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});
