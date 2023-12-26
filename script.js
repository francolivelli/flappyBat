let move_speed = 3,
  grativy = 0.5;
let bat = document.querySelector(".bat");
let img = document.getElementById("bat-1");
let sound_point = new Audio("soundEffects/point.mp3");
let sound_die = new Audio("soundEffects/die.mp3");

let bat_props = bat.getBoundingClientRect();

let background = document.querySelector(".background").getBoundingClientRect();

let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");

let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && game_state != "Play") {
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block";
    bat.style.top = "40vh";
    game_state = "Play";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    play();
  }
});

function play() {
  function move() {
    if (game_state != "Play") return;

    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bat_props = bat.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        let collisionRange = 0.05 * bat_props.height;

        if (
          bat_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bat_props.left + bat_props.width > pipe_sprite_props.left &&
          bat_props.top <
            pipe_sprite_props.top + pipe_sprite_props.height - collisionRange &&
          bat_props.top + bat_props.height >
            pipe_sprite_props.top + collisionRange
        ) {
          game_state = "End";
          message.innerHTML =
            "<img src='images/gameOver.png' alt='Game Over' /><p><span style='color: blueviolet; font-size: 1.5em; font-weight: bold'>&#x23CE;</span><span style='color:white; font-size: 1.5em; font-weight: bold'> Enter to Restart</span></p>";
          img.style.display = "none";
          sound_die.play();
          return;
        } else {
          if (
            pipe_sprite_props.right < bat_props.left &&
            pipe_sprite_props.right + move_speed >= bat_props.left &&
            element.increase_score == "1"
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_sprite_props.left - move_speed + "px";
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let bat_dy = 0;
  function apply_gravity() {
    if (game_state != "Play") return;
    bat_dy = bat_dy + grativy;
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/bat-2.png";
        bat_dy = -7.6;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/bat.png";
      }
    });

    if (bat_props.top <= 0 || bat_props.bottom >= background.bottom) {
      game_state = "End";
      message.style.left = "28vw";
      window.location.reload();
      message.classList.remove("messageStyle");
      return;
    }
    bat.style.top = bat_props.top + bat_dy + "px";
    bat_props = bat.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = 0;

  let pipe_gap = 35;

  function create_pipe() {
    if (game_state != "Play") return;

    if (pipe_seperation > 115) {
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
      pipe_sprite_inv.style.left = "100vw";

      let towerImage = new Image();
      towerImage.src = "images/tower.png";
      towerImage.className = "tower-image";
      pipe_sprite_inv.appendChild(towerImage);

      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";

      let towerImage2 = new Image();
      towerImage2.src = "images/tower.png";
      towerImage2.className = "tower-image";
      pipe_sprite.appendChild(towerImage2);

      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}
