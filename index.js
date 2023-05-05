let playground = document.getElementById('playground')

let scoreEle = document.getElementById('score')
let barObject = document.getElementById('barObject')
let highScoreEle = document.getElementById('highScore')
let botScore = document.getElementById('botScore')
let sequencePrompt = document.getElementById('sequencePrompt')
// set up a mouse event listener to detect which direction its going
// movement
// let x0, y0 = 0
// playground.addEventListener('mousemove', ((e) => {

//     let delX = e.clientX - x0
//     let delY = e.clientY - y0
//     let epsilon = 180

//     let delEffective = Math.max(Math.abs(delX), Math.abs(delY))
//     if (delEffective == Math.abs(delX)) {
//         if (delX > epsilon)  moveX() 
//         else if (delX < epsilon) console.log("left")
//     }
//     else {
//         if (delY > epsilon) console.log("down")
//         else if (delY < epsilon) console.log("up")
//     }
//     x0 = e.clientX
//     y0 = e.clientY
// }))



let blocks = []
let sequence = []
let letterSequence = []
let colorSequence = []
let sequenceFinsihed = true
let sequenceLenght = 5
let colorDiff = 10

let defaultTime = 30000 //30s
let currentTime = 0

let score = 0
let highScore = 0
let lives = 3

//update game
function generateSequence() {
    let i = 0;
    let a = 360 * Math.random()
    while (i != sequenceLenght) {
        let j = Math.floor(side * side * Math.random())
        if (j in snake) continue
        else {
            sequence[i] = j
            letterSequence[i] = (Math.floor(52 * Math.random()) + 65)
            if (i == 0) colorSequence[i] = a
            else colorSequence[i] = a + (i - 1) * colorDiff
            i++
        }
    }

}
function placeSequence() {
    sequencePrompt.textContent = ''
    for (let i = sequenceLenght - 1; i > 0; i--) {
        cells[sequence[i]].innerText = String.fromCharCode(letterSequence[i])
        cells[sequence[i]].style.background = `hsl(${colorSequence[i]},100%,50%)`
        cells[sequence[i]].classList.add("block")

        let div = document.createElement('div')
        div.classList.add("prompt")
        div.innerText = String.fromCharCode(letterSequence[i])
        div.style.background = `hsl(${colorSequence[i]},100%,50%)`

        sequencePrompt.appendChild(div)


    }
}
function updateGame() {
    currentTime += 100
    if (sequenceFinsihed) {
        generateSequence()
        placeSequence()
        sequenceFinsihed = false
        console.log(sequence)
    }
    scoreEle.textContent = "Score: " + score
    document.getElementById("lives").textContent = "Lives: " + lives

    barObject.style.width = `${currentTime * 100 / defaultTime}%`

}

// grid
function setUpGrid(width = 10, sqaureWidth = 70) {
    let numSquares = (sqaureWidth / width) * (sqaureWidth / width)
    for (let i = 0; i < numSquares; i++) {
        let div = document.createElement('div')
        div.classList.add('square')
        div.id = "square" + i
        div.style.width = `${width}vh`
        div.style.height = `${width}vh`
        playground.appendChild(div)
    }
    return width, numSquares
}

// snake
function updateSnake() {
    snake.forEach((i) => {
        cells[i].classList.add('snake')
    })

    cells[snake[snake.length - 1]].classList.add('tail')
    cells[snake[snake.length - 1]].innerText = '(‿ˠ‿)'

    cells[snake[0]].classList.add('snake')
    cells[snake[0]].classList.add('head')
    cells[snake[0]].innerText = ':D'
}


let side = 0
let cells = []
let displacement = 1

let snake = []
function setup() {
    snake = [15, 29, 43, 57]
    if (localStorage.getItem('lives') === null) sessionStorage.setItem('lives', 3)
    if (localStorage.getItem('highScore') === null) sessionStorage.setItem('highScore', 0)

    lives = sessionStorage.getItem('lives')
    highScore = sessionStorage.getItem('highScore')

    document.addEventListener('keydown', function (e) {
        if (e.key === "ArrowLeft") {
            displacement = -side
        } else if (e.key === "ArrowRight") {
            displacement = side
        } else if (e.key === "ArrowDown") {
            displacement = 1
        } else if (e.key === "ArrowUp") {
            displacement = -1
        }
    })

    setUpGrid(5, 70)
    side = 70 / 5
    for (let i = 0; i < side * side; i++)
        cells[i] = document.getElementById("square" + i)

    updateSnake(snake)
}

