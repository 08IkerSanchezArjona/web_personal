// Canvas interactivo con bolas que siguen el ratón
const canvas = document.getElementById('canvas-background');
const ctx = canvas.getContext('2d');

// Configurar el tamaño del canvas
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Variables para el seguimiento del ratón
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;
});

// Clase para las bolas
class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.radius = Math.random() * 15 + 5;
		this.vx = (Math.random() - 0.5) * 2;
		this.vy = (Math.random() - 0.5) * 2;
		this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
		this.opacity = Math.random() * 0.6 + 0.4;
	}

	update() {
		// Calcular la dirección hacia el ratón
		const dx = mouseX - this.x;
		const dy = mouseY - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		// Si está dentro de la distancia de influencia, se mueve hacia el ratón
		if (distance < 200) {
			const angle = Math.atan2(dy, dx);
			const force = (200 - distance) / 200 * 2;
			this.vx += Math.cos(angle) * force * 0.1;
			this.vy += Math.sin(angle) * force * 0.1;
		}

		// Limitar la velocidad
		const maxSpeed = 3;
		const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
		if (speed > maxSpeed) {
			this.vx = (this.vx / speed) * maxSpeed;
			this.vy = (this.vy / speed) * maxSpeed;
		}

		// Aplicar fricción
		this.vx *= 0.98;
		this.vy *= 0.98;

		// Actualizar posición
		this.x += this.vx;
		this.y += this.vy;

		// Rebotar en los bordes
		if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
			this.vx *= -1;
			this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
		}
		if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
			this.vy *= -1;
			this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
		}
	}

	draw() {
		ctx.save();
		ctx.globalAlpha = this.opacity;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();

		// Efecto de brillo
		ctx.strokeStyle = `hsla(${this.color}, 100)`;
		ctx.lineWidth = 1;
		ctx.stroke();
		ctx.restore();
	}
}

// Crear las bolas
const balls = [];
for (let i = 0; i < 30; i++) {
	balls.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height));
}

// Animar
function animate() {
	// Limpiar el canvas con un fondo oscuro
	ctx.fillStyle = '#0a0e27';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Dibujar círculos pequeños de fondo (estrellas)
	ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
	for (let i = 0; i < 100; i++) {
		const x = (i * 137) % canvas.width;
		const y = (i * 71) % canvas.height;
		const size = Math.sin(i) * 0.5 + 1;
		ctx.fillRect(x, y, size, size);
	}

	// Actualizar y dibujar las bolas
	balls.forEach(ball => {
		ball.update();
		ball.draw();
	});

	// Dibujar líneas conectando bolas cercanas
	ctx.strokeStyle = 'rgba(255, 100, 200, 0.3)';
	ctx.lineWidth = 1;
	for (let i = 0; i < balls.length; i++) {
		for (let j = i + 1; j < balls.length; j++) {
			const dx = balls[i].x - balls[j].x;
			const dy = balls[i].y - balls[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < 150) {
				ctx.globalAlpha = (1 - distance / 150) * 0.5;
				ctx.beginPath();
				ctx.moveTo(balls[i].x, balls[i].y);
				ctx.lineTo(balls[j].x, balls[j].y);
				ctx.stroke();
			}
		}
	}

	requestAnimationFrame(animate);
}

animate();