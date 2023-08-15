/** @type {HTMLCanvasElement} */
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let bricks = [];
let cw = canvas.width;
let ch = canvas.height;

let a,gameStarted=false,score=0,gameStatus="resume";


class brick
{
  constructor(e)
    {
    this.color = "red";
    this.x =e.x;
    this.y =e.y;
    this.width = 160;
    this.height = 30;
  }
   
  draw()
   {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  delete()
   {
     ctx.clearRect(this.x, this.y, this.width, this.height);
    }
}



for (let index = 0; index < 6; index++)
  {
   for (let j = 0; j < 9; j++) {
    bricks.push(new brick({x:40+j*180,y:(index+1)*50}))
   }
  }


  


let paddle =
{
  x:cw/2-100,
  y:ch-50,
  height:30,
  width:200,
  color:"white",
  draw()
  { 
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  delete()
  { 
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}






let ball =
{
  x:cw/2,
  y: ch - 70,
  dx:1,dy:-1,
  color: "green",
  radius:12,
  draw()
  { 
   ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath()
  },
  delete()
  { 
    ctx.clearRect(this.x-this.radius, this.y-this.radius,2*this.radius, 2*this.radius);
  },
  moveBall()
  {
    a = setInterval(() => {
      if (gameStatus == "resume") {
        ctx.clearRect(0, 0, cw, ch);
        this.x += this.dx;
        this.y += this.dy;
        bricks.forEach((e) => { e.draw() })
        paddle.draw();
        ball.draw();
        //hit paddle
        if ((ball.x >= paddle.x && ball.x <= paddle.x + 200 && (ball.y - ball.radius == paddle.y + 30 || ball.y + ball.radius == paddle.y)) || (ball.y >= paddle.y && ball.y <= paddle.y + 30 && (ball.x + ball.radius == paddle.x || ball.x - ball.radius == paddle.x + 200))) {
          //offset = ((ball.x - (paddle.x + 100)) / 20)/10*2;
          ball.dy = -ball.dy;
          // ball.dx = offset;
        }
        //left and right wall
        if (ball.x + ball.radius > cw - 20 || ball.x - ball.radius < 20)
          ball.dx = -ball.dx;
        //top wall
        if (ball.y - ball.radius == 0)
          ball.dy = -ball.dy;
        //bottom wall
        if (ball.y + ball.radius == ch - 10) {
          clearInterval(a);
          alert("GAME OVER !\n YOUR SCORE IS " + score);
          window.location.reload();
        }
        //hit bricks
        bricks.forEach((b) => {
          if ((Math.abs(ball.x - b.x) <= 172 && (ball.y - ball.radius == b.y + 30 || ball.y + ball.radius == b.y))) {
            b.delete();
            ball.dy = -ball.dy;
            // ball.dx = -ball.dx;
            bricks.splice(bricks.indexOf(b), 1);
            score++;
          }
          if ((Math.abs(ball.y - b.y) <= 42 && (ball.x + ball.radius == b.x || ball.x - ball.radius == b.x + 160))) {
            b.delete();
            ball.dx = -ball.dx;
            bricks.splice(bricks.indexOf(b), 1);
            score++;
          }
          if (score == 54) {
            alert("YOU WIN !");
            window.location.reload();
          }
        })
      }
    },0.02)
  }
}


ctx.font = "50px Arial";
ctx.fillStyle = "white";
ctx.fillText("click space button to begin", 500, 200);
ctx.fillText("click enter button to pause/resume", 400, 500);


document.addEventListener("keydown", (e) => {
  console.log(e.keyCode);
  if (e.keyCode == 37)
  {
    if (paddle.x <= 10) return;
    paddle.delete();
    paddle.x -= 20;
    paddle.draw();
    if (!gameStarted)
    {
      ball.delete();
      ball.x -= 20;
      ball.draw();
      }
    }
  if (e.keyCode == 39)
  {
    if (paddle.x+200 >= cw-10) return;
    paddle.delete();
    paddle.x += 20;
    paddle.draw();
     if (!gameStarted)
    {
      ball.delete();
      ball.x += 20;
      ball.draw();
      }
  }
  if (e.keyCode == 32)
  {
    // click space to begin
    ctx.clearRect(0, 0, cw, ch);
    bricks.forEach((e) => { e.draw() })
    paddle.draw();
    ball.draw();
    gameStarted = true;
    ball.moveBall();
  }
  if (e.keyCode == 13)
  {
    if (gameStatus == 'paused')
      gameStatus = "resume";
    else
      gameStatus = "paused";
  }
})



