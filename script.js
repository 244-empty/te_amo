const canvas = document.getElementById('valentineCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const text = "TE AMO";
const fontName = 'Parisienne';

// --- UTILITY FUNCTIONS ---
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// --- PARTICLE CLASS ---
class Particle {
    constructor(x, y, isHeart = false) {
        this.x = x;
        this.y = y;
        this.isHeart = isHeart;
        if (this.isHeart) {
            this.size = random(10, 20);
            this.color = `hsl(${random(300, 360)}, 100%, ${random(70, 90)}%)`; // Pinks and Reds
        } else {
            this.size = random(1, 3);
            this.color = `rgba(255, 255, 255, ${random(0.3, 1)})`; // Stars
        }
        this.speedX = random(-0.5, 0.5);
        this.speedY = random(-1, -0.2); // Move upwards
        this.opacity = 1;
        this.life = random(canvas.height * 0.5, canvas.height); // Live for a portion of the screen height
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= Math.abs(this.speedY);

        if (this.y < 0 || this.life <= 0) {
            this.reset();
        }
    }
    
    reset() {
        this.isHeart = Math.random() > 0.1; // 10% chance to be a heart
        if (this.isHeart) {
            this.x = random(0, canvas.width);
            this.y = canvas.height + random(50, 200);
            this.size = random(10, 20);
            this.color = `hsl(${random(300, 360)}, 100%, ${random(70, 90)}%)`;
            this.speedX = random(-0.5, 0.5);
            this.speedY = random(-1, -0.2);
        } else { // Reset as a star
            this.x = random(0, canvas.width);
            this.y = random(0, canvas.height);
            this.size = random(1, 3);
            this.color = `rgba(255, 255, 255, ${random(0.3, 1)})`;
            this.speedX = 0;
            this.speedY = 0; // Stars are static
        }
        this.life = random(canvas.height * 0.5, canvas.height);
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        if (this.isHeart) {
            this.drawHeart();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawHeart() {
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(this.x, this.y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
          this.x, this.y, 
          this.x - this.size / 2, this.y, 
          this.x - this.size / 2, this.y + topCurveHeight
        );
        // bottom left curve
        ctx.bezierCurveTo(
          this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
          this.x, this.y + (this.size + topCurveHeight) / 2, 
          this.x, this.y + this.size
        );
        // bottom right curve
        ctx.bezierCurveTo(
          this.x, this.y + (this.size + topCurveHeight) / 2, 
          this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
          this.x + this.size / 2, this.y + topCurveHeight
        );
        // top right curve
        ctx.bezierCurveTo(
          this.x + this.size / 2, this.y, 
          this.x, this.y, 
          this.x, this.y + topCurveHeight
        );
        ctx.closePath();
        ctx.fill();
    }
}

// --- FIREWORK CLASS ---
class Firework {
    constructor() {
        this.x = random(canvas.width * 0.2, canvas.width * 0.8);
        this.y = random(canvas.height * 0.2, canvas.height * 0.5);
        this.particles = [];
        this.exploded = false;
        this.color = `hsl(${random(0, 50)}, 100%, ${random(70, 90)}%)`; // Yellows/Oranges for the burst
        this.createExplosion();
    }

    createExplosion() {
        const particleCount = 100;
        const angleIncrement = (Math.PI * 2) / particleCount;

        for (let i = 0; i < particleCount; i++) {
            const angle = i * angleIncrement;
            const size = random(8, 15);
            const speed = random(2, 4);
            const speedX = Math.cos(angle) * speed;
            const speedY = Math.sin(angle) * speed;
            this.particles.push(new FireworkParticle(this.x, this.y, size, this.color, speedX, speedY));
        }
    }

    update() {
        if (!this.exploded) {
            this.exploded = true; // Explode immediately for this effect
        }

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

class FireworkParticle extends Particle {
    constructor(x, y, size, color, speedX, speedY) {
        super(x, y, true);
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
        this.opacity = 1;
        this.friction = 0.95; // Slows down over time
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


// --- MAIN LOGIC ---
let fireworks = [];

function init() {
    const particleCount = 200;
    for (let i = 0; i < particleCount; i++) {
        const isHeart = Math.random() > 0.9;
        const x = random(0, canvas.width);
        const y = random(0, canvas.height);
        particles.push(new Particle(x, y, isHeart));
    }
    // Add an initial firework
    setTimeout(addFirework, 1000);
}

function addFirework() {
    fireworks.push(new Firework());
    // Schedule the next firework
    setTimeout(addFirework, random(2000, 5000));
}


function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Slow fade effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw background particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Update and draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].particles.length === 0) {
            fireworks.splice(i, 1);
        }
    }
    
    drawText();
}

function drawText() {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 105, 180, 0.9)'; // Hot pink, slightly transparent
    ctx.shadowColor = 'rgba(255, 20, 147, 1)';
    ctx.shadowBlur = 20;
    const fontSize = canvas.width * 0.12;
    ctx.font = `${fontSize}px ${fontName}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    ctx.restore();
}


// --- EVENT LISTENERS ---
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = []; // Re-init particles on resize
    fireworks = [];
    init();
});

// --- START ---
init();
animate(); 