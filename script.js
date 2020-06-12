const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
var ctx = canvas.getContext('2d');
var user = {
    x: 100,
    y: 65,
    vx: 0,
    vy: 0,
}
var missile = {
    fired: false,
    endX: 100,
    endY: 65,
    x: 100,
    y: 109,
    step: 0,
}
var explosionStats ={
    ready: false,
    x: 100,
    y: 65,
    step: 0,
}
function clearCanvas(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
step = 0
function explosion(step){
    if(step === 0){
        explosionStats.step = 0;
        explosionStats.x = missile.endX
        explosionStats.y = missile.endY
        explosion(1)
    }
    if(step<50){
        ctx.fillStyle = (step%2 === 1) ? "#FFFF00" : "#FFFFFF"
        ctx.fillRect(explosionStats.x-step%5,explosionStats.y-step%5, 2*(step%5), 2*(step%5));
        explosionStats.step += 1
        setTimeout(explosion, 100, explosionStats.step)
    }
    
}
function drawMissile(step){
    if(missile.fired === true){
        if(step < 50){
            missile.x -= ((100 - missile.endX)*0.02)
            missile.y -= ((109 - missile.endY)*0.02)
            ctx.fillStyle = "#CCCCCC"
            ctx.fillRect(missile.x, missile.y, 1, 1);
            missile.step +=1
            setTimeout(drawMissile, 100, missile.step)
        } 
        if(missile.y < missile.endY){
            missile.fired = false;
            missile.x = 100;
            missile.y = 109;
            missile.step = 0;
            explosion(0)
        } 
    }
}
function drawGround(){
ctx.fillStyle = "#8B4513";
ctx.fillRect(0, 116, 200, 14);
ctx.fillRect(0, 110, 10, 6);
ctx.fillRect(190, 110, 10, 6);
ctx.fillRect(83, 114, 34, 2);
ctx.fillRect(89, 112, 22, 2);
ctx.fillRect(95, 110, 10, 2);
ctx.fillStyle = "#AAAAAA";
ctx.fillRect(99, 109, 2, 1);
}
function drawCrosshair(){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(user.x - 3, user.y, 2, 1);
    ctx.fillRect(user.x + 2, user.y, 2, 1);
    ctx.fillRect(user.x, user.y + 2, 1, 2);
}
function update(){
    if(user.vx > 8){
        user.vx = 8
    }
    else if(user.vx < -8){
        user.vx = -8
    }
    if(user.vy > 8){
        user.vy = 8
    }
    else if(user.vy < -8){
        user.vy = -8
    }
    if(user.x+user.vx >= 2 && user.x+user.vx <= 197){
    user.x += user.vx
    }
    else if(user.x + user.vx <2){
        user.x = 3
        user.vx = 0
    }
    else if(user.x + user.vx >197){
        user.x = 196
        user.vx = 0
    }
    if(user.y+user.vy >= 0 && user.y+user.vy <= 90){
    user.y += user.vy
    }
}
function game(){
    clearCanvas()
    drawGround()
    drawMissile(0)
    drawCrosshair()
    update()
}
setInterval(game, 50)
document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyUp)
function keyPressed(e){
    key = e.key
    if (key == "a") {
        user.vx -= 2
    }
    else if(key == "d"){
        user.vx += 2
    }
    else if (key == "w") {
        user.vy -= 2
    }
    else if (key == "s") {
        user.vy += 2
    }
    else if(key == " ") {
    e.preventDefault();
    missile.endX = user.x;
    missile.endY = user.y;
    missile.fired = true;
  }
}
function keyUp(e){
    key = e.key
    if (key == "a" || key == "d") {
        user.vx = 0
    }
    else if (key == "w" || key == "s") {
        user.vy = 0
    }
    else if(key == " ") {
    e.preventDefault();
    if(user.lost === true){
    }
}
}