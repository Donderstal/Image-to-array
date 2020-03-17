const mapCanvas = document.getElementById('map-canvas')
const mapCtx = mapCanvas.getContext('2d')
mapCtx.font = "20px Arial";
mapCtx.fillText("Upload your map here", 10, 50);

const tilesheetCanvas = document.getElementById('tilesheet-canvas')
const tilesheetCtx = tilesheetCanvas.getContext('2d')
tilesheetCtx.font = "20px Arial";
tilesheetCtx.fillText("Upload your tilesheet here", 10, 50);

const state = {
    mapUploaded: false,
    mapCol: 0,
    mapRow: 0,
    sheetUploaded: false,
    sheetCol: 0,
    sheetRow: 0,
    mapMaking: false,
    gridState: [],
    tileXyInCanvas: false
}

let mapArray = [];
let oldArray;

if (window.location.href.indexOf("map") > -1) {
    document.addEventListener('click', printMousePos, true); 
}

function printMousePos(e){

      cursorX = e.pageX;
      cursorY= e.pageY;
      console.log( "pageX: " + cursorX +",pageY: " + cursorY );

      if ( state.mapMaking === true ) {
          grabTileFromSheet( { x: e.pageX, y: e.pageY} )
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
        }
        else {
            state.mapUploaded = true
            state.mapCol = (image.width / 37) - 1
            state.mapRow = (image.height / 37) - 1
            mapCanvas.width = image.width
            mapCanvas.height = image.height
        }

        ctx.drawImage( image, 0, 0, image.width, image.height )
        /* if (window.location.href.indexOf("map") > -1) {
            drawGridFromInput({ "rows": state.sheetRow, "cols": state.sheetCol})
        } */
        
        document.getElementById(idPrefix + '-paragraph').innerText = 'Width is ' + image.width + 'px, height is ' + image.height + 'px'
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
    if ( cells == null ) {
        rows =  document.getElementById("rowInput").value
        cols =  document.getElementById("colInput").value

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


    for ( var i = 0; i <= rows; i++ ) {
        x = 0
        y = i * 37
        for ( var j = 0; j <= cols; j++ ) {
            state.gridState.push ( {'x': x, 'y': y} )
            gridCtx.rect( x, y, 37, 37 ) 
            gridCtx.stroke()
            x += 37  
        }
    }
}

function grabTileFromSheet( mouseXY ) {
    const tilesheetRect = tilesheetCanvas.getBoundingClientRect()
    const xInCanvas = mouseXY.x - tilesheetRect.left
    const yInCanvas = mouseXY.y - tilesheetRect.top

    const mapRect = mapCanvas.getBoundingClientRect()

    if ( mouseXY.x > mapRect.left && mouseXY.x < mapRect.right && mouseXY.y > mapRect.top && mouseXY.y < mapRect.bottom ) {
        clickTile = { x : ( Math.floor( ( mouseXY.x - mapRect.left ) / 37) * 37 ) , y : (Math.floor( (mouseXY.y - mapRect.top) / 37)  * 37 ) }
        mapCtx.drawImage( tilesheetCanvas, state.tileXyInCanvas.x, state.tileXyInCanvas.y, 37, 37, clickTile.x, clickTile.y, 37, 37 )
    } 

    if ( xInCanvas > 0 && yInCanvas > 0 ) {
        state.tileXyInCanvas = { x : ( Math.floor(xInCanvas / 37) * 37 ) , y : (Math.floor(yInCanvas / 37)  * 37 ) }
    }


}