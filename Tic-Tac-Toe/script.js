const xclass = 'x';
const oclass = 'o';
let oturn
var cellElements = document.querySelectorAll('.grid');
const gameover = document.getElementById('gameover')
const winmsg = document.querySelector('.win-mesg')
const restartButton = document.getElementById('rstbtn')
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]


startgame()

function startgame(){
    cellElements.forEach(function(cell){
    cell.classList.remove(xclass)
    cell.classList.remove(oclass)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click',handleClick,{once:true})
    })
    oturn = false
    gameover.classList.remove('show')
}


function handleClick(e){
    const cell = e.target;
    const currentclass = oturn?oclass:xclass;
    placemark(cell,currentclass)
    if(checkWin(currentclass)){
        endGame(false)
    }
    else if(isDraw()){
        endGame(true)
    }
    else{
        switchturn()
    }
}

function placemark(cell,currentclass){
    cell.classList.add(currentclass);
}
function switchturn(){
    oturn = !oturn;
}

function endGame(draw) {
  if (draw) {
    winmsg.innerText = 'Draw!'
  } else {
    winmsg.innerText = `${oturn ? "O" : "X"} Wins!`
  }
  gameover.classList.add('show')
}

function isDraw() {
    return [...cellElements].every(cell => {
      return cell.classList.contains(xclass) || cell.classList.contains(oclass)
    })
  }

function checkWin(currentclass){
    return WINNING_COMBINATIONS.some(combination=>{
        return combination.every(index=>{
        return cellElements[index].classList.contains(currentclass)
    })
})
}

restartButton.addEventListener('click', startgame)