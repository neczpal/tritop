let c, ctx;

let view_width, view_height;

let bgColor;

let lose, score, timer, current_life, left_time;
let high_score;

let runningGame;

let lives, node_count, time;

let life_color, time_color;

let wires;

const MIN_SIZE = 3500;


function _r(n){
	return Math.floor(Math.random()*n);
}
function _ra(n, m){
	return _r(m)+n;
}
function _rp(n, m, k, l){
	return new Point(_ra(n, m), _ra(k, l));
}
function _rpin(){
	return _rp(0, view_width, 0, view_height);
}
function _rpain(n){
	let nodes = [];
	for(let i=0; i < n; i++){
		nodes[i] = _rpin();
	}
	return nodes;
}
function _rh(){
	let r = _r(15);
	if(r < 10){
		return r;
	}else{
		switch(r){
			case 10:
				return "A";
			case 11:
				return "B";
			case 12:
				return "C";
			case 13:
				return "D";
			case 14:
				return "E";
			case 15:
				return "F";
					
		}
	}
}
function _rh13(){
	let r = _r(13);
	if(r < 10){
		return r;
	}else{
		switch(r){
			case 10:
				return "A";
			case 11:
				return "B";
			case 12:
				return "C";
		}
	}
}
function _rcnored(){
	return "#"+_rh13()+_rh()+_rh()+_rh()+_rh()+_rh();
}
function _rc(){
	return "#"+_rh()+_rh()+_rh()+_rh()+_rh()+_rh();
}

function Point(x,y){
	this.x = x;
	this.y = y;
}
function dist(p1, p2){
	return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
}

function Wire(){
	this.color = _rcnored();
	this.nodes = _rpain(3);


	this.inside = function(x , y){
		let i, j, c = false;
		  for (i = 0, j = this.nodes.length-1; i < this.nodes.length; j = i++) {
		    if ( ((this.nodes[i].y> y) !== (this.nodes[j].y > y)) &&
		     (x < (this.nodes[j].x-this.nodes[i].x) * 
		     	(y - this.nodes[i].y) / (this.nodes[j].y-this.nodes[i].y) + this.nodes[i].x))
		       		c = !c;
		  }
		  return c;
	};
	this.sizeof = function(){
		let a = dist(this.nodes[0], this.nodes[1]);
		let b = dist(this.nodes[1], this.nodes[2]);
		let c = dist(this.nodes[2], this.nodes[0]);
		let s = (a+b+c)/2;
		return Math.sqrt(s*(s-a)*(s-b)*(s-c));
			
	}
	this.draw = function(){
		ctx.fillStyle = this.color;
	
		ctx.beginPath();
		ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
		for(let i=1; i < this.nodes.length; i++){
			ctx.lineTo(this.nodes[i].x, this.nodes[i].y);	
		}
		ctx.closePath();

		ctx.fill();
	};
}

