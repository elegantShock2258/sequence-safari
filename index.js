let playground = document.getElementById('playground')

let scoreEle = document.getElementById('score')
let barObject = document.getElementById('barObject')
let botScore = document.getElementById('botScore')
let sequencePrompt = document.getElementById('sequencePrompt')

let blocks = []

let sequence = []
let sequenceBackup = []
let letterSequence = []
let colorSequence = []
let sequenceFinsihed = true
let sequenceLenght = 9
let colorDiff = 10

let defaultTime = 50000 //50s
let currentTime = 0
let timeIncrement = 75

let factor = 1

let score = 0
let highScore = 0
let lives = 3

let message = ""

let initialised = false
let paused = false

let portalSprites = ["Assets/portal1.png", "Assets/portal2.png", "Assets/portal3.png", "Assets/portal4.png"]
let portals = [] //start,end

let slider = []

let randomNumber = Math.random()
// powerups: shrink, life, time, freeze time ,removeSomeBlocks

let powerUps = ["Assets/compressPixelated.png", "Assets/heart.png", "Assets/clock.webp", "Assets/pause.png", "Assets/qmark.png"]
let powerUpCoords = []
let powerUpCoordBackup = []
let powerUpsNum = []
let powerUpMethod = [() => {
    if (snake.length != 1) {
        const tail = snake.pop()
        cells[tail].classList.remove('snake')
        cells[tail].classList.remove('tail')
        cells[tail].innerText = ''
    }
}, () => {
    lives++
}, () => {
    defaultTime += 1500
}, () => {
    paused = true
    playground.classList.remove("playground-freeze")
    playground.classList.add("playground-freeze")
    document.addEventListener('keydown', function (e) {
        if (e.key === "ArrowLeft" || e.key === "a") {
            move(-side)
        } else if (e.key === "ArrowRight" || e.key === "d") {
            move(side)
        } else if (e.key === "ArrowDown" || e.key === "s") {
            move(1)
        } else if (e.key === "ArrowUp" || e.key === "w") {
            move(-1)
        }
    })
    let t = setTimeout(() => {
        paused = false
        playground.classList.remove("playground-freeze")
    }, 5000)
}, () => {
    // by thomas mampalli 106122129 put him delta sysad
    let blocksEaten = Math.floor((sequence.length - 3) * Math.random())
    if (blocksEaten == 0) blocksEaten = 1
    if (sequence.length != blocksEaten) {
        console.log(sequence, blocksEaten)
        for (let j = 0; j < blocksEaten; j++) {
            let i = sequence[j]
            let color = sequenceBackup.indexOf(sequence[j])
            let last = sequence.pop()

            console.log(i, last, sequence)


            cells[last].classList.add('square')
            cells[last].classList.remove('block')
            cells[last].style.background = ""
            cells[last].innerText = ''

            let k = 0
            let str = "linear-gradient(0.25turn," + colorSequence.slice(-(sequenceLenght - color)).map((e) => "hsl(" + e + ",100%,50%) " + ((++k) / sequenceLenght) * 100 + "%").toLocaleString() + "," + Array(sequence.length).fill("hsl(" + colorSequence[sequenceLenght - color] + ",100%,50%)").toLocaleString() + ")"
            document.body.style.transition = 'background 2s ease-in-out'
            document.body.style.background = str
            sequencePrompt.removeChild(sequencePrompt.firstChild)


            // let tail = sequence.pop()

            // cells[tail].classList.remove('block')
            // cells[tail].classList.add('square')
            // cells[tail].innerText = ''
            // cells[tail].style.background = ''
            // cells[tail].innerHTML = ''

            // let k = 0
            // let str = "linear-gradient(0.25turn," + colorSequence.slice(-(sequenceLenght - i)).map((e) => "hsl(" + e + ",100%,50%) " + ((++k) / sequenceLenght) * 100 + "%").toLocaleString() + "," + Array(sequence.length).fill("hsl(" + colorSequence[sequenceLenght - i] + ",100%,50%)").toLocaleString() + ")"
            // document.body.style.transition = 'background 2s ease-in-out'
            // document.body.style.background = str
            // sequencePrompt.removeChild(sequencePrompt.firstChild)
        }
    }
    console.log(sequence)
}
]

function setUpPortal() {
    // console.log("called")
    let i = 0;
    let obj = []

    // console.log(snake)
    // console.log(sequence)

    while (i != 2) {
        let j = Math.floor(side * side * Math.random())


        if (snake.includes(j)) {
            console.log("got snake")
            continue
        }
        else if (sequence.includes(j)) {
            console.log("got sequence")
            continue
        }
        else {
            obj[i] = j
            // console.log(i, obj[i])
            i++
        }
    }

    portals.push(obj)
}

