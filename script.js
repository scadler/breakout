$(document).ready(function(){
    $(".text").hide();
});

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
var ctx = canvas.getContext('2d');
var colors = {
    city: ["#2D31B5", "#2D31B5", "#9ECF63", "#626EE4", "#976D2D", "#535CD8", "#B7D73F"],
    ground: ["#A36220", "#87B654", "#2D31B5", "#B83131", "#72954A", "#000000", "#5CBA59"],
    sky: ["#000000", "#000000", "#000000", "#000000", "#2D33B7", "#328331", "#4E32B5"],
    destroySkyIndex: 0,
    bomb: ["#C25E6E", "#9AF49C", "#CA5E65", "#C2D845", "#E08283", "#E6FCE2", "#F8F2F3"],
    text: ["#C4474F", "#ECECEC", "#5A5ECF", "#A26322", "#A1D065", "#E6EEE6", "#72D174"],
    number: 0,
}
var user = {
    x: 100,
    y: 65,
    vx: 0,
    vy: 0,
    step: 0,
    opacity: 1,
    color: ["#777777", "#999999", "#bbbbbb", "#aaaaaa", "#888888",],
    remaining: 30,
    salvos: 2,
    score: 0,
    levelOver: false,
    nextLevel: false,
}
var missile = {
    fired: false,
    ready: true,
    endX: 100,
    endY: 65,
    x: 100,
    y: 109,
    step: 0,
    theta: 0,
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
    max: 3,
    maxIncrease: 0,
    remaining: 30,
    cityDestroyed: false,
}
var blastAlpha = {
    value: ["0.4", "0.5", "0.6","0.5","0.4","0.3","0.2"],
    i: 0,
}
var $mouseX=0,
$mouseY=0;
var $xp=0,
$yp=0;
var ux = 0
var uy = 0
colors.number = Math.floor(Math.random()*7)
$(document).mousemove(function(e) {
        $mouseX=e.pageX;
        $mouseY=e.pageY;
    }
);
var $loop=setInterval(function() {
            $xp +=($mouseX - $xp);
            $yp +=($mouseY - $yp);
            user.x = Math.floor($xp/5)
            if(Math.floor($yp/5) < 105){
                user.y = Math.floor($yp/5)
            }
            else{
                user.y = 104
            }
    }, 30);