function animPlusScore(){
	ps.html("-1");
	bgColor = "#F"+_r(5)+_r(5);
	ps.css('color', "#000000");
	ps.fadeIn(150, function(){
		ps.fadeOut(150);
	});
}
function drawLife(x, y, r){
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.closePath();
	
	ctx.fillStyle = "#000";	
	ctx.fill();

	for(let i=current_life; i > 0; i--){
		ctx.fillStyle = life_color[i-1];
		ctx.beginPath();
		ctx.arc(x, y, r, -0.5*Math.PI + 2 * Math.PI * (i-1) / lives, 2 * Math.PI * i / lives -0.5*Math.PI);
		//ctx.arc(x, y, 20, 0, 2 * Math.PI - i * current_life / lives * Math.PI);
		ctx.closePath();
						
		ctx.fill();
	}
	ctx.fillStyle = "#FFF";
	if(current_life <= 9){
		ctx.fillText(current_life, x-2, y+5);
	}else
	if(current_life <= 99){
		ctx.fillText(current_life, x-5, y+5);
	}else{
		
		ctx.font="8px Verdana";

		if(current_life <= 999){
			ctx.fillText(current_life, x-7, y+5);
		}else
		if(current_life <= 9999){
			ctx.fillText(current_life, x-10, y+5);
		}else{
			ctx.font="7px Verdana";
			ctx.fillText("99999", x-10, y+6);
		}
	}
	
}
function drawTime(x, y, r){
	/*ctx.beginPath();
	ctx.arc(x, y, r+2, 0, 2 * Math.PI);
	ctx.closePath();
	
	ctx.fillStyle = "#000";	
	ctx.fill();
*/
	ctx.lineWidth = 2;
	for(let i=left_time; i > 0; i--){
		ctx.strokeStyle = time_color[i-1];

		ctx.beginPath();
		ctx.arc(x, y, r, -0.5*Math.PI + 2 * Math.PI * (i-1) / time, 2 * Math.PI * i / time -0.5*Math.PI);
		//ctx.arc(x, y, 20, 0, 2 * Math.PI - i * current_life / lives * Math.PI);
		ctx.closePath();
						
		ctx.stroke();
	}


	ctx.fillStyle = "#FFF";
	if(left_time <= 9){
		ctx.fillText(left_time, x-2, y+3);
	}else
	if(left_time <= 99){
		ctx.fillText(left_time, x-5, y+3);
	}else
	if(left_time <= 999){
		ctx.fillText(left_time, x-8, y+3);
	}else
	if(left_time <= 9999){
		ctx.fillText(left_time, x-10, y+3);
	}else{
		ctx.fillText(left_time, x-13, y+3);
	}
}
function drawScore(x, y){
	if(score <= 9){
		ctx.fillText(score, x-7, y);
	}else
	if(score <= 99){
		ctx.fillText(score, x-15, y);
	}else
	if(score <= 999){
		ctx.fillText(score, x-24, y);
	}else
	if(score <= 9999){
		ctx.fillText(score, x-30, y);
	}else{
		ctx.fillText(score, x-39, y);
	}
}
function drawBigScore(x, y){
	if(score <= 9){
		ctx.fillText(score, x-14, y);
	}else
	if(score <= 99){
		ctx.fillText(score, x-30, y);
	}else
	if(score <= 999){
		ctx.fillText(score, x-48, y);
	}else
	if(score <= 9999){
		ctx.fillText(score, x-60, y);
	}else{
		ctx.fillText(score, x-78, y);
	}
}
function addTime(n){
	//time_color[n+left_time-1] = _rcnored();
	drawGame();
	if(n > 0){
		time ++;
		left_time ++;
		n--;
		setTimeout("addTime("+n+")", 10);
	}
}
function addWires(n){
	drawGame();
	if(n <= 0){
		return;
	}
	if(wires.length === 0){
   		let temp;
   		do{
			temp = new Wire();
		}while(temp.sizeof() < MIN_SIZE);
   		wires.push(temp);
	}else{
		let temp, connect = false, top_wire = wires[wires.length-1];
		do{
			do{
				temp = new Wire();
			}while(temp.sizeof() < MIN_SIZE);
		
			for(let i = 0; i < temp.nodes.length; i++){
				if(top_wire.inside(temp.nodes[i].x, temp.nodes[i].y)){
					connect = true;
				}
			}
		}while(!connect);

		//console.log(temp.sizeof());
        wires.push(temp);
	}
    n--;
	setTimeout("addWires("+n+")", 10);
}
function recolor(){
	bgColor = _rcnored();
	for(let i=0; i < wires.length; i++){
		wires[i].color = _rcnored();
	}

    recolorLife();
}
function recolorLife(){
	for(let i=0; i < lives; i++){
		life_color[i] = _rcnored();
	}	
}
function recolorTime(){
	for(let i=0; i < time; i++){
		time_color[i] = _rc();
	}	
}

function newGame(t, l, s){
    lose = false;

    wires = [];

    score = 0;
    timer = 0;

    time = t;
    lives = l;
    node_count = s;

    bgColor = _rcnored();
    addWires(node_count);
    life_color = [];
    recolorLife();
    time_color = [];
    recolorTime();

    current_life = lives;
    left_time = time;
    runningGame = setInterval("runGame()", 50);
    drawGame();
}
function loseGame(){
	clearInterval(runningGame);
	drawFinalScore();
}
let ps;

function init(){
	c = document.getElementById("surface");
	ctx = c.getContext("2d");
	ctx.font="30px Verdana";
	
	view_width = c.width = window.innerWidth;
	view_height = c.height = window.innerHeight;

	c.addEventListener("mousedown", doMouseDown, false);
	//c.addEventListener("mouseup", doMouseUp, false);
	//c.addEventListener("touchstart", doMouseDown, false);
	//c.addEventListener("touchend", handleEnd, false);
	//window.addEventListener("keydown", doKeyDown, false);
	//window.addEventListener("keyup", doKeyUp, false);

	ps = $("#plus_score");
	if(window.localStorage.getItem("high_score")){
		high_score = window.localStorage.getItem("high_score");
	}else{
		high_score = 0;
	}
	lose = true;
	drawMenu();
}
function doMouseDown(event){
	//event.preventDefault();
	if(!lose){
		if(wires[wires.length-1].inside(event.pageX, event.pageY)){
			//animPlusScore(wires[wires.length-1], true);
			wires.pop();
			score++;
			recolor();
			if(wires.length === 0){
				node_count+= Math.floor(node_count/2);
				addWires(node_count);
				addTime(node_count/1.5);
				recolorTime();
				current_life = lives;
			}
			drawGame();
		}else{
			animPlusScore();
			current_life--;
			window.navigator.vibrate(200);
			drawGame();
			if(current_life <= 0){
				lose = true;
			}
		}
	} else {
		newGame(15,3,3);
	}
}

