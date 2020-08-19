const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
var ctx = canvas.getContext('2d');
var user = {
    x: 100,
    y: 65,
    vx: 0,
    vy: 0,
    step: 0,
    opacity: 1,
    color: ["#777777", "#999999", "#bbbbbb", "#aaaaaa", "#888888",],
    remaining: 30,
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
    x: [""],
    y: [""],
    step: [""],
}
var bomb = {
    possibleEndX: ["25", "45", "65", "135", "155", "175"],
    endX: [""],
    endY: [""],
    x: [""],
    y: [""],
    initialX: [""],
    step: [""],
}
function generateBomb(){
    var i = bomb.endX.length
    if(i < 3){
    bomb.endX[i] = bomb.possibleEndX[(Math.floor(Math.random()*6))]
    console.log(bomb.endX)
    bomb.endY[i] = 110;
    bomb.initialX[i] = Math.floor(Math.random()*201)
    bomb.x[i] = bomb.initialX[i]
    bomb.y[i] = 0
    bomb.step[i] = 0
    }
}
function drawBomb(){
    var i = 0
    while( i < bomb.endX.length){
        if(bomb.step[i] < 103){
            ctx.strokeStyle = "#FFFF00";
            ctx.beginPath();
            ctx.moveTo(bomb.initialX[i], 0);
            ctx.lineTo(bomb.x[i], bomb.y[i]);
            bomb.x[i] = (bomb.initialX[i] - ((bomb.initialX[i] - bomb.endX[i])*(bomb.step[i]/100)))
            bomb.y[i] = bomb.endY[i]*(bomb.step[i]/100)
            ctx.stroke();
            bomb.step[i] += 1
        }
        if(bomb.step[i] >= 103){
            bomb.endX.shift()
            bomb.endY.shift()
            bomb.x.shift()
            bomb.y.shift()
            bomb.initialX.shift()
            bomb.step.shift()
        }
        i++
    }
}
function clearCanvas(){
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawCities(){
    drawCity(20)
    drawCity(40)
    drawCity(60)
    drawCity(130)
    drawCity(150)
    drawCity(170)
}
function drawCity(x){
    ctx.fillStyle =  "#15217E"
    //"#4041BD"
    ctx.fillRect(x, 115, 10, 1);
    ctx.fillRect(x+2, 111, 2, 4);
    ctx.fillRect(x+1, 114, 9, 2);
    ctx.fillRect(x+4, 112, 1, 3);
    ctx.fillRect(x+6, 111, 1, 3);
    ctx.fillRect(x+7, 110, 2, 5);
}
step = 0
function drawRemainingMissiles(){
    var i = 0
    while(i < user.remaining){
        ctx.fillStyle = "#202020";
        ctx.fillRect(7+(i*2), 122, 1, 3);
        i++;
    }
}
function explosion(s){
    if(s === 0){
        explosionStats.step.push(0);
        explosionStats.x.push(missile.endX)
        explosionStats.y.push(missile.endY)
        explosion(1)
    }
    var i = 0;
    while(i < explosionStats.x.length){
        var step = explosionStats.step[i]
        if(step<32){
            ctx.fillStyle = (step%25<4 ) ? "#B13221" : (step%25<9 ) ? "#4EB3C8" : (step%25<14 ) ? "#FDF986" : (step%25<19 ) ? "#472F94" :  "#9B3470" 
            ctx.fillRect(explosionStats.x[i]-(Math.floor(step*0.6)%5),explosionStats.y[i]-(Math.floor(step*0.6)%5), 2*(Math.floor(step*0.6)%5), 2*(Math.floor(step*0.6)%5));
            explosionStats.step[i] += 1
            // setTimeout(explosion, 100,)
            console.log(step+"______"+i+i+i+i+i)
        }
        else{
            explosionStats.x.shift()
            explosionStats.y.shift()
            explosionStats.step.shift()
        }
        i++
        // if(i === explosionStats.x.length){
        //     setTimeout(explosion, 100,)
        // }
    }
    
}
function drawMissile(step){
    if(missile.fired === true && user.remaining >= 0){
        if(step < 50){
            missile.x -= ((100 - missile.endX)*0.04)
            missile.y -= ((109 - missile.endY)*0.04)
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
    ctx.fillStyle = "#6A450F";
    ctx.fillRect(0, 116, 200, 14);
    ctx.fillRect(0, 110, 10, 6);
    ctx.fillRect(190, 110, 10, 6);
    ctx.fillRect(83, 114, 34, 2);
    ctx.fillRect(89, 112, 22, 2);
    ctx.fillRect(95, 110, 10, 2);
    if(user.remaining > 0){
        user.step += 1
    }
    user.opacity = (user.step%30 <= 14) ? 1 : 0.85
    ctx.fillStyle = user.color[Math.floor(user.step*0.5)%5]
    ctx.fillRect(99, 109, 1, 1); 
    user.opacity = (user.step%60 > 14) ? 1 : 0.85
    ctx.fillStyle = user.color[(Math.floor(user.step*0.5)+1)%5]
    ctx.fillRect(100, 109, 1, 1); 
    //
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
    if(user.y+user.vy >= 0 && user.y+user.vy <= 104){
    user.y += user.vy
    }
    else if(user.y + user.vy <0){
        user.y = 0
        user.vy = 0
    }
    else if(user.y + user.vy >104){
        user.y = 104
        user.vy = 0
    }
}
function game(){
    clearCanvas()
    drawGround()
    drawCities()
    drawMissile(0)
    drawRemainingMissiles()
    drawCrosshair()
    update()
    generateBomb()
    drawBomb()
    if(0 !== explosionStats.x.length){
            setTimeout(explosion, 75,)
        }
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
    if(missile.fired === false){
        user.remaining -= 1
        missile.endX = user.x;
        missile.endY = user.y;
        missile.fired = true;
    }
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