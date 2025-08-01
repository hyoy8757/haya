const starsCanvas = document.getElementById("stars");
const cloudsCanvas = document.getElementById("clouds");
const starsCtx = starsCanvas.getContext("2d");
const cloudsCtx = cloudsCanvas.getContext("2d");

starsCanvas.width = cloudsCanvas.width = window.innerWidth;
starsCanvas.height = cloudsCanvas.height = window.innerHeight;

let shootingStars = [];

function createStar() {
  return {
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 1 + 0.5,
    opacity: Math.random()
  };
}

function createShootingStar() {
  return {
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height / 2,
    len: Math.random() * 300 + 100,
    speed: Math.random() * 10 + 6,
    angle: Math.random() * Math.PI / 3 + Math.PI / 4,
    alpha: 1
  };
}

function createCloud() {
  return {
    x: Math.random() * cloudsCanvas.width,
    y: Math.random() * cloudsCanvas.height,
    radius: Math.random() * 50 + 50,
    alpha: Math.random() * 0.05 + 0.02
  };
}

let stars = Array.from({ length: 200 }, createStar);
let clouds = Array.from({ length: 10 }, createCloud);

setInterval(() => {
  shootingStars.push(createShootingStar());
}, 600);

function draw() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  cloudsCtx.clearRect(0, 0, cloudsCanvas.width, cloudsCanvas.height);

  // Glowing stars
  stars.forEach(star => {
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(Date.now() / 1000 + star.opacity))})`;
    starsCtx.fill();
  });

  // Shooting stars
  shootingStars.forEach((star, index) => {
    const x = star.x;
    const y = star.y;
    const endX = x + Math.cos(star.angle) * star.len;
    const endY = y + Math.sin(star.angle) * star.len;

    const grad = starsCtx.createLinearGradient(x, y, endX, endY);
    grad.addColorStop(0, "white");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    starsCtx.beginPath();
    starsCtx.moveTo(x, y);
    starsCtx.lineTo(endX, endY);
    starsCtx.strokeStyle = grad;
    starsCtx.lineWidth = 2;
    starsCtx.stroke();

    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;
    star.alpha -= 0.01;

    if (star.alpha <= 0) {
      shootingStars.splice(index, 1);
    }
  });

  // Clouds
  clouds.forEach(cloud => {
    cloudsCtx.beginPath();
    cloudsCtx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
    cloudsCtx.fillStyle = `rgba(255, 255, 255, ${cloud.alpha})`;
    cloudsCtx.fill();
  });

  requestAnimationFrame(draw);
}

draw();

window.addEventListener("resize", () => {
  starsCanvas.width = cloudsCanvas.width = window.innerWidth;
  starsCanvas.height = cloudsCanvas.height = window.innerHeight;
});
