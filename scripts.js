window.onload = init;

document.addEventListener("visibilitychange", () => {
    console.log('test')
    if(!running){
        running = true
        if(animationRequest !== undefined)window.cancelAnimationFrame(animationRequest);
        animationRequest = window.requestAnimationFrame(gameLoop)
    }
    else{
        running = false
        if(animationRequest !== undefined)window.cancelAnimationFrame(animationRequest);
    }})

let mortals = []

let running = false


function init()
{
    let table = document.getElementById('table')
    let canvas = document.getElementById('canvas')
    table = initTable()
    canvas.appendChild(table)
    console.log(mortals)
    running = true;
    animationRequest = window.requestAnimationFrame(gameLoop)
}

function initTable()
{
    let table = document.createElement('table')
    table.id = 'table'
    let dudeSize = 10
    let width = window.innerWidth - 200
    let height = window.innerHeight - 200
    width /= dudeSize
    height /= dudeSize
    for(let yPos = 0; yPos < height; yPos++)
    {
        let row = document.createElement('tr')
        row.id = 'row-' + yPos
        let rowArray = []
        for(let xPos = 0; xPos < width; xPos++)
        {
            let column = document.createElement('td')
            let isAlive = Math.random() < 0.1
            column.className = 'mortal'
            column.id = 'element-' + xPos + ',' + yPos
            column.style = 'width:'+ dudeSize + 'px; height:' + dudeSize + 'px; padding:0; margin:0;'
            isAlive ? column.style.backgroundColor = 'black' : 'white'
            column.dataset.active = isAlive ? 1 : 0
            column.dataset.oldActive = isAlive ? 1 : 0
            column.onclick = onClick
            row.appendChild(column)
            rowArray.push(column)
        }
        table.appendChild(row)
        mortals.push(rowArray)
    }
    return table
}

function onClick(event)
{
    let element = event.currentTarget
    if(parseInt(element.dataset.active) === 1)
    {
        element.dataset.oldActive = 1
        element.dataset.active = 0
        element.style.backgroundColor = 'white'
    }
    else
    {
        element.dataset.oldActive = 0
        element.dataset.active = 1
        element.style.backgroundColor = 'black'
    }
    if(animationRequest !== undefined)window.cancelAnimationFrame(animationRequest);
    animationRequest = window.requestAnimationFrame(gameLoop)
}

let start

let animationRequest = undefined

function gameLoop(timestamp)
{
    if(start === undefined) start = timestamp
    runGeneration()
    if(running)
    {
        animationRequest = window.requestAnimationFrame(gameLoop)
    }
}

function runGeneration()
{
    for(let y = 0; y < mortals.length; y++)
    {
        for(let x = 0; x < mortals[y].length; x++)
        {
            let element = mortals[y][x]
            let livingNeighbors = 0
            let greaterY = y + 1 < mortals.length
            let lesserY = y - 1 >= 0
            let greaterX = x + 1 < mortals[y].length
            let lesserX = x - 1 >= 0
            if(lesserY) 
            {
                livingNeighbors += parseInt(mortals[y-1][x].dataset.oldActive)
                if(lesserX)
                {
                    livingNeighbors += parseInt(mortals[y-1][x-1].dataset.oldActive)
                }
                if(greaterX)
                {
                    livingNeighbors += parseInt(mortals[y-1][x+1].dataset.oldActive)
                }
            }
            if(greaterY)
            {
                livingNeighbors += parseInt(mortals[y+1][x].dataset.active)
                if(lesserX)
                {
                    livingNeighbors += parseInt(mortals[y+1][x-1].dataset.oldActive)
                }
                if(greaterX)
                {
                    livingNeighbors += parseInt(mortals[y+1][x+1].dataset.oldActive)
                }
            }
            if(lesserX) livingNeighbors += parseInt(mortals[y][x-1].dataset.oldActive)
            if(greaterX) livingNeighbors += parseInt(mortals[y][x+1].dataset.active)
            if(parseInt(element.dataset.active) === 1)
            {
                if(livingNeighbors < 2 || livingNeighbors > 3)
                {
                    element.dataset.active = 0
                    element.style.backgroundColor = 'white'
                }
                element.dataset.oldActive = 1
            }
            else
            {
                if(livingNeighbors === 3)
                {
                    element.dataset.active = 1
                    element.style.backgroundColor = 'black'
                }
                element.dataset.oldActive = 0
            }
        }
    }
}