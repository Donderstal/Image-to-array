const mapCanvas = document.getElementById('map-canvas')
const mapCtx = mapCanvas.getContext('2d')
mapCtx.font = "20px Arial";

const tilesheetCanvas = document.getElementById('tilesheet-canvas')
const tilesheetCtx = tilesheetCanvas.getContext('2d')
tilesheetCtx.font = "20px Arial";

let hiddenCtx;
let hiddenCanvas;

const tile_size = 32

const state = {
    mapUploaded: false,
    mapCol: 0,
    mapRow: 0,
    sheetUploaded: false,
    sheetCol: 0,
    sheetRow: 0,
    mapMaking: false,
    sheetState: [],
    tileXyInCanvas: false,
    mapMakerArray: [],
    chosenTile: null,
    returnJSON: {
        "rows": 0,
        "columns": 0,
        "grid": [],
        "tilesheet": ""
    }
}

const yPos1 = 0;
const yPos2 = tile_size;
const yPos3 = tile_size * 2;
const yPos4 = tile_size * 3;

let mapArray = [];
let oldArray;

if ( document.getElementById('hidden-canvas') ) {
    hiddenCtx = document.getElementById('hidden-canvas').getContext('2d')
    hiddenCanvas = document.getElementById('hidden-canvas')

    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("help-button");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
    modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}

if (window.location.href.indexOf("map") > -1) {
    document.addEventListener('click', printMousePos, true); 
    window.requestAnimationFrame(updateOutputElement)
}

function updateOutputElement() {
    document.getElementById("output-element").textContent = JSON.stringify(state.returnJSON)

    window.requestAnimationFrame(updateOutputElement)
}

function printMousePos(e){

    cursorX = e.pageX;
    cursorY = e.pageY;

    if ( state.mapMaking === true ) {
    grabTileFromSheet( { x: e.pageX , y: e.pageY } )
    }

    if ( state.mapMaking === true && e.shiftKey ) {
    removeTileFromMap( { x: e.pageX, y: e.pageY} )
    }
}

function getImage( event ) {
    const src = URL.createObjectURL(event.target.files[0]);
    const image = new Image();
    const ctx = ( event.target.id === "sheet-input" ) ? tilesheetCtx : mapCtx;
    const idPrefix = event.target.id.split('-')[0]
    
    image.src = src
    image.onload = ( ) => {       
        const sheetWidthInApp = image.width / 2 
        const sheetHeightInApp = image.height / 2

        if ( idPrefix === "sheet" ) {
            state.tileSheetImage = image
            state.sheetUploaded = true
            state.sheetCol = (sheetWidthInApp / tile_size) - 1
            state.sheetRow = ( sheetHeightInApp / tile_size) - 1
            tilesheetCanvas.width = sheetWidthInApp
            tilesheetCanvas.height =  sheetHeightInApp

            if ( document.getElementById('hidden-canvas') ) {
            document.getElementById('hidden-canvas').width = sheetWidthInApp
            document.getElementById('hidden-canvas').height = sheetHeightInApp
            hiddenCtx.drawImage( image, 0, 0, image.width, image.height, 0, 0, sheetWidthInApp, sheetHeightInApp )
            }
        }
        else {
            state.mapUploaded = true
            state.mapCol = (image.width / tile_size) - 1
            state.mapRow = (image.height / tile_size) - 1
            mapCanvas.width = image.width
            mapCanvas.height = image.height
        }
        ctx.drawImage( image, 0, 0, image.width, image.height, 0, 0, sheetWidthInApp, sheetHeightInApp )
        if ( idPrefix === "sheet" && document.getElementById('output-element')) {
            drawNumbersOverTilesheet()
        }

        document.getElementById(idPrefix + '-paragraph').textContent = 'Width is ' + image.width + 'px, height is ' + image.height + 'px'

        ctx.image = image
    }
    var fu1 = document.getElementById("sheet-input").value;
    state.returnJSON.tilesheet = fu1 
}    

function drawNumbersOverTilesheet() {
    var tilesheetTileNumber = 0
    for ( var i = 0; i <= state.sheetRow; i++ ) {
        x = 0
        y = i * tile_size
        for ( var j = 0; j <= state.sheetCol; j++ ) {
            state.sheetState.push ( {'id': tilesheetTileNumber, 'x': x, 'y': y} )
            tilesheetCtx.rect( x, y, tile_size, tile_size) ;
            tilesheetCtx.font = "16px Georgia";
            tilesheetCtx.fillText(tilesheetTileNumber, x + 4, y + 16);
            tilesheetCtx.stroke();

            tilesheetTileNumber += 1
            x += tile_size  
        }
    }
}

