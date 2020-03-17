const mapCanvas = document.getElementById('map-canvas')
const mapCtx = mapCanvas.getContext('2d')
mapCtx.font = "20px Arial";
mapCtx.fillText("Upload your map here", 10, 50);

const tilesheetCanvas = document.getElementById('tilesheet-canvas')
const tilesheetCtx = tilesheetCanvas.getContext('2d')
tilesheetCtx.font = "20px Arial";
tilesheetCtx.fillText("Upload your tilesheet here", 10, 50);

let hiddenCtx;
let hiddenCanvas;
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

let mapArray = [];
let oldArray;

function updateOutputElement() {
    document.getElementById("output-element").innerText = JSON.stringify(state.returnJSON)

    window.requestAnimationFrame(updateOutputElement)
}

if (window.location.href.indexOf("map") > -1) {
    document.addEventListener('click', printMousePos, true); 
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
        if ( idPrefix === "sheet" ) {
            state.tileSheetImage = image
            state.sheetUploaded = true
            state.sheetCol = (image.width / 37) - 1
            state.sheetRow = (image.height / 37) - 1
            tilesheetCanvas.width = image.width
            tilesheetCanvas.height = image.height

            if ( document.getElementById('hidden-canvas') ) {
            document.getElementById('hidden-canvas').width = image.width
            document.getElementById('hidden-canvas').height = image.height
            hiddenCtx.drawImage( image, 0, 0, image.width, image.height )
            }
        }
        else {
            state.mapUploaded = true
            state.mapCol = (image.width / 37) - 1
            state.mapRow = (image.height / 37) - 1
            mapCanvas.width = image.width
            mapCanvas.height = image.height
        }

        ctx.drawImage( image, 0, 0, image.width, image.height )
        if ( idPrefix === "sheet" && document.getElementById('output-element')) {
            drawNumbersOverTilesheet()
        }

        document.getElementById(idPrefix + '-paragraph').innerText = 'Width is ' + image.width + 'px, height is ' + image.height + 'px'

        ctx.image = image
    }
    var fu1 = document.getElementById("sheet-input").value;
    state.returnJSON.tilesheet = fu1 
}    

function drawNumbersOverTilesheet() {
    var tilesheetTileNumber = 0
    for ( var i = 0; i <= state.sheetRow; i++ ) {
        x = 0
        y = i * 37
        for ( var j = 0; j <= state.sheetCol; j++ ) {
            state.sheetState.push ( {'id': tilesheetTileNumber, 'x': x, 'y': y} )
            tilesheetCtx.rect( x, y, 37, 37 ) ;
            tilesheetCtx.stroke();

            tilesheetTileNumber += 1
            x += 37  
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
            const tileToFind = tilesheetCtx.getImageData( colIndex * 37, rowIndex * 37, 37, 37 );
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
            const tileToCompare = mapCtx.getImageData( colIndex * 37, rowIndex * 37, 37, 37 );

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

const yPos1 = 0;
const yPos2 = 37;
const yPos3 = 74;
const yPos4 = 111;

function generateXYPositions() {
    const inputVal = document.getElementById("tileNumInput").value
    let tilesheetXyArray = [];
    const rowsInSheet = ( inputVal + 1 ) / 4

    for ( i = 0; i <= rowsInSheet; i++ ) {
        tilesheetXyArray.push( ...generateRowXY( i ) )
    }
}

function generateRowXY( rowIndex ) {
    const xValue = rowIndex * 37

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

        const ctxHeight = rows * 37
        const ctxWidth = cols * 37

        mapCanvas.width = ctxWidth
        mapCanvas.height = ctxHeight        
        gridCtx = mapCtx
        state.mapMaking = true
    }
    else {
        rows =  cells.rows
        cols =  cells.cols  
        gridCtx = tilesheetCtx
    }

    for ( var i = 0; i <= ( rows - 1 ); i++ ) {
        state.mapMakerArray.push([])
        state.returnJSON.grid.push([])
        x = 0
        y = i * 37
        for ( var j = 0; j <= ( cols - 1 ) ; j++ ) {
            state.returnJSON.grid[i].push( 'E' )
            state.mapMakerArray[i].push( { id: 'E', 'x': x, 'y': y} )
            gridCtx.beginPath();
            gridCtx.lineWidth = "1";
            gridCtx.moveTo( x, y );
            gridCtx.lineTo( x, y + 37 )
            gridCtx.moveTo( x, y );
            gridCtx.lineTo( x + 37, y )
            gridCtx.stroke()
            x += 37  
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
            x : ( Math.floor( ( mouseXY.x - mapRect.left ) / 37) * 37 ) , 
            y : ( Math.floor( ( mouseXY.y - ( mapRect.y - documentRect.y ) ) / 37 ) * 37 )
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
            37, 37, 
            clickTile.x, clickTile.y, 
            37, 37 
        )        

    } 

    if ( mouseXY.x > tilesheetRect.left && mouseXY.x < tilesheetRect.right /* && mouseXY.y > tilesheetRect.top *//*  && mouseXY.y < tilesheetRect.bottom  */) {
        state.sheetState.forEach( (e) => {
            if ( ( Math.floor( ( mouseXY.x - tilesheetRect.left ) / 37 ) * 37 ) == e.x && ( Math.floor( ( mouseXY.y - ( tilesheetRect.y - documentRect.y ) ) / 37 ) * 37 ) == e.y ) {
                state.tileXyInCanvas = { 
                    id : e.id, 
                    x : ( Math.floor( ( mouseXY.x - tilesheetRect.left ) / 37 ) * 37 ) , 
                    y : ( Math.floor( ( mouseXY.y - ( tilesheetRect.y - documentRect.y ) ) / 37 ) * 37 ) 
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
            x : ( Math.floor( ( mouseXY.x - mapRect.left ) / 37) * 37 ) , 
            y : ( Math.floor( ( mouseXY.y - ( mapRect.y - documentRect.y ) ) / 37 ) * 37 )
        }
        state.mapMakerArray.forEach( (e) => {
            e.forEach( (a) => {
                if ( clickTile.x == a.x && clickTile.y == a.y ) {
                    a.id = "E"
                }
            } )

        } )

        mapCtx.clearRect( clickTile.x, clickTile.y, 37, 37 )
        mapCtx.beginPath();
        mapCtx.lineWidth = "1";
        mapCtx.moveTo( x, y );
        mapCtx.lineTo( x, y + 37 )
        mapCtx.moveTo( x, y );
        mapCtx.lineTo( x + 37, y )
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