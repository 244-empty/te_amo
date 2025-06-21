const canvas = document.getElementById('valentineCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let fireworks = [];
let mainHeart;
const mainText = "Te Amo";
const fontName = 'Cormorant Garamond';
const loveWords = ["MI NIÑA HERMOSA", "MY LOVE", "DUENDE MALVADA", "MI VIDA 💖", "MI CORAZÓN 💕", "BEAUTIFUL", "INTELIGENTE", "PRECIOSA", "CARIÑOSA", "AMABLE", "RISUEÑA", "ERES MI TODO", "MI MUNDO 🌍", "MI CIELO ⭐", "TALENTOSA", "DIVERTIDA", "ÚNICA", "MI REINA 👑"];

// --- UTILITY FUNCTIONS ---
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// --- MAIN FLOATING HEART CLASS ---
class MainHeart {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + 100;
        this.size = 30;
        this.scale = 1;
        this.angle = 0;
    }

    update() {
        this.angle += 0.03;
        this.scale = 1 + Math.sin(this.angle) * 0.1; // Pulsing effect
        this.y = canvas.height / 2 + 100 + Math.sin(this.angle * 0.5) * 10; // Gentle bobbing
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);
        ctx.fillStyle = 'red';
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 15;
        this.drawHeartShape(0, 0, this.size);
        ctx.restore();
    }
    
    drawHeartShape(x, y, size) {
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
        ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        ctx.closePath();
        ctx.fill();
    }
    
    resize() {
         const fontSize = Math.min(canvas.width * 0.1, 120);
         ctx.font = `italic bold ${fontSize}px ${fontName}`;
         this.x = canvas.width / 2;
         this.y = canvas.height / 2 + 100;
    }
}


// --- PARTICLE CLASS ---
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.type = this.getRandomType();
        this.setupByType();
    }

    getRandomType() {
        const rand = Math.random();
        if (rand < 0.6) return 'star';
        if (rand < 0.9) return 'heart';
        return 'text';
    }

    setupByType() {
        this.speedX = random(-0.2, 0.2);
        this.speedY = random(-0.8, -0.1);
        this.opacity = random(0.5, 1);
        this.life = random(canvas.height * 0.5, canvas.height);

        switch (this.type) {
            case 'star':
                this.size = random(1, 2.5);
                this.color = `rgba(255, 255, 255, ${this.opacity})`;
                this.speedY = 0; // Static stars
                this.speedX = 0;
                break;
            case 'heart':
                this.size = random(5, 15);
                this.color = `hsl(${random(330, 360)}, 100%, ${random(60, 80)}%)`;
                break;
            case 'text':
                this.size = random(12, 16);
                this.color = `rgba(255, 228, 225, ${this.opacity})`; // Misty Rose
                this.textContent = loveWords[Math.floor(Math.random() * loveWords.length)];
                break;
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= Math.abs(this.speedY) || 0.1;

        if (this.y < 0 || this.life <= 0) {
            this.reset();
        }
    }

    reset() {
        this.x = random(0, canvas.width);
        this.y = canvas.height + random(50, 300);
        this.type = this.getRandomType();
        this.setupByType();
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        switch (this.type) {
            case 'star':
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'heart':
                this.drawHeartShape(this.x, this.y, this.size);
                break;
            case 'text':
                ctx.font = `bold ${this.size}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(this.textContent, this.x, this.y);
                break;
        }
        ctx.restore();
    }

    drawHeartShape(x, y, size) {
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(x, y + topCurveHeight);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
        ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        ctx.closePath();
        ctx.fill();
    }
}


// --- FIREWORK PARTICLE (for the explosion) ---
class FireworkParticle extends Particle {
    constructor(x, y, angle) {
        super(x, y);
        this.type = 'heart';
        this.size = random(8, 15);
        this.color = `hsl(${random(0, 360)}, 100%, ${random(70, 90)}%)`; // Full rainbow spectrum
        
        const speed = random(3, 6);
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;

        this.opacity = 1;
        this.friction = 0.96;
        this.gravity = 0.1;
    }

    update() {
        this.speedX *= this.friction;
        this.speedY *= this.friction;
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;
    }
}


// --- FIREWORK CLASS ---
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createExplosion();
    }

    createExplosion() {
        const particleCount = 200;
        
        // Heart shape explosion
        for (let i = 0; i < particleCount; i++) {
            // Parametric equation for a heart
            const t = (Math.PI * 2 / particleCount) * i;
            const heartX = 16 * Math.pow(Math.sin(t), 3);
            const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            const particleAngle = Math.atan2(heartY, heartX);
            const fireworkParticle = new FireworkParticle(this.x, this.y, particleAngle);

            this.particles.push(fireworkParticle);
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].opacity <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.particles.forEach(p => p.draw());
    }
}

// --- MAIN LOGIC ---
function init() {
    particles = [];
    const particleCount = 300; // More particles for a denser feel
    for (let i = 0; i < particleCount; i++) {
        const x = random(0, canvas.width);
        const y = random(0, canvas.height);
        particles.push(new Particle(x, y));
    }
    mainHeart = new MainHeart();
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Adjusted fade for effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].particles.length === 0) {
            fireworks.splice(i, 1);
        }
    }
    
    drawText();
    mainHeart.update();
    mainHeart.draw();
}

function drawText() {
    ctx.save();
    const fontSize = Math.min(canvas.width * 0.1, 120);
    ctx.font = `italic bold ${fontSize}px ${fontName}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const scale = 1 + Math.sin(Date.now() / 400) * 0.03; // Breathing effect
    const x = canvas.width / 2;
    const y = canvas.height / 2 - 40; // Move main text up

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = 'hotpink';
    ctx.shadowBlur = 30;
    
    ctx.fillText(mainText, 0, 0);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'hotpink';
    ctx.lineWidth = 2;
    ctx.strokeText(mainText, 0, 0);
    
    ctx.restore();

    // Draw "My Lady"
    ctx.save();
    ctx.font = `italic bold ${fontSize * 0.3}px ${fontName}`;
    ctx.fillStyle = 'rgba(255, 228, 225, 0.8)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("My Lady", canvas.width / 2, y + 60);
    ctx.restore();
}

// --- EVENT LISTENERS ---
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
    mainHeart.resize();
});

canvas.addEventListener('click', (e) => {
    fireworks.push(new Firework(e.clientX, e.clientY));
});

// --- START ---
init();
animate(); 