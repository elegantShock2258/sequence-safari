let playground = document.getElementById('playground')

let scoreEle = document.getElementById('score')
let barObject = document.getElementById('barObject')
let botScore = document.getElementById('botScore')
let sequencePrompt = document.getElementById('sequencePrompt')

let sequence = []
let sequenceBackup = []
let letterSequence = []
let letterSequenceGot = false
let colorSequence = []
let sequenceFinsihed = true
let sequenceLenght = 9

let currentTime = 0


let score = 0
let highScore = 0
let lives = 3


let initialised = false
let paused = false

let portals = [] //start,end


let side = 0
let cells = ""
let displacement1 = 1
let displacement2 = side

let snake = []
let snake2 = []
let numPlayers = 1

let startGameText = ""
let settings = ""

let difficulty = ""
let gridSize = 20

let modal = ""
let lostText = ""
let slider = []

let portalSprites = ["Assets/portal1.png", "Assets/portal2.png", "Assets/portal3.png", "Assets/portal4.png"]
let colorDiff = 40
let selectDropdown = null
let playerDropdown = null
let gridDropdown = null
let randomNumber = Math.random()

let message = ""
let factor = 1
let timeIncrement = 75
let defaultTime = 50000 //50s

let blocks = []
// powerups: shrink, life, time, freeze time ,removeSomeBlocks

let powerUps = ["Assets/compressPixelated.png", "Assets/heart.png", "Assets/clock.webp", "Assets/pause.png", "Assets/qmark.png"]
let powerUpCoords = []
let powerUpCoordBackup = []
let powerUpsNum = []

let playerLost = ""
let playerWin = ""
if (JSON.parse(sessionStorage.getItem('game')) != null) {

    // console.log("cakked")
    let game = JSON.parse(sessionStorage.getItem('game'))
    highScore = game["highscore"]

    sequence = game["sequence"]
    sequenceBackup = game["sequenceBackup"]

    difficulty = game["difficulty"]
    sequenceBackup = game["sequenceBackup"]
    gridSize = game["gridSize"]
    side = game["side"]

    displacement1 = game["displacement"]
    snake = game["snake"]
    letterSequence = game["letterSequence"]
    colorSequence = game["colorSequence"]
    sequenceFinsihed = game["sequenceFinsihed"]

    sequenceLenght = game["sequenceLenght"]


    score = game["score"]
    lives = game["lives"]


    paused = game["paused"]
    portals = game["portals"]

    powerUpCoords = game["powerUpCoords"]
    powerUpCoordBackup = game["powerUpCoordBackup"]
    powerUpsNum = game["powerUpsNum"]

    currentTime = game["currentTime"]



}