function loop() {
    var loop = setInterval(() => {
        if (lives > 0) {
            flag = !move(displacement)
            updateGame()
        } else {
            console.log("you lost!")
            // grow(false)
            clearInterval(loop)
        }
    }, 100)
}

//movement 
function move(displacement) {
    let collide = checkCollision(snake[0], displacement)
    if (!collide) {
        cells[snake[0]].innerText = ''
        cells[snake[0]].classList.remove('head')
        const tail = snake.pop()
        cells[tail].classList.remove('snake')
        cells[tail].classList.remove('tail')
        cells[tail].innerText = ''
        snake.unshift((snake[0] + displacement))
        cells[snake[snake.length - 1]].classList.add('tail')
        cells[snake[snake.length - 1]].innerText = '(‿ˠ‿)'

        cells[snake[0]].classList.add('snake')
        cells[snake[0]].classList.add('head')
        cells[snake[0]].innerText = ':D'
    } else if (collide) {
        endgame()
    }

    return collide;
}
function checkCollision(coord, displacement) {
    let y0 = Math.floor(coord % side)
    let x0 = Math.floor(coord / side)

    let yd = Math.floor(displacement % side)
    let xd = Math.floor(displacement / side)

    let x = x0 + xd
    let y = y0 + yd
    console.log(x, y)
    if (y > side - 1 || y < 0) {
        console.log("wall collision")
        return true
    }
    if (x > side - 1 || x < 0) {
        console.log("wall collision")
        return true
    }
    const grid = x * side + y
    if (sequence.includes(grid)) {
        console.log("block collision")
        return blockCollided(grid)
    } else if (snake.includes(grid)) {
        console.log("snake collision")
        return true
    }
    return false
}
function blockCollided(i) {
    let last = sequence.pop()
    console.log(i, last, sequence)
    if (i == last && sequence.length > 0) {
        cells[i].classList.add('square')
        cells[i].classList.remove('block')
        cells[i].style.background = ""
        cells[i].innerText = ''

        grow(true)

        sequencePrompt.removeChild(sequencePrompt.firstChild)
        // increment bg 

        return false;
    }
    else if (sequence.length === 0 && i == last) {
        cells[i].classList.add('square')
        cells[i].classList.remove('block')
        cells[i].innerText = ''

        grow(true)
        console.log("sequence finsihed!")

        sequencePrompt.removeChild(sequencePrompt.firstChild)
        // increment bg 

        sequenceFinsihed = true
        score++
        defaultTime += 5000 //+5s

        updateGame()
        return false;
    }
    else {
        console.log("wrong sequence")
        return true;
    }
}
function grow(grow) {
    if (grow) {
        cells[snake[0]].innerText = ''
        cells[snake[0]].classList.remove('head')
        const tail = snake[snake.length - 1]
        cells[tail].classList.remove('snake')
        cells[tail].classList.remove('tail')
        cells[tail].innerText = ''
        snake.unshift((snake[0] + displacement))
        cells[snake[snake.length - 1]].classList.add('tail')
        cells[snake[snake.length - 1]].classList.add('snake')
        cells[snake[snake.length - 1]].innerText = '(‿ˠ‿)'

        cells[snake[0]].classList.add('snake')
        cells[snake[0]].classList.add('head')
        cells[snake[0]].innerText = ':D'
    } else {
        cells[snake[0]].innerText = ''
        cells[snake[0]].classList.remove('head')
        const delTail = snake.pop()
        cells[delTail].classList.remove('snake')
        cells[delTail].classList.remove('tail')
        cells[delTail].innerText = ''

        const tail = snake.pop()
        cells[tail].classList.remove('snake')
        cells[tail].classList.remove('tail')
        cells[tail].innerText = ''
        snake.unshift((snake[0] + displacement))
        cells[snake[snake.length - 1]].classList.add('tail')
        cells[snake[snake.length - 1]].classList.add('snake')
        cells[snake[snake.length - 1]].innerText = '(‿ˠ‿)'

        cells[snake[0]].classList.add('snake')
        cells[snake[0]].classList.add('head')
        cells[snake[0]].innerText = ':D'
    }
}

function endgame() {
    lives--;
    if (lives > 0) {
        console.log('reloading`')
        location.reload()
        sessionStorage.setItem("lives", lives)
        if (score > highScore) sessionStorage.setItem("highScore", highScore)
    } else if(lives = 0){
    }
}
// make a game manager to decide spawnning and handle background styleing and scores and save and pause
// make moveAble to handle snake movement and anything




setup()
loop()