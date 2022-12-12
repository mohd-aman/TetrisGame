let canvas = document.querySelector("#tetris");
let scoreboard = document.querySelector("#scoreboard");
let ctx = canvas.getContext("2d");
ctx.scale(30,30)

const SHAPES = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1]
    ]
]

const COLORS = [
    "#fff",
    "#9b5fe0",
    "#16a4d8",
    "#60dbe8",
    "#8bd346",
    "#efdf48",
    "#f9a52c",
    "#d64e12"
] 

function makeStartingGrid(){
    let grid = [];
    for(let i=0;i<20;i++){
        grid.push([]);
        for(let j=0;j<10;j++){
            grid[i].push(0);
        }
    }
    return grid;
}

let grid = makeStartingGrid();
let fallingPiece = null;
let score = 0;
// console.log(grid);
// randomPiece();
function randomPiece(){
    let rand = Math.round(Math.random()*6);
    let piece = SHAPES[rand];
    let x = 4;
    let y = -1;
    return {piece:piece,x:x,y:y,colorIndex:rand+1};
}

function renderPiece(){
    fallingPiece.piece.map((row,i)=>{
        row.map((cell,j)=>{
            // console.log(cell);
            if(cell>0){
                ctx.fillStyle = COLORS[fallingPiece.colorIndex]
                ctx.fillRect(fallingPiece.x+j,fallingPiece.y+i,1,1);
            }
        })
    })
}

setInterval(newGameState,1000);

function newGameState(){
    checkAllGrid();
    if(fallingPiece == null){
        fallingPiece = randomPiece();
        renderPiece();
    }
    moveDown();
}

function checkAllGrid(){
    let count = 0;
    for(let i=0;i<grid.length;i++){
        let allFilled = true;
        for(let j=0;j<grid[i].length;j++){
            if(grid[i][j] == 0){
                allFilled = false;
            }
        }
        if(allFilled){
            grid.splice(i,1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0])
            count++;
        }
    }
    if(count == 1){
        score+=10;   
    }else if(count == 2){
        score+=30;   
    }else if (count == 3){
        score+=50;   
    }else if(count>3){
        score+=100;
    }
    scoreboard.innerHTML = "Score: "+ score;
}

function moveDown(){
    // console.log("called");
    if(collision(fallingPiece.x,fallingPiece.y+1)){
        fallingPiece.piece.map((row,i)=>{
            row.map((cell,j)=>{
                let p = fallingPiece.x+j;
                let q = fallingPiece.y+i;
                if(fallingPiece.piece[i][j]>0 && p>=0 && p< 10 && q<20 && q>0)
                    grid[q][p] = fallingPiece.colorIndex;
            })
        })
        if(fallingPiece.y <= 0){
            alert("Game Over");
            grid = makeStartingGrid();
            score = 0;
        }
        fallingPiece = null;
        
    }else{
        fallingPiece.y+=1;}
    renderGameState();
}

function moveLeft(){
    if(!collision(fallingPiece.x-1,fallingPiece.y))
        fallingPiece.x-=1;
    renderGameState();
}

function moveRight(){
    if(!collision(fallingPiece.x+1,fallingPiece.y))
        fallingPiece.x+=1;
    renderGameState();
}

function rotate(){
    let newPiece = [];
    for(let i=0;i<fallingPiece.piece.length;i++){
        newPiece.push([]);
        for(let j=0;j<fallingPiece.piece[i].length;j++){
            newPiece[i].push(0);
        }
    }
    //transpose
    for(let i=0;i<newPiece.length;i++){
        for(let j=0;j<newPiece[i].length;j++){
            newPiece[i][j] = fallingPiece.piece[j][i];
        }
    }
    //reverse
    for(let i=0;i<newPiece.length;i++){
        newPiece[i] = newPiece[i].reverse();
    }
    if(!collision(fallingPiece.x,fallingPiece.y,newPiece))
        fallingPiece.piece = newPiece;
    console.log(newPiece);
}

function renderGameState(){
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            let cell = grid[i][j] 
            ctx.fillStyle = COLORS[cell]
            ctx.fillRect(j, i, 1, 1)
        }
    }
    if(fallingPiece!==null)
        renderPiece();
}

function collision(x,y,shape){
    let piece = shape || fallingPiece.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]>0){
                let p = x+j;
                let q = y+i;
                if(p>=0 && p< 10 && q<20){
                    if(grid[q][p]>0){
                        return true;
                    }
                }else{
                    return true;
                }
            }
        }
    }
    return false;
    
}

document.addEventListener("keydown",function(e){
    console.log(e.code);
    if(fallingPiece == null){
        return;
    }
    if(e.code == "ArrowLeft"){
        moveLeft();
    }else if(e.code == "ArrowRight"){
        moveRight();
    }else if(e.code == "ArrowDown"){
        moveDown();
    }else if(e.code == "ArrowUp"){
        rotate();
    }
})