function updatePortal() {


    portals.forEach((portal) => {
        let color = (portal[0] * portal[1]) % 360
        cells[portal[0]].innerHTML = ""
        let image = document.createElement("img")
        image.style.filter = "hue-rotate(" + color + "deg)"
        image.src = portalSprites[currentTime % 4]
        image.width = cells[portal[0]].clientHeight * 2

        cells[portal[0]].appendChild(image)
        cells[portal[0]].classList.add("square")
        cells[portal[0]].classList.remove("snake")
        cells[portal[0]].classList.remove("head")

        cells[portal[1]].innerHTML = ""
        let image1 = document.createElement("img")
        image1.style.filter = "hue-rotate(" + color + "deg)"
        image1.src = portalSprites[(currentTime + 1) % 4]
        image1.width = cells[portal[1]].clientHeight * 2

        cells[portal[1]].appendChild(image1)
        cells[portal[1]].classList.add("square")
        cells[portal[1]].classList.remove("snake")
        cells[portal[1]].classList.remove("head")
    })
}

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
function placePowerUps() {
    let numberOfPowerUps = 2
    for (let i = 0; i < numberOfPowerUps; i++) {
        let powerUp = Math.floor(powerUps.length * Math.random())
        powerUpsNum[i] = powerUp
    }

    //placing powerups
    let i = 0
    while (i != numberOfPowerUps) {
        let coordinate = Math.floor(side * side * Math.random())

        powerUpCoords.push(coordinate)
        // cells[coordinate].classList.add(powerUpsClasses[powerUps[i]])
        let image = document.createElement('img')
        image.src = powerUps[powerUpsNum[i]]
        console.log(powerUpsNum[i])
        image.width = cells[coordinate].clientHeight
        cells[coordinate].appendChild(image)

        i++
    }

    powerUpCoordBackup = powerUpCoords
}

function updateGame() {

    if (sequenceFinsihed) {
        generateSequence()
        placeSequence()
        sequenceFinsihed = false
        console.log(sequence)

        for (let i = 0; i < 3 * Math.random(); i++) {
            setUpPortal()
            updatePortal()
        }

        placePowerUps()
    }

    currentTime += timeIncrement
    // console.log(currentTime)
    scoreEle.textContent = "Score: " + score
    document.getElementById("lives").textContent = "Lives: " + lives
    document.getElementById("highScore").textContent = "High Score: " + highScore

    barObject.style.width = `${currentTime * 100 / defaultTime}%`
    if (currentTime == defaultTime) endgame()

    updatePortal()
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
    if (first) snake = [6, 5, 4, 3]

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
    if ((sessionStorage.getItem('highScore')) == null) sessionStorage.setItem('highScore', 0)

    highScore = sessionStorage.getItem('highScore')
    console.log(highScore)
    // initialSetup()
    initialised = true
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





    // placeSider()
}
function placeSider() {
    let coods = Array(5)
    let loop = true
    let bool = true

    while (!loop) {
        let sliderStart = Math.floor(side * side * Math.random())
        if (sliderStart in snake || sliderStart in portal || sliderStart in sequence) continue
        else {
            for (let i = 0; i < 5; i++) {
                coods[i] = sliderStart + i * (Math.random() - 0.5 > 0 ? 1 : side)
                bool &= (coods[i] in snake || coods[i] in portal || coods[i] in sequence)
            }
            loop = !bool
        }
    }

    slider = coods
    console.log(slider)

    for (let i = 0; i < 5; i++)
        cells[slider[i]].style.background = "red"

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
    // console.log(x * side + y, sequence)
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
    if (powerUpCoords.includes(coord)) {
        let index = powerUpCoordBackup.indexOf(coord)
        if (index != -1) {
            console.log("power up: " + index)
            powerUpCoords = powerUpCoords.splice(powerUpCoords.indexOf(coord), 1)
            console.log(powerUpCoords)
            powerUpMethod[powerUpsNum[index]]()
            return false
        }
    }

    portals.forEach((portal) => {
        if (portal.includes(grid)) {
            console.log("portal collision")

            cells[snake[0]].classList.remove('head')
            cells[snake[0]].classList.remove('snake')
            cells[snake[0]].classList.add('square')
            cells[snake[0]].innerText = ""
            snake[0] = portal[(portal.indexOf(grid) + 1) % 2]


            return false
        }
    })
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
        playground.classList.remove('playground-damage')
        playground.classList.add('playground-damage')

        setTimeout(() => {
            playground.classList.remove('playground-damage')
        }, 300)
    } else if (lives == 0) {
        if (score > highScore) highScore = score
        sessionStorage.setItem("highScore", highScore)
        gameLost(message)
        return;
    }
}


setup()
loop()