let playground = document.getElementById('playground')

let scoreEle = document.getElementById('score')
let barObject = document.getElementById('barObject')
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
let sequenceBackup = []
let letterSequence = []
let colorSequence = []
let sequenceFinsihed = true
let sequenceLenght = 5
let colorDiff = 10

let defaultTime = 50000 //50s
let currentTime = 0

let factor = 1

let score = 0
let highScore = 0
let lives = 3

let message = ""

let initialised = false
let paused = false

//update game
function generateSequence() {
    let i = 0;
    let a = 360 * Math.random()
    while (i != (sequenceLenght)) {
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
    sequenceBackup = sequence

}
function placeSequence() {
    sequencePrompt.textContent = ''
    for (let i = sequenceLenght - 1; i >= 0; i--) {
        console.log(sequence[i])
        cells[sequence[i]].innerHTML = "<span>" + String.fromCharCode(letterSequence[i]) + "</span>"
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
    currentTime += 75
    console.log(currentTime)
    if (sequenceFinsihed) {
        generateSequence()
        placeSequence()
        sequenceFinsihed = false
        console.log(sequence)
    }
    scoreEle.textContent = "Score: " + score
    document.getElementById("lives").textContent = "Lives: " + lives
    document.getElementById("highScore").textContent = "High Score: " + highScore

    barObject.style.width = `${currentTime * 100 / defaultTime}%`
    if (currentTime == defaultTime) endgame()
}

// grid
function setUpGrid(width = 10, sqaureWidth = 80) {
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
function updateSnake(first = false) {
    if (first) snake = [0, 0, 0, 0]

    snake.forEach((i) => {
        cells[i].classList.add('snake')
    })

    cells[snake[snake.length - 1]].classList.add('tail')
    cells[snake[snake.length - 1]].innerHTML = '<span></span>'

    cells[snake[0]].classList.add('snake')
    cells[snake[0]].classList.add('head')
    cells[snake[0]].innerHTML = '<span>UwU</span>'
}


let side = 0
let cells = []
let displacement = 1

let snake = []


let modal = ""
let lostText = ""
let settings = ""

function initialSetup() {
    paused = true
    modal = document.createElement("div")
    modal.classList.add('modal')
    modal.id = "startup"

    let mainlayout = document.createElement("div")
    mainlayout.classList.add('dialogueLayout')


    let h1_3 = document.createElement("h1")
    h1_3.classList.add('modalSelect')
    h1_3.textContent = "CREDITS : 1 | PRESS START"
    h1_3.style.fontSize = "1em"
    h1_3.style.textShadow = "none"
    h1_3.style.animation = "credits 0.7s infinite cubic-bezier(1,0,0,1)"

    let h1 = document.createElement("h1")
    h1.textContent = "Sequence"
    let h1_2 = document.createElement("h1")
    h1_2.textContent = "Safari"
    h1_2.style.alignSelf = "flex-end"

    let uiDiv = document.createElement("div")
    uiDiv.classList.add('uiDev')

    lostText = document.createElement("div")
    lostText.classList.add('modalSelect')
    lostText.classList.add('modalSelectText')

    lostText.textContent = "Start Game"

    settings = document.createElement("div")
    settings.classList.add('modalSelect')
    settings.textContent = "Quit"

    let highScoreEle = document.createElement("div")
    highScoreEle.classList.add('modalSelect')
    highScoreEle.style.fontSize = "1em"
    highScoreEle.style.textShadow = ""
    highScoreEle.textContent = "High Score: " + highScore
    highScoreEle.style.marginBottom = "10%"

    option = 0

    settings.textContent = "Quit"
    settings.style.animation = "none"
    lostText.textContent = ">  Start Game"
    lostText.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"



    lostText.addEventListener("touchstart", (e) => {
        e.preventDefault()
        option = 1

        lostText.textContent = "Start Game"
        lostText.style.animation = "none"
        settings.textContent = ">    Quit"
        settings.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"


        document.body.removeChild(modal)
        paused = false

    })
    settings.addEventListener("touchstart", (e) => {
        e.preventDefault()
        option = 0

        settings.textContent = "Quit"
        settings.style.animation = "none"
        lostText.textContent = ">  Start Game"
        lostText.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"

        window.close()
    })

    uiDiv.appendChild(lostText)
    uiDiv.appendChild(settings)
    mainlayout.appendChild(h1)
    mainlayout.appendChild(h1_2)
    mainlayout.appendChild(h1_3)
    mainlayout.appendChild(uiDiv)
    mainlayout.appendChild(highScoreEle)
    modal.appendChild(mainlayout)

    document.body.appendChild(modal)
}

function gameLost(message) {
    paused = true

    option = 23

    modal = document.createElement("div")
    modal.classList.add('modal')
    modal.id = "startup"

    let mainlayout = document.createElement("div")
    mainlayout.classList.add('dialogueLayoutLost')


    let h1_3 = document.createElement("h1")
    h1_3.classList.add('modalSelect')
    h1_3.textContent = "CREDITS : 0 | INSERT CREDIT(S)"
    h1_3.style.fontSize = "1em"
    h1_3.style.textShadow = "none"
    h1_3.style.animation = "credits 0.7s infinite cubic-bezier(1,0,0,1)"

    let h1 = document.createElement("h1")
    h1.classList.add('h1Lost')
    h1.textContent = "Sequence"
    let h1_2 = document.createElement("h1")
    h1_2.classList.add('h1Lost')
    h1_2.textContent = "Safari"
    h1_2.style.alignSelf = "flex-end"

    let uiDiv = document.createElement("div")
    uiDiv.classList.add('uiDev')

    lostText = document.createElement("div")
    lostText.classList.add('modalSelect')
    lostText.classList.add('youLostText')

    lostText.textContent = "You Lost!"

    settings = document.createElement("div")
    settings.classList.add('modalSelect')
    settings.textContent = message

    let highScoreEle = document.createElement("div")
    highScoreEle.classList.add('modalSelect')
    highScoreEle.style.fontSize = "1em"
    highScoreEle.style.textShadow = ""
    highScoreEle.textContent = "High Score: " + highScore
    highScoreEle.style.marginBottom = "10%"


    uiDiv.appendChild(lostText)
    uiDiv.appendChild(settings)
    mainlayout.appendChild(h1)
    mainlayout.appendChild(h1_2)
    mainlayout.appendChild(h1_3)
    mainlayout.appendChild(uiDiv)
    mainlayout.appendChild(highScoreEle)
    modal.appendChild(mainlayout)
    modal.onclick = () => { location.reload() }

    document.body.appendChild(modal)

}


function pause() {
    if (!paused) {
        paused = true
        let modal = document.createElement("div")
        modal.id = "pause"
        let pauseText = document.createElement("span")

        let screenBottom = document.createElement("div")
        screenBottom.classList.add('screen-bottom')
        let red = document.createElement("div")
        red.classList.add('red')
        let white = document.createElement("div")
        white.classList.add('white')
        let green = document.createElement("div")
        green.classList.add('green')

        screenBottom.appendChild(red)
        screenBottom.appendChild(white)
        screenBottom.appendChild(green)

        pauseText.textContent = "PAUSE"
        pauseText.classList.add("pause-text")

        modal.appendChild(pauseText)
        modal.classList.add("pause")
        modal.appendChild(screenBottom)

        document.body.appendChild(modal)
    } else {
        paused = false

        document.body.removeChild(document.getElementById("pause"))
    }

}
function setup() {
    // paused = true
    if ((sessionStorage.getItem('highScore')) == null) sessionStorage.setItem('highScore', 0)

    highScore = sessionStorage.getItem('highScore')
    console.log(highScore)
    initialSetup()
    // gameLost("You Collided with a wall!")
    document.getElementById("leftBtn").onclick = function () {
        if (displacement != side) displacement = -side
    }
    document.getElementById("rightBtn").onclick = function () {
        if (displacement != -side) displacement = side
    }
    document.getElementById("upBtn").onclick = function () {
        if (displacement != 1) displacement = -1
    }
    document.getElementById("downBtn").onclick = function () {
        if (displacement != -1) displacement = 1
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === "ArrowLeft" || e.key === "a") {
            if (displacement != side) displacement = -side
        } else if (e.key === "ArrowRight" || e.key === "d") {
            if (displacement != -side) displacement = side
        } else if (e.key === "ArrowDown" || e.key === "s") {
            if (!initialised) {
                option = 1

                lostText.textContent = "Start Game"
                lostText.style.animation = "none"
                settings.textContent = ">    Quit"
                settings.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"
            }
            if (displacement != -1) displacement = 1
        } else if (e.key === "ArrowUp" || e.key === "w") {
            if (!initialised) {
                option = 0

                settings.textContent = "Quit"
                settings.style.animation = "none"
                lostText.textContent = ">  Start Game"
                lostText.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"
            }
            if (displacement != 1) displacement = -1
        } else if (e.key === "p") {
            pause(paused)
        } else if (e.key === "Enter") {
            if (!initialised) {
                if (option == 0) {
                    document.body.removeChild(modal)
                    initialised = true
                    paused = false
                } else if (option == 23) {
                    this.location.reload()
                } else {
                    window.close()
                }
            }
        }
    })

    let size = Math.round(playground.clientWidth * 100 / window.innerHeight)
    console.log(size)
    setUpGrid(4, size)
    side = Math.floor(size / 4)
    for (let i = 0; i < side * side; i++)
        cells[i] = document.getElementById("square" + i)

    updateSnake(snake)

    let str = "linear-gradient(0.25turn,#300350,#94167f)"
    document.body.style.background = str


}

function loop() {
    function updateLoop(timeout) {
        if (!paused) {
            if (lives > 0) {
                updateGame()
                move(displacement)
            } else if (lives === 0) {
                console.log("you lost!")
                document.getElementById('die').play()
                gameLost()
                // die modal dialouge`

                return;
            }

        } else {
        }

        setTimeout(updateLoop, Math.floor(100 * (1 - currentTime / defaultTime)))
    }
    setTimeout(updateLoop, 100)


}

//movement 
function move(displacement) {
    let collide = true
    collide = checkCollision(snake[0], displacement)
    if (!collide) {
        cells[snake[0]].innerText = cells[snake[0]].innerText.replace("UwU", '')
        cells[snake[0]].classList.remove('head')
        const tail = snake.pop()
        cells[tail].classList.remove('snake')
        cells[tail].classList.remove('tail')
        cells[tail].innerText = ''
        snake.unshift((snake[0] + displacement))
        cells[snake[snake.length - 1]].classList.add('tail')
        cells[snake[snake.length - 1]].innerHTML = '<span></span>'

        cells[snake[0]].classList.add('snake')
        cells[snake[0]].classList.add('head')

        cells[snake[0]].innerHTML = '<span>UwU</span>'
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
    console.log(x * side + y, sequence)
    if (y > side - 1 || y < 0) {
        console.log("wall collision")
        message = "You hit a wall!"
        return true
    }
    if (x > side - 1 || x < 0) {
        console.log("wall collision")
        message = "You hit a wall!"
        return true
    }
    const grid = x * side + (y % side)
    if (sequence.includes(grid)) {
        console.log("block collision " + grid)
        return blockCollided(grid)

    }
    if (snake.includes(grid)) {
        console.log("snake collision")
        message = "You collided with yourself!"
        return true
    }
    return false
}
function blockCollided(i) {

    let color = sequenceBackup.indexOf(i)
    let last = sequence.pop()

    console.log(i, last, sequence)

    if (i == last && sequence.length > 0) {

        cells[i].classList.add('square')
        cells[i].classList.remove('block')
        cells[i].style.background = ""
        cells[i].innerText = ''

        // grow(true)
        let k = 0
        let str = "linear-gradient(0.25turn," + colorSequence.slice(-(sequenceLenght - color)).map((e) => "hsl(" + e + ",100%,50%) " + ((++k) / sequenceLenght) * 100 + "%").toLocaleString() + "," + Array(sequence.length).fill("hsl(" + colorSequence[sequenceLenght - color] + ",100%,50%)").toLocaleString() + ")"
        document.body.style.transition = 'background 2s ease-in-out'
        document.body.style.background = str
        sequencePrompt.removeChild(sequencePrompt.firstChild)

        //play eating audio
        document.getElementById("eat").play()

        return false;
    }
    else if (sequence.length === 0 && i == last) {
        document.getElementById("eat").play()
        cells[i].classList.add('square')
        cells[i].classList.remove('block')
        cells[i].style.background = ""
        cells[i].innerText = ''

        grow(true)
        console.log("sequence finsihed!")

        let str = "linear-gradient(0.25turn," + colorSequence.slice(-(sequenceLenght - color)).map((e) => "hsl(" + e + ",100%,50%)").toLocaleString() + "," + Array(sequence.length).fill("black").toLocaleString() + ")"
        document.body.style.background = str

        if (sequencePrompt.firstChild != null)
            sequencePrompt.removeChild(sequencePrompt.firstChild)

        //play eating audio

        sequenceFinsihed = true
        score++
        defaultTime += 50000 //+30s
        updateGame()
        return false;
    }
    else {
        console.log("wrong sequence")
        message = "You Choose the Wrong Sequence!"
        lives = 0
        gameLost(message)
        return true
    }
}
function grow(grow) {
    if (grow) {
        document.getElementById("grow").play()

        cells[snake[0]].innerText = ''
        cells[snake[0]].classList.remove('head')
        const tail = snake[snake.length - 1]
        cells[tail].classList.remove('snake')
        cells[tail].classList.remove('tail')
        cells[tail].innerText = ''
        snake.unshift((snake[0] + displacement))
        cells[snake[snake.length - 1]].classList.add('tail')
        cells[snake[snake.length - 1]].classList.add('snake')
        cells[snake[snake.length - 1]].innerText = ''

        cells[snake[0]].classList.add('snake')
        cells[snake[0]].classList.add('head')
        cells[snake[0]].innerText = 'UwU'
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
        cells[snake[snake.length - 1]].innerText = ''

        cells[snake[0]].classList.add('snake')
        cells[snake[0]].classList.add('head')
        cells[snake[0]].innerText = 'UwU'
    }
}

function endgame() {
    lives--
    document.getElementById('damage').play()
    updateSnake()
    displacement = 1
    if (lives > 0) {
        if (score > highScore) highScore = score
        sessionStorage.setItem("highScore", highScore)
    } else if (lives == 0) {
        if (score > highScore) highScore = score
        sessionStorage.setItem("highScore", highScore)
        gameLost(message)
        return;
    }
}


setup()
loop()