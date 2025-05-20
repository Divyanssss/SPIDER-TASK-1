function gamestart(gamemode) {
  document.getElementById("resetbtn").style.display = "none";
  if (gamemode == "single") {
    document.querySelector(".game-mode").style.display = "none";
    startoneplayer();
  } else if (gamemode == "double") {
    document.querySelector(".game-mode").style.display = "none";
    startwoplayer();
  }
}

let swing = false;
let angle = 0;
let speed = 0.3;
function startoneplayer() {
  swing = true;
  angle = 0;
  animate();
}

function animate() {
  if (!swing) {
    return;
  }

  const acceleration =
    0.1 + 6 * Math.sin((Math.abs(90 - angle) * Math.PI) / 180);
  angle = angle + speed * acceleration;

  if (angle >= 90 || angle <= -90) {
    speed *= -1;
  }

  document.querySelector(".needle").style.transform = `rotate(${angle}deg)`;
  requestAnimationFrame(animate);
}

document.addEventListener("keydown", function (event) {
  if (swing) {
    swing = false;
    score();
  }
});

function score() {
  const score = (10 / 9) * Math.abs(90 - Math.abs(angle));
  document.getElementById("score1").textContent = Math.round(score);

  document.getElementById("resetbtn").style.display = "block";
}

function resetGame() {
  swing = false;
  angle = 0;
  speed = 0.3;

  document.querySelector(".needle").style.transform = `rotate(0deg)`;
  document.querySelector(".game-mode").style.display = "block";
  document.getElementById("score1").textContent = "0";
  document.getElementById("resetbtn").style.display = "none";

  cancelAnimationFrame(animate);
}