let powerUpMethod = [(snakeNumber) => {
    if (snakeNumber == 1) {
        if (snake.length != 1) {
            const tail = snake.pop()
            cells[tail].classList.remove('snake')
            cells[tail].classList.remove('tail')
            cells[tail].innerText = ''
        }
    } else if (snakeNumber == 2) {
        if (snake2.length != 1) {
            const tail = snake2.pop()
            cells[tail].classList.remove('snake2')
            cells[tail].classList.remove('tail2')
            cells[tail].innerText = ''
        }
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
            moveSnake1(-side)
        } else if (e.key === "ArrowRight" || e.key === "d") {
            moveSnake1(side)
        } else if (e.key === "ArrowDown" || e.key === "s") {
            moveSnake1(1)
        } else if (e.key === "ArrowUp" || e.key === "w") {
            moveSnake1(-1)
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
        // console.log(sequence, blocksEaten)
        for (let j = 0; j < blocksEaten; j++) {
            let i = sequence[j]
            let color = sequenceBackup.indexOf(sequence[j])
            let last = sequence.pop()

            // console.log(i, last, sequence)


            cells[last].classList.add('square')
            cells[last].classList.remove('block')
            cells[last].style.background = ""
            cells[last].innerText = ''

            let k = 0
            let str = "linear-gradient(0.25turn," + colorSequence.slice(-(sequenceLenght - color)).map((e) => "hsl(" + e + ",100%,40%) " + ((++k) / sequenceLenght) * 100 + "%").toLocaleString() + "," + Array(sequence.length).fill("hsl(" + colorSequence[sequenceLenght - color] + ",100%,40%)").toLocaleString() + ")"
            document.body.style.transition = 'background 2s ease-in-out'
            document.body.style.background = str
            sequencePrompt.removeChild(sequencePrompt.firstChild)

        }
    }
    // console.log(sequence)
}
]
//setting up things and updating them 
function setUpPortal() {
    // // console.log("called")
    let i = 0;
    let obj = []

    // // console.log(snake)
    // // console.log(sequence)

    while (i != 2) {
        let j = Math.floor(side * side * Math.random())


        if (snake.includes(j)) {
            // console.log("got snake")
            continue
        }
        else if (sequence.includes(j)) {
            // console.log("got sequence")
            continue
        }
        else {
            obj[i] = j
            // // console.log(i, obj[i])
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
async function generateSequence() {
    let i = 0;
    let a = 360 * Math.random()
    // console.log("sequence length: ", sequenceLenght)
    while (i != sequenceLenght) {
        let j = Math.floor(side * side * Math.random())
        if (j in snake) continue
        else {
            sequence[i] = j
            if (i == 0) colorSequence[i] = a
            else colorSequence[i] = a + (i - 1) * colorDiff
            i++
        }
    }

    // make https request

    sequenceBackup = sequence
    return null;

}
function placeSequence() {
    // console.log("placing sequence: ", sequence,"of length",sequenceLenght)

    sequencePrompt.textContent = ''
    for (let i = sequence.length - 1; i >= 0; i--) {
        // console.log(sequence[i])
        cells[sequence[i]].innerHTML = "<span>" + (letterSequence[Math.floor(sequenceLenght / 5) - 1][score][i]) + "</span>"
        cells[sequence[i]].style.background = `hsl(${colorSequence[i]},100%,50%)`
        cells[sequence[i]].classList.add("block")

        let div = document.createElement('div')
        div.classList.add("prompt")
        div.innerText = (letterSequence[Math.floor(sequenceLenght / 5) - 1][score][i])
        div.style.background = `hsl(${colorSequence[i]},100%,50%)`

        sequencePrompt.appendChild(div)
    }
}
function placePowerUps() {
    let numberOfPowerUps = Math.floor(8 * Math.random())

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
        // console.log(powerUpsNum[i])
        image.width = cells[coordinate].clientHeight
        cells[coordinate].appendChild(image)

        i++
    }

    powerUpCoordBackup = powerUpCoords
}

async function updateGame() {

    currentTime += timeIncrement


    if (sequenceFinsihed) {
        sequenceFinsihed = false
        generateSequence()
        placeSequence()
        // console.log(sequence)

        if (difficulty != "easy") {
            for (let i = 0; i < 3 * Math.random(); i++) {
                setUpPortal()
                updatePortal()
            }
            placePowerUps()
        }
    }

    // console.log(currentTime)
    scoreEle.textContent = "Score: " + score
    document.getElementById("lives").textContent = "Lives: " + lives
    document.getElementById("highScore").textContent = "High Score: " + highScore

    barObject.style.width = `${currentTime * 100 / defaultTime}%`
    if (currentTime >= defaultTime) {
        message = "You ran out of time!"
        endgame(1)
    }

    if (difficulty != "easy") updatePortal()
}

// grid
function setUpGrid(width = 10, sqaureWidth = 80) {
    let numSquares = (sqaureWidth / width) * (sqaureWidth / width)
    // console.log("number of squaare: ", numSquares)
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


// update all snakes

function updateSnakes(first1 = false, spawn1 = 0, first2 = false, spawn2 = side) {
    updateSnake1(first1, spawn1)
    if (numPlayers > 1) updateSnake2(first2, spawn2)
}

// update snake 1
function updateSnake1(first = false, spawn = 0) {
    if (first) snake = [spawn, spawn, spawn, spawn]    // 0 -> first snake, side -> second snake

    let classModifier = ''

    snake.forEach((i) => {
        cells[i].classList.add('snake' + classModifier)
    })

    console.log(snake)
    cells[snake[snake.length - 1]].classList.add('tail' + classModifier)
    cells[snake[snake.length - 1]].innerHTML = '<span></span>'

    cells[snake[0]].classList.add('snake' + classModifier)
    cells[snake[0]].classList.add('head' + classModifier)
    cells[snake[0]].innerHTML = '<span></span>'
}

// update snake 2
function updateSnake2(first = false, spawn = side) {
    if (first) snake2 = [spawn, spawn, spawn, spawn]    // 0 -> first snake, side -> second snake

    let classModifier = "2"

    snake2.forEach((i) => {
        cells[i].classList.add('snake' + classModifier)
    })

    // console.log(snake2)
    cells[snake2[snake2.length - 1]].classList.add('tail' + classModifier)
    cells[snake2[snake2.length - 1]].innerHTML = '<span></span>'

    cells[snake2[0]].classList.add('snake' + classModifier)
    cells[snake2[0]].classList.add('head' + classModifier)
    cells[snake2[0]].innerHTML = '<span></span>'
}

//modal dialougues 

//initial modal dialog 
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


    // choosing players

    let playerSelectorContainer = document.createElement("div")
    playerSelectorContainer.classList.add('chooseDifficultyContainer')

    let numberOfPlayersText = document.createElement("span")
    numberOfPlayersText.textContent = "Number Of Players: "
    numberOfPlayersText.classList.add('textChooseDifficulty')

    playerDropdown = document.createElement("select")
    playerDropdown.attributes.name = "difficutly"
    playerDropdown.classList.add('selectDropdown')

    let playersNumber = document.createElement("option")
    playersNumber.value = "Number of players"
    playersNumber.textContent = "Number of players"
    playersNumber.disabled = true
    playersNumber.classList.add('chooseDifficultyDropdown')

    let singlePlayer = document.createElement("option")
    singlePlayer.value = 1
    singlePlayer.textContent = "1 Player"

    let doublePlayer = document.createElement("option")
    doublePlayer.value = 2
    doublePlayer.textContent = "2 Players"

    playerDropdown.appendChild(playersNumber)
    playerDropdown.appendChild(singlePlayer)
    playerDropdown.appendChild(doublePlayer)

    playerSelectorContainer.appendChild(numberOfPlayersText)
    playerSelectorContainer.appendChild(playerDropdown)

    //-------------------------------------------------------------------------------- asking difficulty -------------------------------------------------------------------------------- 


    let chooseDifficultyContainer = document.createElement("div")
    chooseDifficultyContainer.classList.add('chooseDifficultyContainer')

    let textChooseDifficulty = document.createElement("span")
    textChooseDifficulty.textContent = "Choose a Difficulty:   "
    textChooseDifficulty.classList.add('textChooseDifficulty')

    selectDropdown = document.createElement("select")
    selectDropdown.attributes.name = "difficutly"
    selectDropdown.classList.add('selectDropdown')


    let chooseDifficulty = document.createElement("option")
    chooseDifficulty.value = "choose difficulty"
    chooseDifficulty.textContent = "choose difficulty"
    chooseDifficulty.disabled = true
    chooseDifficulty.classList.add('chooseDifficultyDropdown')

    let easyOption = document.createElement("option")
    easyOption.value = "easy"
    easyOption.textContent = "easy"
    easyOption.classList.add('easyOption')
    let hardOption = document.createElement("option")
    hardOption.value = "hard"
    hardOption.textContent = "hard"
    hardOption.classList.add('hardOption')

    selectDropdown.appendChild(chooseDifficulty)
    selectDropdown.appendChild(easyOption)
    selectDropdown.appendChild(hardOption)

    chooseDifficultyContainer.appendChild(textChooseDifficulty)
    chooseDifficultyContainer.appendChild(selectDropdown)

    //-------------------------------------------------------------------------------- grid size --------------------------------------------------------------------------------  

    let gridSizeContainer = document.createElement("div")
    gridSizeContainer.classList.add('chooseDifficultyContainer')

    let gridSizeText = document.createElement("span")
    gridSizeText.textContent = "Choose Grid Size: "
    gridSizeText.classList.add('gridSizeText')

    gridDropdown = document.createElement("select")
    gridDropdown.attributes.name = "Grid Size: "
    gridDropdown.classList.add('selectDropdown')


    let gridSizeOption = document.createElement("option")
    gridSizeOption.textContent = "choose grid size"
    gridSizeOption.disabled = true
    gridSizeOption.classList.add('chooseDifficultyDropdown')

    let easyOption20 = document.createElement("option")
    easyOption20.value = 20
    easyOption20.textContent = "20"
    easyOption20.classList.add('easyOption')
    let hardOption40 = document.createElement("option")
    hardOption40.value = 40
    hardOption40.textContent = "40"
    hardOption40.classList.add('hardOption')

    gridDropdown.appendChild(gridSizeOption)
    gridDropdown.appendChild(easyOption20)
    gridDropdown.appendChild(hardOption40)

    gridSizeContainer.appendChild(gridSizeText)
    gridSizeContainer.appendChild(gridDropdown)

    //-------------------------------------------------------------------------------- setting up start game -------------------------------------------------------------------------------- 

    startGameText = document.createElement("div")
    startGameText.classList.add('modalSelect')
    startGameText.classList.add('modalSelectText')

    startGameText.textContent = "Start Game"

    settings = document.createElement("div")
    settings.classList.add('modalSelect')
    settings.textContent = "Quit"

    option = 0

    settings.textContent = "Quit"
    settings.style.animation = "none"
    startGameText.textContent = ">  Start Game"
    startGameText.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"

    startGameText.addEventListener("touchstart", (e) => {
        e.preventDefault()
        option = 1

        startGameText.textContent = "Start Game"
        startGameText.style.animation = "none"
        settings.textContent = ">    Quit"
        settings.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"


        document.body.removeChild(modal)
        paused = false

    })
    settings.addEventListener("touchstart", (e) => {
        e.preventDefault()
        option = 0

        settings.textcontent = "quit"
        settings.style.animation = "none"
        startGameText.textcontent = ">  start game"
        startGameText.style.animation = "cursorselection 0.2s cubic-bezier(1,0,0,1),selecttext 0.5s cubic-bezier(1,0,0,1) infinite"

        window.close()
    })

    uiDiv.appendChild(chooseDifficultyContainer)
    uiDiv.appendChild(gridSizeContainer)
    uiDiv.appendChild(playerSelectorContainer)
    uiDiv.appendChild(startGameText)
    uiDiv.appendChild(settings)
    mainlayout.appendChild(h1)
    mainlayout.appendChild(h1_2)
    mainlayout.appendChild(h1_3)
    mainlayout.appendChild(uiDiv)
    modal.appendChild(mainlayout)

    document.body.appendChild(modal)
}

// dialogue for game lost
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

// pause modal
function pause() {
    if (!paused) {
        paused = true
        let modal = document.createElement("div")
        modal.id = "pause"
        let pauseText = document.createElement("span")

        let pressP = document.createElement("span")
        pressP.textContent = "press 'p' to resume"
        pressP.style.animation = "credits 0.7s infinite cubic-bezier(1,0,0,1)"
        pressP.classList.add("pressP")

        let pressS = document.createElement("span")
        pressS.textContent = "press 's' to save and quit"
        pressS.style.animation = "credits 0.0s infinite cubic-bezier(1,0,0,1)"
        pressS.classList.add("pressS")


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
        modal.appendChild(pressP)
        modal.appendChild(pressS)

        modal.classList.add("pause")
        modal.appendChild(screenBottom)

        document.body.appendChild(modal)
    } else {
        paused = false

        document.body.removeChild(document.getElementById("pause"))
    }

}

// save game state
function save() {
    let game = {}
    game["highscore"] = highScore

    game["sequence"] = sequence
    game["sequenceBackup"] = sequenceBackup

    game["difficulty"] = difficulty
    game["sequenceBackup"] = sequenceBackup
    game["gridSize"] = gridSize
    game["side"] = side

    game["cells"] = JSON.stringify(cells)
    game["displacement"] = displacement1
    game["snake"] = snake
    game["letterSequence"] = letterSequence
    game["colorSequence"] = colorSequence

    game["sequenceFinsihed"] = sequenceFinsihed
    game["sequenceLenght"] = sequenceLenght

    game["currentTime"] = currentTime


    game["score"] = score
    game["lives"] = lives


    game["paused"] = paused
    game["portals"] = portals

    game["letterSequence"] = letterSequence
    game["colorSequence"] = colorSequence
    game["sequenceFinished"] = sequenceFinsihed
    game["sequenceLenght"] = sequenceLenght

    game["powerUpCoords"] = powerUpCoords
    game["powerUpCoordBackup"] = powerUpCoordBackup
    game["powerUpsNum"] = powerUpsNum

    game["currentTime"] = currentTime
    console.log(game)
    sessionStorage.setItem("game", JSON.stringify(game))

    // saved()
    if (document.getElementById("savedSuccesText") == null) {
        let pauseModal = document.getElementById("pause")
        let savedSuccesText = document.createElement("span")
        savedSuccesText.id = "savedSuccesText"
        savedSuccesText.classList.add("savedSuccesText")
        savedSuccesText.textContent = "Saved Succesfully!"

        savedSuccesText.style.animation = "credits 0.0s infinite cubic-bezier(1,0,0,1)"
        savedSuccesText.classList.add("savedText")


        pauseModal.appendChild(savedSuccesText)


        // setTimeout(() => { window.location.reload() }, 250)
    } else {
        document.removeChild(document.getElementById("savedSuccesText"))
    }


}

// GAME SETUP 
function setup() {
    // console.log(highScore)
    initialSetup()
    // For debugging
    // initialised = true
    // difficulty = "easy"
    // gridSize = 20
    // numPlayers = 2
    // paused = true

    document.getElementById("leftBtn").onclick = function () {
        if (displacement1 != side) displacement1 = -side
    }
    document.getElementById("rightBtn").onclick = function () {
        if (displacement1 != -side) displacement1 = side
    }
    document.getElementById("upBtn").onclick = function () {
        if (displacement1 != 1) displacement1 = -1
    }
    document.getElementById("downBtn").onclick = function () {
        if (displacement1 != -1) displacement1 = 1

    }

    document.addEventListener('keydown', async function (e) {
        if (e.key === "ArrowLeft") {
            if (displacement1 != side) displacement1 = -side
        }
        else if (e.key === "a" && numPlayers > 1) { if (displacement2 != side) displacement2 = -side }
        else if (e.key === "ArrowRight") { if (displacement1 != -side) displacement1 = side }
        else if (e.key === "d" && numPlayers > 1) { if (displacement2 != -side) displacement2 = side }
        else if (e.key === "ArrowDown") {
            if (!initialised) {
                option = 1

                startGameText.textContent = "Start Game"
                startGameText.style.animation = "none"
                settings.textContent = ">    Quit"
                settings.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"
            }
            if (displacement1 != -1) displacement1 = 1
        }
        else if (e.key === "s" && paused) {
            save()
        }
        else if (e.key === "s" && numPlayers > 1) { if (displacement2 != -1) displacement2 = 1 }
        else if (e.key === "w" && numPlayers > 1) { if (displacement2 != 1) displacement2 = -1 }
        else if (e.key === "ArrowUp") {
            if (!initialised) {
                option = 0

                settings.textContent = "Quit"
                settings.style.animation = "none"
                startGameText.textContent = ">  Start Game"
                startGameText.style.animation = "cursorSelection 0.2s cubic-bezier(1,0,0,1),selectText 0.5s cubic-bezier(1,0,0,1) infinite"
            }
            if (displacement1 != 1) displacement1 = -1
        } else if (e.key === "p") {
            pause(paused)
        } else if (e.key === "Enter") {
            if (!initialised) {
                if (option == 0) {
                    difficulty = selectDropdown.options[selectDropdown.selectedIndex].value
                    gridSize = gridDropdown.options[gridDropdown.selectedIndex].value
                    numPlayers = playerDropdown.options[playerDropdown.selectedIndex].value


                    if ((sessionStorage.getItem('highScore' + difficulty)) == null) sessionStorage.setItem('highScore' + difficulty, 0)
                    highScore = sessionStorage.getItem('highScore' + difficulty)
                    console.log("difficulty: ", difficulty)

                    if (difficulty === "easy" && JSON.parse(sessionStorage.getItem('game')) == null) {
                        if (gridSize == 20) sequenceLenght = 5
                        if (gridSize == 40) sequenceLenght = 15
                    }

                    // console.log(difficulty, gridSize, sequenceLenght)

                    document.body.removeChild(modal)
                    initialised = true
                    // console.log(initialised)
                    paused = false

                    setUpGui();
                } else if (option == 23) {
                    this.location.reload()
                } else {
                    window.close()
                }
            }
        }
    })

    // setUpGui();  // debug
}

// initialising game grid
async function setUpGui() {
    if (initialised) {

        // initialised = true
        // gameLost("You Collided with a wall!")

        let size = Math.round(playground.clientWidth * 100 / window.innerHeight)
        // console.log(size)
        let squareSide = null
        // console.log("hmm difficulty now: ", difficulty)
        if (gridSize == 80) {
            if (JSON.parse(sessionStorage.getItem('game')) != null) {
                sequenceLenght = 15
            }
            squareSide = 1
        }
        else if (gridSize == 40) {
            if (JSON.parse(sessionStorage.getItem('game')) != null) {
                sequenceLenght = 10
            }
            squareSide = 2
        }
        else if (gridSize == 20) {
            squareSide = 5
        }
        // console.log(squareSide, gridSize)
        setUpGrid(squareSide, size)

        side = Math.floor(size / squareSide)
        // console.log(side)

        if (cells === "" || typeof cells === "undefined") {
            cells = []
            // console.log("generating cells")
            for (let i = 0; i < side * side; i++)
                cells[i] = document.getElementById("square" + i)

            // console.log(cells)
            // console.log("cells generated!")
        }

        updateSnakes(true, 0, true, 10 * side)
        // console.log(snake)

        let str = "linear-gradient(0.25turn,#300350,#94167f)"
        document.body.style.background = str

        if (JSON.parse(sessionStorage.getItem('game')) != null) placeSequence()
    }
}

// GAME LOOP 
function loop() {
    function updateLoop(timeout) {
        if (!paused) {
            if (lives > 0) {
                updateGame()
                moveSnakes(displacement1, displacement2)
            } else if (lives === 0) {
                console.log("you lost!")
                document.getElementById('die').play()
                gameLost()
                return;
            }
            // paused = true // uncomment to debug snake moverment

        } else {
        }

        if (difficulty === "easy") setTimeout(updateLoop, Math.floor(100))
        else setTimeout(updateLoop, Math.floor(100 * (1 - currentTime / defaultTime)))
    }
    setTimeout(updateLoop, 100)
}

//movement and collision detection 
function moveSnake1(displacement) {
    let collide = true
    collide = checkCollision(snake[0], displacement, 1)
    if (!collide) {
        cells[snake[0]].innerText = cells[snake[0]].innerText.replace(":D", '')
        cells[snake[0]].classList.remove('head')
        const tail = snake.pop()
        cells[tail].classList.remove('snake')
        cells[tail].classList.remove('tail')
        cells[tail].innerText = ''

        let x = snake[0] % side
        let y = Math.floor(snake[0] / side)

        let dx = 0
        let dy = 0

        if (displacement == 1) dx = 1
        else if (displacement == side) dy = 1
        else if (displacement == -1) dx = -1
        else if (displacement == -side) dy = -1

        x = (x + dx) % side
        y = (y + dy) % side

        let snakeNetDisplacement = (y * side + x)

        snake.unshift(snakeNetDisplacement)
        cells[snake[snake.length - 1]].classList.add('tail')
        cells[snake[snake.length - 1]].innerHTML = '<span></span>'

        cells[snake[0]].classList.add('snake')
        cells[snake[0]].classList.add('head')

        cells[snake[0]].innerHTML = '<span>:D</span>'
    } else if (collide) {
        endgame(1)
    }

    return collide;
}

function moveSnake2(displacement) {
    let collide = true
    collide = checkCollision(snake2[0], displacement, 2)
    if (!collide) {
        cells[snake2[0]].innerText = cells[snake2[0]].innerText.replace(":D", '')
        cells[snake2[0]].classList.remove('head2')
        const tail = snake2.pop()
        cells[tail].classList.remove('snake2')
        cells[tail].classList.remove('tail2')
        cells[tail].innerText = ''
        snake2.unshift((snake2[0] + displacement) % (side * side))

        cells[snake2[snake2.length - 1]].classList.add('tail2')
        cells[snake2[snake2.length - 1]].innerHTML = '<span></span>'

        cells[snake2[0]].classList.add('snake2')
        cells[snake2[0]].classList.add('head2')

        cells[snake2[0]].innerHTML = '<span>:D</span>'
    } else if (collide) {
        endgame(2)
    }

    return collide;
}

function moveSnakes(displacement1, displacement2 = -Infinity) {
    moveSnake1(displacement1)
    if (numPlayers > 1) moveSnake2(displacement2)
}

function checkCollision(coord, displacement, snakeNumber) {
    let y0 = Math.floor(coord % side)
    let x0 = Math.floor(coord / side)

    let yd = Math.floor(displacement % side)
    let xd = Math.floor(displacement / side)

    let x = x0 + xd
    let y = y0 + yd
    // // console.log(x * side + y, sequence)
    if (y > side - 1 || y < 0) {
        // console.log("wall collision")
        return false
    }
    // if (x > side - 1 || x < 0) {
    //     // console.log("wall collision")
    //     message = "You hit a wall!"
    //     return true
    // }
    const grid = x * side + (y % side)

    if (sequence.includes(grid)) {
        // console.log("block collision " + grid)
        return blockCollided(grid, snakeNumber)

    }

    if (numPlayers == 1) {
        if (snake.includes(grid)) {
            // console.log("snake collision")
            message = "You collided with yourself!"
            return true
        }
    } else {
        if (snakeNumber == 1) {
            // checking for 1st snake colliding on snake 2
            if (snake2.includes(grid)) {
                // console.log("snake collision")
                message = "Green Snake collided with the Purple Snake!"
                return true
            }
            // checking for 1st snake colliding on itself
            if (snake.includes(grid)) {
                // console.log("snake collision")
                message = "Green Snake Collided on itself!"
                return true
            }
        }
        else if (snakeNumber == 2) {
            // checking for 2st snake colliding on snake 1
            if (snake.includes(grid)) {
                // console.log("snake collision")
                message = "Purple Snake collided with the Green Snake!"
                return true
            }
            // checking for 2e snake colliding on itself
            if (snake2.includes(grid)) {
                // console.log("snake collision")
                message = "Purple Snake collided with itself!"
                return true
            }
        }
    }


    if (powerUpCoords.includes(coord)) {
        let index = powerUpCoordBackup.indexOf(coord)
        if (index != -1) {
            // console.log("power up: " + index)
            powerUpCoords = powerUpCoords.splice(powerUpCoords.indexOf(coord), 1)
            // console.log(powerUpCoords)
            if (powerUpsNum[index] != 0) powerUpMethod[powerUpsNum[index]]()
            else if (powerUpsNum[index] == 0) {
                powerUpMethod[powerUpsNum[index]](snakeNumber)
            }
            return false
        }
    }

    portals.forEach((portal) => {
        if (portal.includes(grid)) {
            // console1.log("portal collision")
            if (numPlayers == 1) {
                cells[snake[0]].classList.remove('head')
                cells[snake[0]].classList.remove('snake')
                cells[snake[0]].classList.add('square')
                cells[snake[0]].innerText = ""
                snake[0] = portal[(portal.indexOf(grid) + 1) % 2]
            } else if (numPlayers > 1) {
                if (snakeNumber == 1) {
                    cells[snake[0]].classList.remove('head')
                    cells[snake[0]].classList.remove('snake')
                    cells[snake[0]].classList.add('square')
                    cells[snake[0]].innerText = ""
                    snake[0] = portal[(portal.indexOf(grid) + 1) % 2]
                }
                else if (snakeNumber == 2) {
                    cells[snake2[0]].classList.remove('head')
                    cells[snake2[0]].classList.remove('snake')
                    cells[snake2[0]].classList.add('square')
                    cells[snake2[0]].innerText = ""
                    snake2[0] = portal[(portal.indexOf(grid) + 1) % 2]
                }
            }

            return false
        }
    })
    return false
}

function blockCollided(i, snakeNumber) {

    let color = sequenceBackup.indexOf(i)
    let last = sequence.pop()

    // console1.log(i, last, sequence)
    if (i == last && sequence.length > 0) {

        cells[i].classList.add('square')
        cells[i].classList.remove('block')
        cells[i].style.background = ""
        cells[i].innerText = ''

        // grow(true)
        let k = 0
        let str = "linear-gradient(0.25turn," + colorSequence.slice(-(sequenceLenght - color)).map((e) => "hsl(" + e + ",100%,40%) " + ((++k) / sequenceLenght) * 100 + "%").toLocaleString() + "," + Array(sequence.length).fill("hsl(" + colorSequence[sequenceLenght - color] + ",100%,40%)").toLocaleString() + ")"
        document.body.style.transition = 'background 2s ease-in-out'
        document.body.style.background = str
        sequencePrompt.firstChild.classList.add('prompt-done')
        setTimeout(() => sequencePrompt.removeChild(sequencePrompt.firstChild), 300)

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

        grow(true, snakeNumber)
        // console.log("sequence finsihed!")

        let str = "linear-gradient(0.25turn," + colorSequence.slice(-(sequenceLenght - color)).map((e) => "hsl(" + e + ",100%,40%)").toLocaleString() + "," + Array(sequence.length).fill("black").toLocaleString() + ")"
        document.body.style.background = str

        if (sequencePrompt.firstChild != null)
            sequencePrompt.removeChild(sequencePrompt.firstChild)


        sequenceFinsihed = true
        score++
        defaultTime += 50000 //+50s
        updateGame()
        return false;
    }
    else {
        // console.log("wrong sequence")
        message = "You Choose the Wrong Sequence!"
        lives = 0
        gameLost(message)
        return true
    }
}
function grow(grow, snakeNumber) {
    if (numPlayers == 1) {
        if (grow) {

            document.getElementById("grow").play()

            cells[snake[0]].innerText = ''
            cells[snake[0]].classList.remove('head')
            const tail = snake[snake.length - 1]
            cells[tail].classList.remove('snake')
            cells[tail].classList.remove('tail')
            cells[tail].innerText = ''
            snake.unshift((snake[0] + displacement1))
            cells[snake[snake.length - 1]].classList.add('tail')
            cells[snake[snake.length - 1]].classList.add('snake')
            cells[snake[snake.length - 1]].innerText = ''

            cells[snake[0]].classList.add('snake')
            cells[snake[0]].classList.add('head')
            cells[snake[0]].innerText = ''
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
            snake.unshift((snake[0] + displacement1))
            cells[snake[snake.length - 1]].classList.add('tail')
            cells[snake[snake.length - 1]].classList.add('snake')
            cells[snake[snake.length - 1]].innerText = ''

            cells[snake[0]].classList.add('snake')
            cells[snake[0]].classList.add('head')
            cells[snake[0]].innerText = 'UwU'
        }
    } else if (numPlayers > 1) {
        if (snakeNumber == 1) {
            if (grow) {

                document.getElementById("grow").play()

                cells[snake[0]].innerText = ''
                cells[snake[0]].classList.remove('head')
                const tail = snake[snake.length - 1]
                cells[tail].classList.remove('snake')
                cells[tail].classList.remove('tail')
                cells[tail].innerText = ''
                snake.unshift((snake[0] + displacement1))
                cells[snake[snake.length - 1]].classList.add('tail')
                cells[snake[snake.length - 1]].classList.add('snake')
                cells[snake[snake.length - 1]].innerText = ''

                cells[snake[0]].classList.add('snake')
                cells[snake[0]].classList.add('head')
                cells[snake[0]].innerText = ''
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
                snake.unshift((snake[0] + displacement1))
                cells[snake[snake.length - 1]].classList.add('tail')
                cells[snake[snake.length - 1]].classList.add('snake')
                cells[snake[snake.length - 1]].innerText = ''

                cells[snake[0]].classList.add('snake')
                cells[snake[0]].classList.add('head')
                cells[snake[0]].innerText = 'UwU'
            }
        } else if (snakeNumber == 2) {
            if (grow) {

                document.getElementById("grow").play()

                cells[snake2[0]].innerText = ''
                cells[snake2[0]].classList.remove('head2')
                const tail = snake2[snake2.length - 1]
                cells[tail].classList.remove('snake2')
                cells[tail].classList.remove('tail2')
                cells[tail].innerText = ''
                snake2.unshift((snake2[0] + displacement1))
                cells[snake2[snake2.length - 1]].classList.add('tail2')
                cells[snake2[snake2.length - 1]].classList.add('snake2')
                cells[snake2[snake2.length - 1]].innerText = ''
                cells[snake2[0]].classList.add('snake2')
                cells[snake2[0]].classList.add('head2')
                cells[snake2[0]].innerText = ''
            } else {
                cells[snake2[0]].innerText = ''
                cells[snake2[0]].classList.remove('head2')
                const delTail = snake2.pop()
                cells[delTail].classList.remove('snake')
                cells[delTail].classList.remove('tail2')
                cells[delTail].innerText = ''

                const tail = snake2.pop()
                cells[tail].classList.remove('snake2')
                cells[tail].classList.remove('tail2')
                cells[tail].innerText = ''
                snake2.unshift((snake2[0] + displacement1))
                cells[snake2[snake2.length - 1]].classList.add('tail2')
                cells[snake2[snake2.length - 1]].classList.add('snake2')
                cells[snake2[snake2.length - 1]].innerText = ''

                cells[snake2[0]].classList.add('snake2')
                cells[snake2[0]].classList.add('head2')
                cells[snake2[0]].innerText = 'UwU'
            }
        }
    }
}

// GAME END FUNCTION 

function endgame(snakeNumber = 1) {
    lives--
    document.getElementById('damage').play()
    updateSnakes()
    displacement1 = 1
    displacement2 = 1
    playerLost = snakeNumber
    if (numPlayers > 1) message = 'Snake ' + snakeNumber + ' lost!'
    if (lives > 0) {
        if (score > highScore) highScore = score
        sessionStorage.setItem("highScore" + difficulty, highScore)
        playground.classList.remove('playground-damage')
        playground.classList.add('playground-damage')

        setTimeout(() => {
            playground.classList.remove('playground-damage')
        }, 300)
    } else if (lives == 0) {
        if (score > highScore) highScore = score
        sessionStorage.setItem("highScore" + difficulty, highScore)
        gameLost(message)
        return;
    }
}

document.body.onload = async (e) => {
    let url = `https://random-word-api.herokuapp.com/word?length=${5}&number=100`
    const response = await fetch(url, {})
    if (response.ok) {
        letterSequence[0] = JSON.parse(await response.text())
    }

    let url1 = `https://random-word-api.herokuapp.com/word?length=${10}&number=100`
    const response1 = await fetch(url1, {})
    if (response1.ok) {
        letterSequence[1] = JSON.parse(await response1.text())
    }

    let url2 = `https://random-word-api.herokuapp.com/word?length=${15}&number=100`
    const response2 = await fetch(url2, {})
    if (response2.ok) {
        letterSequence[2] = JSON.parse(await response2.text())
    }

}

setup()
loop()