const canvasMat = document.getElementById('matrix-canvas');
const ctxMat = canvasMat.getContext('2d');
let fontSize = 15, columnSpacing = 95, textMatrix = '💜Valeria🪷', columnsMat, dropsMat;
const starsAnim = [], emojis = [];
const numStarsAnim = 300, speedStars = 2.5;

const canciones = ["audio/cancion1.mp3", "audio/cancion2.mp3", "audio/cancion3.mp3"];
let indiceActual = 0;
const audio = document.getElementById('musicaFondo');
const btnCambio = document.getElementById('btnCambio');

window.init2D = function() {
    canvasMat.width = window.innerWidth;
    canvasMat.height = window.innerHeight;
    columnsMat = Math.floor(canvasMat.width / columnSpacing);
    dropsMat = new Array(columnsMat).fill(0).map(() => Math.random() * -canvasMat.height);
    starsAnim.length = 0;
    for (let i = 0; i < numStarsAnim; i++) {
        starsAnim.push({
            x: Math.random() * canvasMat.width - canvasMat.width / 2,
            y: Math.random() * canvasMat.height - canvasMat.height / 2,
            z: Math.random() * canvasMat.width,
            size: Math.random() * 2
        });
    }
};

function spawnEmojis(x, y) {
    for (let i = 0; i < 15; i++) {
        emojis.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() * -15) - 5,
            life: 1.0,
            size: 25 + Math.random() * 35
        });
    }
}

window.draw2DEffects = function() {
    ctxMat.clearRect(0, 0, canvasMat.width, canvasMat.height);

    ctxMat.fillStyle = '#FFF';
    starsAnim.forEach(s => {
        s.z -= speedStars;
        if (s.z <= 0) s.z = canvasMat.width;
        const px = (s.x / s.z) * canvasMat.width + canvasMat.width / 2;
        const py = (s.y / s.z) * canvasMat.height + canvasMat.height / 2;
        ctxMat.beginPath(); ctxMat.arc(px, py, (1 - s.z / canvasMat.width) * 3, 0, 7); ctxMat.fill();
    });

    ctxMat.font = `bold ${fontSize}px Courier New`;
    for (let i = 0; i < columnsMat; i++) {
        let x = i * columnSpacing;
        let y = dropsMat[i];
        for (let j = 0; j < 10; j++) {
            let opacity = 1 - j * 0.1;
            ctxMat.fillStyle = `rgba(220, 180, 255, ${opacity})`;
            ctxMat.fillText(textMatrix, x, y - j * fontSize);
        }
        dropsMat[i] += fontSize * 0.2;
        if (dropsMat[i] > canvasMat.height + 200) dropsMat[i] = -100;
    }

    ctxMat.textAlign = "center";
    for (let i = emojis.length - 1; i >= 0; i--) {
        const e = emojis[i];
        e.x += e.vx; e.y += e.vy; e.vy += 0.6; e.life -= 0.02;
        if (e.life <= 0) emojis.splice(i, 1);
        else {
            ctxMat.globalAlpha = e.life;
            ctxMat.font = `${e.size}px serif`;
            ctxMat.fillText("💜", e.x, e.y);
        }
    }
    ctxMat.globalAlpha = 1.0;
};

function cambiarCancion() {
    indiceActual = (indiceActual + 1) % canciones.length;
    audio.src = canciones[indiceActual];
    audio.load();
    audio.play().catch(e => console.log(""));
}

btnCambio.addEventListener('click', (e) => {
    e.stopPropagation();
    cambiarCancion();
});

audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
});

const desbloquearAudio = () => {
    audio.play().then(() => {
        window.removeEventListener('click', desbloquearAudio);
        window.removeEventListener('touchstart', desbloquearAudio);
    }).catch(err => console.log(""));
};

window.addEventListener('click', desbloquearAudio);
window.addEventListener('touchstart', desbloquearAudio);

window.addEventListener('mousedown', (e) => {
    if (e.target.tagName !== 'BUTTON') spawnEmojis(e.clientX, e.clientY);
});
window.addEventListener('touchstart', (e) => {
    if (e.target.tagName !== 'BUTTON') spawnEmojis(e.touches[0].clientX, e.touches[0].clientY);
});

window.init2D();