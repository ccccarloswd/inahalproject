console.log('✅ JS cargado');
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
document.addEventListener('DOMContentLoaded', function() {
    const opcionesHorario = document.querySelectorAll('.horario-option');

    opcionesHorario.forEach(horario => {
        horario.addEventListener('click', function() {
            document.querySelector('.horario-option.seleccionado')?.classList.remove('seleccionado');
            this.classList.add('seleccionado');
        });
    });


    const listaClases = document.querySelector('.clases-lista');
    const btnArriba = document.querySelector('.carrusel-btn.arriba');
    const btnAbajo = document.querySelector('.carrusel-btn.abajo');
    const clases = document.querySelectorAll('.clase-vertical');
    
    // Función para actualizar los botones de navegación
    function updateButtons() {
        btnArriba.style.display = listaClases.scrollTop > 10 ? 'flex' : 'none';
        btnAbajo.style.display = listaClases.scrollTop < (listaClases.scrollHeight - listaClases.clientHeight - 10) ? 'flex' : 'none';
    }
    
    // Navegación con botones
    btnAbajo.addEventListener('click', () => {
        listaClases.scrollBy({
            top: 300,
            behavior: 'smooth'
        });
    });
    
    btnArriba.addEventListener('click', () => {
        listaClases.scrollBy({
            top: -300,
            behavior: 'smooth'
        });
    });
    
    // Selección de clase
    clases.forEach(clase => {
        clase.addEventListener('click', function() {
            // Remover selección anterior
            document.querySelector('.clase-vertical.seleccionada')?.classList.remove('seleccionada');
            
            // Añadir selección nueva
            this.classList.add('seleccionada');
            
            // Actualizar panel de reserva
            const claseNombre = this.querySelector('h3').textContent;
            const profesor = this.dataset.profesor;
            const precio = this.dataset.precio;
            const capacidad = this.dataset.capacidad;
            const dificultad = this.dataset.dificultad;
            
            document.getElementById('nombre-clase').textContent = claseNombre;
            document.getElementById('profesor-clase').textContent = profesor;
            document.getElementById('precio-clase').textContent = `${precio}€`;
            document.getElementById('dificultad-clase').textContent = `Nivel: ${dificultad}`;
            document.getElementById('capacidad-clase').textContent = `Capacidad: ${capacidad} plazas`;
            document.getElementById('clase-seleccionada-texto').textContent = `${claseNombre} con ${profesor}`;
        
            mostrarHorariosParaClase(this.dataset.clase);
        });
    });
    
    // Actualizar botones al hacer scroll
    listaClases.addEventListener('scroll', updateButtons);
    
    // Actualizar botones al cargar la página
    updateButtons();
    
    // Selección desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const claseParam = urlParams.get('clase');
    if (claseParam) {
        const claseToSelect = document.querySelector(`.clase-vertical[data-clase="${claseParam}"]`);
        if (claseToSelect) {
            claseToSelect.click();
            // Esperar un momento para que se aplique el click antes de hacer scroll
            setTimeout(() => {
                claseToSelect.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }
    }
    
    // Manejar el formulario
    const formReserva = document.getElementById('form-reserva');
    formReserva.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const terminos = document.getElementById('terminos').checked;
        console.log('🧾 Enviando reserva...');
        
        const horarioSeleccionado = document.querySelector('.horario-option.seleccionado');
        if (!horarioSeleccionado) {
            alert('Selecciona día y hora');
            return;
        }

        // Validación básica
        
        const dia = horarioSeleccionado.querySelector('.horario-dia').textContent;
        const hora = horarioSeleccionado.querySelector('.horario-hora').textContent;
        const fecha = dia;
        const horario = hora;

        if (!nombre || !email || !telefono || !fecha || !terminos) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        const claseSeleccionada = document.querySelector('.clase-vertical.seleccionada');
        const clase = claseSeleccionada.dataset.clase;
        const profesor = claseSeleccionada.dataset.profesor;

        try {
        const respuesta = await fetch('https://inahalproject-1.onrender.com/api/reservar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, telefono, clase, profesor, fecha, horario}) // reemplazamos esto más abajo
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.error || 'Error al hacer la reserva');
            return;
        }

        alert(data.mensaje);
        formReserva.reset();
        } catch (error) {
            alert('Error de conexión con el servidor');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const clase = params.get('clase');
  const profesor = params.get('profesor');

  if (clase && profesor) {
    const tarjeta = document.querySelector(
      `.clase-vertical[data-clase="${clase}"][data-profesor="${profesor}"]`
    );
    if (tarjeta) {
      tarjeta.classList.add('seleccionada');
      document.querySelector('#input-clase').value = clase;
      document.querySelector('#input-profesor').value = profesor;
    }
  }
});

const horariosPorClase = {
  'hatha': [
    { dia: 'Lunes', hora: '08:00' },
    { dia: 'Miercoles', hora: '18:30' },
    { dia: 'Viernes', hora: '08:00' }
  ],
  'vinyasa': [
    { dia: 'Lunes', hora: '18:30' },
    { dia: 'Miercoles', hora: '8:00' }
  ],
  'yin': [
    { dia: 'Martes', hora: '17:00'},
    { dia: 'Martes', hora: '20:00' },
    { dia: 'Miercoles', hora: '9:30' },
    { dia: 'Viernes', hora: '20:00' }
  ],
  'pilates': [
    { dia: 'Martes', hora: '08:00' },
    { dia: 'Martes', hora: '18:30' },
    { dia: 'Jueves', hora: '08:00' },
    { dia: 'Viernes', hora: '18:30'}
  ],
  'suave': [
    { dia: 'Lunes', hora: '09:30' },
    { dia: 'Jueves', hora: '9:30' },
    { dia: 'Viernes', hora: '17:00' }
  ],
  'embarazo': [
    { dia: 'Martes', hora: '09:30' },
    { dia: 'Viernes', hora: '9:30' }
  ],
  'meditacion': [
    { dia: 'Lunes', hora: '11:00' },
    { dia: 'Lunes', hora: '8:00' },
    { dia: 'Miercoles', hora: '11:00' },
    { dia: 'Miercoles', hora: '20:00' }
  ],
  'pranayama': [
    { dia: 'Lunes', hora: '07:00' },
    { dia: 'Martes', hora: '11:00' },
    { dia: 'Viernes', hora: '07:00' }
  ],
  'restaurativo': [
    { dia: 'Lunes', hora: '17:00' },
    { dia: 'Jueves', hora: '17:00' }
  ],
  'ninos': [
    { dia: 'Miércoles', hora: '17:00' }
  ],
  'avanzado': [
    { dia: 'Jueves', hora: '18:30' }
  ],
  'circulo': [
    { dia: 'Jueves', hora: '20:00' }
  ],
  'taller': [
    { dia: 'Sábado', hora: '11:00' }
  ],
  'satsang': [
    { dia: 'Miercoles', hora: '21:00' }
  ]
};
function mostrarHorariosParaClase(clase) {
  const zonaHorarios = document.getElementById('horarios-disponibles');
  zonaHorarios.innerHTML = ''; // Limpia horarios anteriores

  const horarios = horariosPorClase[clase.toLowerCase()] || [];

  horarios.forEach(({ dia, hora }) => {
    const opcion = document.createElement('div');
    opcion.className = 'horario-option';
    opcion.innerHTML = `
      <span class="horario-dia">${dia}</span>
      <span class="horario-hora">${hora}</span>
    `;
    opcion.addEventListener('click', () => {
      document.querySelector('.horario-option.seleccionado')?.classList.remove('seleccionado');
      opcion.classList.add('seleccionado');
    });
    zonaHorarios.appendChild(opcion);
  });
}