function initComparison() {
    if (state.mapUploaded && state.sheetUploaded) {
        initMapArray()
        startIteratingOverCanvases()
    }
    else {
        alert('Please upload a map and a tilesheet')
    }

}

function initMapArray() {
    for ( i = 0; i <= state.mapRow; i++ ) {
        mapArray.push([])
    }
}

function startIteratingOverCanvases() {

    let lastTile;

    for ( var rowIndex = 0; rowIndex <= state.sheetRow; rowIndex++ ) {

        for ( var colIndex = 0; colIndex <= state.sheetCol; colIndex++ ) {
            const tileId = rowIndex * 4 + colIndex
            const tileToFind = tilesheetCtx.getImageData( colIndex * tile_size, rowIndex * tile_size, tile_size, tile_size );
            findSheetTileInMap(tileToFind, tileId)
            lastTile = tileId
        }
    }
    
    console.log(
        JSON.stringify( {
            "uniqueTiles": lastTile,
            "columns": state.mapCol,
            "rows": state.mapRow,
            "grid": mapArray
        })
    )

    oldArray = []
    oldArray = mapArray
    mapArray = []
}

function findSheetTileInMap(tileToFind, tileId) {
    for ( var rowIndex = 0; rowIndex <= state.mapRow; rowIndex++ ) {
        
        for ( var colIndex = 0; colIndex <= state.mapCol; colIndex++ ) {
            const tileToCompare = mapCtx.getImageData( colIndex * tile_size, rowIndex * tile_size, tile_size, tile_size );

            if ( isMatch(tileToFind.data, tileToCompare.data) ) {

                addTileIdToMapArray(tileId, colIndex, rowIndex)

            }
        }
    }

}

function isMatch(data1, data2){
    for( var i = 0; i < data1.length; i++ ) {

        if ( data1[i] != data2[i] ) {
            return false         
        }
    }

    return true
}

function addTileIdToMapArray(tileId, colIndex, rowIndex) {
    mapArray[rowIndex][colIndex] = tileId
}