function runGame(){
	if(timer % 20 === 0){
    	left_time--;

    	if(left_time <= 0){
    		lose = true;
    	}
    }
    if(lose){
		loseGame();
	}else{
		drawGame();
	}
    timer++;
}
function refresh(){
	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, view_width, view_height);
}
function drawGame(){
	refresh();
	for(let i=0; i < wires.length; i++){
		wires[i].draw();
	}
	ctx.font="10px Verdana";
	drawLife(23, 23, 20);
	ctx.font="10px Verdana";
	drawTime(view_width-23, 23, 20);
	ctx.font="30px Verdana";
	drawScore(view_width/2, 30);
}
function drawFinalScore(){
	bgColor = "#F"+_r(5)+_r(5);
	refresh();
	ctx.font="30px Verdana";
	ctx.fillStyle="#000000";
	let tmp;

	ctx.font="40px Verdana";
	if(current_life === 0){
		ctx.fillText("YOU DIED!", view_width/2-120, view_height/2-150);
	}else{
		ctx.fillText("TIME IS UP!", view_width/2-130, view_height/2-150);
	}

	ctx.font="30px Verdana";
	if(score > high_score){
		window.localStorage.setItem("high_score", score);
		high_score = score;
		ctx.fillText("NEW HIGH SCORE!", view_width/2-140, view_height/2-50);
	}else{
		ctx.fillText("Your Score:", view_width/2-100, view_height/2-50);
		ctx.fillText("High score:", view_width/2-100, view_height/2+50);
		tmp = score;
		score = high_score;
		drawBigScore(view_width/2, view_height/2+100);
		score = tmp;
	}

	ctx.font="bold 30px Verdana";
	drawBigScore(view_width/2, view_height/2);

	ctx.font="italic 30px Verdana";
	ctx.fillText("Tap to play again!", view_width/2-140, view_height/2+200);
}
function drawMenu(){
    bgColor = _rcnored();
	refresh();

    time = 30;
    left_time = 17;

    lives = 3;
    current_life = 2;

    score = high_score;

    life_color = [];
    recolorLife();
    time_color = [];
    recolorTime();

    ctx.fillStyle = "#FFF";
	ctx.font="30px Verdana";
	ctx.fillText("Help", view_width/2-45, view_height/2-150);

	ctx.font="20px Verdana";
	ctx.fillText("Game:", view_width/2-150, view_height/2-100);
    

    ctx.font="10px Verdana";
	ctx.fillText("Tap on the top triangle", view_width/2-60, view_height/2-105);
	ctx.fillText("Be careful because this game is", view_width/2-60, view_height/2-90);
	
	ctx.fillStyle = _rc();
	ctx.fillText("c", view_width/2+120, view_height/2-90);
	
    ctx.fillStyle = _rc();
	ctx.fillText("o", view_width/2+125, view_height/2-90);
	
	ctx.fillStyle = _rc();
	ctx.fillText("l", view_width/2+131, view_height/2-90);
	
	ctx.fillStyle = _rc();
	ctx.fillText("o", view_width/2+133, view_height/2-90);
	
	ctx.fillStyle = _rc();
	ctx.fillText("r", view_width/2+139, view_height/2-90);
	
	ctx.fillStyle = _rc();
	ctx.fillText("f", view_width/2+144, view_height/2-90);

	ctx.fillStyle = _rc();
	ctx.fillText("u", view_width/2+147, view_height/2-90);

	ctx.fillStyle = _rc();
	ctx.fillText("l", view_width/2+153, view_height/2-90);
	
    drawLife(view_width/2-120, view_height/2-40, 20);
	ctx.fillText("It shows your left lives", view_width/2-60, view_height/2-45);
	ctx.fillText("Resets after clearing a map", view_width/2-60, view_height/2-30);
	drawTime(view_width/2-120, view_height/2+40, 20);
	ctx.fillText("It shows the left time", view_width/2-60, view_height/2+35);
	ctx.fillText("Adds some after clearing a map", view_width/2-60, view_height/2+50);
	
	ctx.font="20px Verdana";
	ctx.fillText("High score:", view_width/2-85, view_height/2+135);
	drawBigScore(view_width/2+75, view_height/2+135);
	
	ctx.font="italic 30px Verdana";
	ctx.fillText("Tap to play!", view_width/2-90, view_height/2+200);
}