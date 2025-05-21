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
let mode = 0;
let turn = 0;
let player1score = 0;
let player2score = 0;
function startoneplayer() {
  mode = 1;
  swing = true;
  angle = 0;
  animate();
}
function startwoplayer() {
  mode = 2;
  swing = true;
  angle = 0;
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
  const currscore = Math.round((10 / 9) * Math.abs(90 - Math.abs(angle)));

  if (mode == 2) {
    if (turn == 0) {
      player1score = currscore;
      document.getElementById(
        "score1"
      ).textContent = `Player 1: ${currscore}`;
      turn = 1;

      setTimeout(() => {
        document.getElementById("score1").textContent = "Player 2's Turn";
        swing = true;
        angle = 0;
        speed = 0.3;
        animate();
      }, 1500);
    } else {
      player2score = currscore;
      let winner;
      if (player1score > player2score) {
        winner = "Player 1";
      } else {
        winner = "Player 2";
      }

      let winnerscore = Math.max(player1score, player2score);

      document.getElementById(
        "score1"
      ).textContent = `${winner} Wins! (Score: ${winnerscore})`;
      document.getElementById("resetbtn").style.display = "block";
    }
  } else {
    document.getElementById("score1").textContent = `Score: ${currscore}`;
    document.getElementById("resetbtn").style.display = "block";
  }
}

function resetgame() {
  swing = false;
  angle = 0;
  speed = 0.3;
  turn = 0;

  document.querySelector(".needle").style.transform = `rotate(0deg)`;
  document.querySelector(".game-mode").style.display = "block";
  document.getElementById("score1").textContent = "0";
  document.getElementById("resetbtn").style.display = "none";
  mode = 0;

  cancelAnimationFrame(animate);
}