function copyArrayToClipboard() {
    const el = document.createElement('textarea');
    el.value = oldArray;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function generateXYPositions() {
    const inputVal = document.getElementById("tileNumInput").value
    let tilesheetXyArray = [];
    const rowsInSheet = ( inputVal + 1 ) / 4

    for ( i = 0; i <= rowsInSheet; i++ ) {
        tilesheetXyArray.push( ...generateRowXY( i ) )
    }
}

function generateRowXY( rowIndex ) {
    const xValue = rowIndex * tile_size

    const returnValue = [ 
        { "y": xValue, "x": yPos1 },
        { "y": xValue, "x": yPos2 },
        { "y": xValue, "x": yPos3 },
        { "y": xValue, "x": yPos4 }
    ]

    return returnValue
}

function drawGridFromInput(cells = null) {
    let gridCtx;
    let rows;
    let cols;
    state.mapMakerArray = []

    if ( cells == null ) {
        rows =  document.getElementById("rowInput").value
        cols =  document.getElementById("colInput").value

        if ( rows == "" || cols == "" ) {
            alert('please fill in cols and rows before pressing the button')
            return
        }
        if ( rows > 16 || rows < 0 ) {
            alert('The number of rows must be between 1 and 16')
            return
        }
        if ( cols > 24 || cols < 0 ) {
            alert('The number of cols must be between 1 and 16')
            return
        }

        const ctxHeight = rows * tile_size
        const ctxWidth = cols * tile_size

        mapCanvas.width = ctxWidth
        mapCanvas.height = ctxHeight        
        gridCtx = mapCtx
        state.mapMaking = true
    }
    else {   
        rows =  cells.rows
        cols =  cells.cols  
        const ctxHeight = rows * tile_size
        const ctxWidth = cols * tile_size
        mapCanvas.width = ctxWidth
        mapCanvas.height = ctxHeight   
        gridCtx = mapCtx
    }

    for ( var i = 0; i <= ( rows - 1 ); i++ ) {
        state.mapMakerArray.push([])
        state.returnJSON.grid.push([])
        x = 0
        y = i * tile_size
        for ( var j = 0; j <= ( cols - 1 ) ; j++ ) {
            state.returnJSON.grid[i].push( 'E' )
            state.mapMakerArray[i].push( { id: 'E', 'x': x, 'y': y} )
            gridCtx.beginPath();
            gridCtx.lineWidth = "1";
            gridCtx.fillText( i, x, y)
            gridCtx.moveTo( x, y );
            gridCtx.lineTo( x, y + tile_size )
            gridCtx.moveTo( x, y );
            gridCtx.lineTo( x + tile_size, y )
            gridCtx.stroke()
            x += tile_size  
        }
    }
    state.returnJSON.grid
    state.returnJSON.columns = cols - 1
    state.returnJSON.rows = rows - 1
}

function grabTileFromSheet( mouseXY ) {
    const tilesheetRect = tilesheetCanvas.getBoundingClientRect()
    const mapRect = mapCanvas.getBoundingClientRect()
    const documentRect = document.getElementsByTagName('html')[0].getBoundingClientRect()

    if ( mouseXY.x > mapRect.left && mouseXY.x < mapRect.right && mouseXY.y > mapRect.top ) {
        clickTile = { 
            x : ( Math.floor( ( mouseXY.x - mapRect.left ) / tile_size) * tile_size ) , 
            y : ( Math.floor( ( mouseXY.y - ( mapRect.y - documentRect.y ) ) / tile_size ) * tile_size )
        }

        state.mapMakerArray.forEach( (e) => {
            e.forEach( (a) => {
                if ( clickTile.x == a.x && clickTile.y == a.y ) {
                    a.id = state.tileXyInCanvas.id
                }
            } )

        } )

        mapCtx.drawImage( 
            hiddenCanvas, 
            state.tileXyInCanvas.x, state.tileXyInCanvas.y, 
            tile_size, tile_size, 
            clickTile.x, clickTile.y, 
            tile_size, tile_size 
        )        

    } 

    if ( mouseXY.x > tilesheetRect.left && mouseXY.x < tilesheetRect.right /* && mouseXY.y > tilesheetRect.top *//*  && mouseXY.y < tilesheetRect.bottom  */) {
        state.sheetState.forEach( (e) => {
            if ( ( Math.floor( ( mouseXY.x - tilesheetRect.left ) / tile_size ) * tile_size ) == e.x && ( Math.floor( ( mouseXY.y - ( tilesheetRect.y - documentRect.y ) ) / tile_size ) * tile_size ) == e.y ) {
                state.tileXyInCanvas = { 
                    id : e.id, 
                    x : ( Math.floor( ( mouseXY.x - tilesheetRect.left ) / tile_size ) * tile_size ) , 
                    y : ( Math.floor( ( mouseXY.y - ( tilesheetRect.y - documentRect.y ) ) / tile_size ) * tile_size ) 
                }
            }
        } )
    }
}

function removeTileFromMap( mouseXY ) {
    const mapRect = mapCanvas.getBoundingClientRect()
    const documentRect = document.getElementsByTagName('html')[0].getBoundingClientRect()

    if ( mouseXY.x > mapRect.left && mouseXY.x < mapRect.right && mouseXY.y > mapRect.top ) {
        clickTile = { 
            x : ( Math.floor( ( mouseXY.x - mapRect.left ) / tile_size) * tile_size ) , 
            y : ( Math.floor( ( mouseXY.y - ( mapRect.y - documentRect.y ) ) / tile_size ) * tile_size )
        }
        state.mapMakerArray.forEach( (e) => {
            e.forEach( (a) => {
                if ( clickTile.x == a.x && clickTile.y == a.y ) {
                    a.id = "E"
                }
            } )

        } )

        mapCtx.clearRect( clickTile.x, clickTile.y, tile_size, tile_size )
        mapCtx.beginPath();
        mapCtx.lineWidth = "1";
        mapCtx.moveTo( x, y );
        mapCtx.lineTo( x, y + tile_size )
        mapCtx.moveTo( x, y );
        mapCtx.lineTo( x + tile_size, y )
        mapCtx.stroke()
    } 
}

function finishGrid ( ) {
    for ( var i = 0; i < state.returnJSON.grid.length; i++ ) {
        const jsonRow = state.returnJSON.grid[i]
        state.rowBro = state.mapMakerArray[i]
        for ( var j = 0; j < jsonRow.length; j++ ) {
            if ( state.rowBro[j] === undefined ) {
                console.log( state.returnJSON )
            }
            const tile = state.rowBro[j]
            jsonRow[j] = tile.id
        }
    }
    document.getElementById('output-element').innerText = JSON.stringify(state.returnJSON)
    document.getElementById('output-element').select();
    document.execCommand('copy');
}

document.addEventListener("DOMContentLoaded", function() {
    const cells = {
        'rows': 16,
        'cols': 24
    }
    drawGridFromInput(cells)
});