// CONSTS...
const MODES = {
    DRAW: 'draw',
    ERASE: 'erase',
    RECTANGLE: 'rectangle', 
    ELLIPSE: 'ellipse',
    PICKER: 'picker'
}

// seleccionar elementos del DOM de forma más rápida y sencilla.
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);


const $canvas = $('#canvas'); // indica que la variable almacena un elemento del DOM.
const $colorPicker = $('#color-picker');
const $clearBtn = $('#clear-btn');


const ctx = $canvas.getContext('2d');

// STATE
let isDrawing = false;
let startX, startY
let lastX = 0;
let lastY = 0;
let mode = MODES.DRAW;

// EVENTS
$canvas.addEventListener('mousedown', startDrawing); // se dispara cuando el usuario presiona un botón del mouse sobre un elemento. 
$canvas.addEventListener('mousemove', draw); // Se dispara cuando el mouse se mueve dentro del canvas.
$canvas.addEventListener('mouseup', stopDrawing); // Se dispara cuando el usuario suelta el botón del mouse
$canvas.addEventListener('mouseleave', stopDrawing); // Se dispara cuando el cursor sale del área del canvas.


$colorPicker.addEventListener('change', handleChangeColor);
$clearBtn.addEventListener('click', clearCanvas)

// METHODS
function startDrawing(event) {
    isDrawing = true;

    const {offsetX, offsetY} = event;

    // guardar las conrdenadas iniciales 
    ;[startX, startY] = [offsetX, offsetY]
    ;[lastX, lastY] = [offsetX, offsetY]

    console.log({ startX, startY, lastX, lastY});
}

function draw(event) {
    if(!isDrawing) return

    const {offsetX,offsetY} = event;

    // comenzar trazado
    ctx.beginPath();

    // mover el trazado a las cordenadas actuales X e Y
    ctx.moveTo(lastX, lastY);

    // dibujar una linea entre las cordenadas actuales y las nuevas
    ctx.lineTo(offsetX,offsetY);

    ctx.stroke();

    // actualizar las ultimas cordenadas
    ;[lastX,lastY] = [offsetX,offsetY]
};

function stopDrawing(event) {
    isDrawing = false; // cuando dejemos de clikear y cuando salgamos del camba para de dibujar
};

function handleChangeColor (){
  const { value } = $colorPicker; // recuperamos el valor del color.
  ctx.strokeStyle = value
}

function clearCanvas (){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
 