function generateBomb(){
    var i = bomb.endX.length
    if(i < bomb.max && bomb.remaining > 0){
    bomb.remaining -= 1;
    console.log(bomb.remaining)
    bomb.endX[i] = bomb.possibleEndX[(Math.floor(Math.random()*bomb.possibleEndX.length))]
    bomb.endY[i] = 110;
    var offset = (Math.random() + 0.25 > 1) ? 10 : (Math.random() +0.5 > 1) ? 15 : (Math.random() + 0.75 > 1) ? 20: 25;
    offset = (Math.random() > 0.5) ? offset : -offset
    bomb.initialX[i] = Number(bomb.endX[i]) + offset
    bomb.x[i] = bomb.initialX[i]
    bomb.y[i] = 0
    bomb.step[i] = 0
    }
    else if(user.levelOver === false && user.nextLevel === false){
        user.levelOver = true
    }
}
function drawBomb(){
    var i = 0
    while( i < bomb.endX.length){
        if(bomb.step[i] < 203){   
            ctx.strokeStyle = colors.bomb[colors.number];
            ctx.beginPath();
            ctx.moveTo(bomb.initialX[i], 0);
            ctx.lineTo(bomb.x[i], bomb.y[i]);
            bomb.x[i] = (bomb.initialX[i] - ((bomb.initialX[i] - bomb.endX[i])*(bomb.step[i]/200)))
            bomb.y[i] = bomb.endY[i]*(bomb.step[i]/200)
            ctx.stroke();
            bomb.step[i] += 1
        }
        if(bomb.step[i] >= 203){
            var b = 0
            while(b < bomb.possibleEndX.length){
                if( bomb.possibleEndX[b] === bomb.endX[i]){
                    bomb.possibleEndX.splice(b,1)
                    bomb.cityDestroyed = true
                }
                b++
            }
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
function drawBlast(){
    if(bomb.cityDestroyed === true){
        if(blastAlpha.i < 7){
            ctx.fillStyle = "rgba(255, 255, 255, " + blastAlpha.value[blastAlpha.i] + ")";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            blastAlpha.i += 1;
            $('#explodeCityAudio').html('<audio autoplay><source src="explodeCity.mp3"></audio>');
            if(blastAlpha.i >= 7){
                bomb.cityDestroyed = false
                blastAlpha.i = 0
            }
        }   
    }
}
function collision(){
    var i = 0
    while( i < bomb.endX.length){
        var b = 0
        while( b < explosionStats.x.length){
            if (explosionStats.x[b] -2.5 < bomb.x[i] + 1 &&
                explosionStats.x[b] + 2.5 > bomb.x[i] -1 &&
                explosionStats.y[b] -2.5 < bomb.y[i] + 1 &&
                explosionStats.y[b] + 2.5 > bomb.y[i] -1){
                    bomb.initialX.splice(i, 1)
                    bomb.x.splice(i, 1)
                    bomb.y.splice(i, 1)
                    bomb.endX.splice(i, 1)
                    bomb.endY.splice(i, 1)
                    bomb.step.splice(i, 1)
                    $("#score").text(Number($("#score").text()) + 50)
                    $('#explosionAudio').html('<audio autoplay><source src="missileExplosion.mp3"></audio>');
            }
        b++
        }
    i++
    }
}
function clearCanvas(){
    ctx.fillStyle = colors.sky[colors.number];
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
    ctx.fillStyle =  colors.city[colors.number]
    var index = x+5
    index = index.toString()
    ctx.fillRect(x, 115, 10, 1);
    if(bomb.possibleEndX.includes(index) === true){
    ctx.fillRect(x+2, 111, 2, 4);
    ctx.fillRect(x+1, 114, 9, 2);
    ctx.fillRect(x+4, 112, 1, 3);
    ctx.fillRect(x+6, 111, 1, 3);
    ctx.fillRect(x+7, 110, 2, 5);
    }
}
step = 0
function drawRemainingMissiles(){
    var i = 0
    ctx.fillStyle = colors.sky[colors.number];
    while(i < user.remaining){
        ctx.fillRect(7+(i*2), 122, 1, 3);
        i++;
    }
    if(user.salvos > 0){
        ctx.fillRect(70, 122, 6, 3);
    }
    if(user.salvos > 1){
        ctx.fillRect(80, 122, 6, 3);
    }
    if(user.remaining === 0){
        if(user.salvos > 0){
            user.remaining = 30;
            user.salvos -=1;
        }
        else if(user.salvos <= 0){
            user.levelOver = true
        }
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
        }
        else{
            explosionStats.x.shift()
            explosionStats.y.shift()
            explosionStats.step.shift()
        }
        i++
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
            missile.x = 100;
            missile.y = 109;
            missile.step = 0;
            missile.fired = false
            explosion(0)
            setTimeout(function(){
                 missile.ready = true
            }, 200)
        } 
    }
}
function drawGround(){
    ctx.fillStyle = colors.ground[colors.number];
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
}
function drawCrosshair(){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(user.x - 2, user.y, 5, 1);
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
    if(bomb.remaining < 1 && bomb.endX.length === 0 && user.levelOver === true){
        user.nextLevel = true
        user.levelOver = false
        //play sound here
        setTimeout(nextLevel, 3000)
    }
    else if(bomb.possibleEndX.length < 1){
        //put lose code here
    }
}
function nextLevel(){
    if(bomb.possibleEndX.length > 0){
        $("#score").text(Number($("#score").text()) + user.remaining*10)
        $("#score").text(Number($("#score").text()) + bomb.possibleEndX.length*200)
        $("#score").text(Number($("#score").text()) + user.salvos * 300)
        user.levelOver = false
        user.nextLevel = false
        colors.number = (colors.number+1)%7
        user.remaining = 30
        user.salvos = 2
        bomb.max += bomb.maxIncrease
        bomb.maxIncrease = (bomb.maxIncrease +1)%2
        bomb.remaining = (bomb.remaining + bomb.max < 55) ? 30 + bomb.max*2 : 55;
        $("#score").css("color", colors.text[colors.number])
    }
}
function endGame(){
    if(bomb.possibleEndX.length === 0 && bomb.x.length !== 0){
        bomb.x = []
        bomb.y = []
        $(".text").show();
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
    collision()
    $("#score").css("color", colors.text[colors.number])
    if(0 !== explosionStats.x.length){
            setTimeout(explosion, 75,)
        }
    drawBlast()
    endGame()
}
setInterval(game, 50)
document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyUp)
function keyPressed(e){
    key = e.key
    if(key == " ") {
    e.preventDefault();
    if(missile.fired === false && missile.ready === true){
        user.remaining -= 1
        missile.endX = user.x;
        missile.endY = user.y;
        missile.fired = true;
        missile.ready = false
        $('#launchAudio').html('<audio autoplay><source src="launch.mp3"></audio>');

    }
  }
}
function keyUp(e){
    key = e.key
    if(key == " ") {
    e.preventDefault();
    if(user.lost === true){
    }
}
}
