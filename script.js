document.addEventListener("DOMContentLoaded", () => {
  const botonCorazon = document.getElementById('botonCorazon');
  const barraProgreso = document.getElementById('barraProgreso');
  const mensajeInteraccion = document.getElementById('mensajeInteraccion');
  const fase1 = document.getElementById('fase1');
  const fase2 = document.getElementById('fase2');
  const musica = document.getElementById('musicaFondo');

  let clics = 0;
  const maxClics = 5;
  let musicaIniciada = false;

  const mensajes = [
    "Toca el corazón, Nana...",
    "Esa es la actitud, otra vez.",
    "Cargando esa magia tuya...",
    "Se encienden las luces...",
    "Solo un toque más, compañera.",
    "¡Conexión completada!"
  ];

  botonCorazon.addEventListener('click', () => {
    if (!musicaIniciada) {
      musica.volume = 0.4;
      let playPromise = musica.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio temporalmente bloqueado por el navegador");
        });
      }
      musicaIniciada = true;
    }

    if (clics >= maxClics) return;

    clics++;
    
    const porcentaje = (clics / maxClics) * 100;
    barraProgreso.style.width = `${porcentaje}%`;

    mensajeInteraccion.style.opacity = 0.2;
    setTimeout(() => {
      mensajeInteraccion.textContent = mensajes[clics];
      mensajeInteraccion.style.opacity = 1;
    }, 150);

    if (clics === maxClics) {
      botonCorazon.style.pointerEvents = 'none'; 
      botonCorazon.style.filter = 'drop-shadow(5px 5px 0px #CA6702) hue-rotate(20deg)';
      
      setTimeout(() => {
        fase1.style.opacity = '0';
        fase1.style.filter = 'blur(10px) grayscale(100%)';
        
        setTimeout(() => {
          fase1.classList.add('oculto');
          fase2.classList.remove('oculto');
          
          void fase2.offsetWidth; 
          
          fase2.style.opacity = '1';
          fase2.style.filter = 'none';
          fase2.style.position = 'relative';
          fase2.style.zIndex = '1';
          
          iniciarAutoPlay();
        }, 1000); 
        
      }, 1200);
    }
  });

  const carrusel = document.getElementById('carruselNuestrosAcordes');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  let isDown = false;
  let startX;
  let scrollLeft;
  let autoPlayInterval = null;

  const iniciarAutoPlay = () => {
    if (autoPlayInterval) return; 
    // Ajustado a 2500ms para mayor velocidad de transición
    autoPlayInterval = setInterval(() => {
      if (carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 10) {
        carrusel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Multiplicador subido ligeramente para deslizar sin tropiezos
        carrusel.scrollBy({ left: carrusel.clientWidth * 0.85, behavior: 'smooth' });
      }
    }, 2500); 
  };

  const detenerAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  };

  carrusel.addEventListener('mouseenter', detenerAutoPlay);
  carrusel.addEventListener('mouseleave', iniciarAutoPlay);
  carrusel.addEventListener('touchstart', detenerAutoPlay, {passive: true});
  carrusel.addEventListener('touchend', iniciarAutoPlay);

  btnNext.addEventListener('click', () => {
    carrusel.scrollBy({ left: carrusel.clientWidth * 0.85, behavior: 'smooth' });
  });
  btnPrev.addEventListener('click', () => {
    carrusel.scrollBy({ left: -(carrusel.clientWidth * 0.85), behavior: 'smooth' });
  });
  
  btnNext.addEventListener('mouseenter', detenerAutoPlay);
  btnPrev.addEventListener('mouseenter', detenerAutoPlay);
  btnNext.addEventListener('mouseleave', iniciarAutoPlay);
  btnPrev.addEventListener('mouseleave', iniciarAutoPlay);

  carrusel.addEventListener('mousedown', (e) => {
    isDown = true;
    carrusel.style.scrollSnapType = 'none'; 
    startX = e.pageX - carrusel.offsetLeft;
    scrollLeft = carrusel.scrollLeft;
  });

  carrusel.addEventListener('mouseleave', () => {
    isDown = false;
    carrusel.style.scrollSnapType = 'x mandatory';
  });

  carrusel.addEventListener('mouseup', () => {
    isDown = false;
    carrusel.style.scrollSnapType = 'x mandatory';
  });

  carrusel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carrusel.offsetLeft;
    // Multiplicador subido a 2.5 para que reaccione más rápido y fluido al arrastrar
    const walk = (x - startX) * 2.5; 
    carrusel.scrollLeft = scrollLeft - walk;
  });
});
