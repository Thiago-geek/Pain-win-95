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

// botones de las opciones del aside
const $canvas = $('#canvas'); // indica que la variable almacena un elemento del DOM.
const $colorPicker = $('#color-picker');
const $drawBtn = $('#draw-btn');
const $clearBtn = $('#clear-btn');
const $eraseBtn = $('#erase-btn');
const $rectangleBtn = $('#rectangle-btn');
const $ellipseBtn = $('#ellipse-btn');
const $pickerBtn = $('#picker-btn');



const ctx = $canvas.getContext('2d');

// STATE
let isDrawing = false;
let startX, startY
let lastX = 0;
let lastY = 0;
let mode = MODES.DRAW;
let imageData;

// EVENTS
$canvas.addEventListener('mousedown', startDrawing); // se dispara cuando el usuario presiona un botón del mouse sobre un elemento. 
$canvas.addEventListener('mousemove', draw); // Se dispara cuando el mouse se mueve dentro del canvas.
$canvas.addEventListener('mouseup', stopDrawing); // Se dispara cuando el usuario suelta el botón del mouse
$canvas.addEventListener('mouseleave', stopDrawing); // Se dispara cuando el cursor sale del área del canvas.

$colorPicker.addEventListener('change', handleChangeColor);
$clearBtn.addEventListener('click', clearCanvas);
$rectangleBtn.addEventListener('click', () => {setMode(MODES.RECTANGLE);});
$drawBtn.addEventListener('click', () => {setMode(MODES.DRAW);});
$eraseBtn.addEventListener('click', () => {setMode(MODES.ERASE);});
$pickerBtn.addEventListener('click', () => {setMode(MODES.PICKER)});

// METHODS
function startDrawing(event) {
    isDrawing = true;

    const {offsetX, offsetY} = event;

    // guardar las conrdenadas iniciales 
    ;[startX, startY] = [offsetX, offsetY]
    ;[lastX, lastY] = [offsetX, offsetY]

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
    console.log({ startX, startY, lastX, lastY});
}

function draw(event) {
    if(!isDrawing) return

    const {offsetX,offsetY} = event;

    if(mode === MODES.DRAW || mode === MODES.ERASE) {

    // comenzar trazado
    ctx.beginPath();

    // mover el trazado a las cordenadas actuales X e Y
    ctx.moveTo(lastX, lastY);

    // dibujar una linea entre las cordenadas actuales y las nuevas
    ctx.lineTo(offsetX,offsetY);

    ctx.stroke();

    // actualizar las ultimas cordenadas
    ;[lastX,lastY] = [offsetX,offsetY]
    return
    }

    if(mode === MODES.RECTANGLE){
        ctx.putImageData(imageData, 0, 0);
        const width = offsetX - startX;
        const height = offsetY - startY;
    
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.stroke();
        return
    }
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

async function setMode(newMode) {
    let previousMode = mode
    mode = newMode;

    $('button.active')?.classList.remove('active');

    if(mode === MODES.DRAW) {
        $drawBtn.classList.add('active');
        canvas.style.cursor = 'crosshair';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 2;
       

        return
    }  if (mode === MODES.RECTANGLE) {
        $rectangleBtn.classList.add('active');
        canvas.style.cursor = 'nw-resize';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 2;
         return
    } 
    
    if (mode === MODES.ERASE) {
        $eraseBtn.classList.add('active');
        canvas.style.cursor = 'url("images/erase.png") 0 24, auto';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 30;
        return
    } 
    
    if (mode === MODES.PICKER) {
        $pickerBtn.classList.add('active');
        const eyeDropper = new window.EyeDropper();

        try {
            const result = await eyeDropper.open();
            const { sRGBHex } = result;
            ctx.strokeStyle = sRGBHex;
            $colorPicker.value = sRGBHex;
            setMode(previousMode)
            
        } catch (e) {
            // errores
        }
        return
    } 
    
    
    if (mode === MODES.RECTANGLE) {
        $rectangleBtn.classList.add('active');
        return
    }
}

// init
setMode(MODES.DRAW);
 
if (typeof window.EyeDropper !== 'undefined') {
    $pickerBtn.removeAttribute('disabled');
}

