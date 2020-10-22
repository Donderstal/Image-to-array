const initializeSheetCanvas = ( width, height, image ) => {
    SHEET_CANVAS.width = width;
    SHEET_CANVAS.height = height;
    SHEET_CTX.drawImage( image, 0, 0, image.width, image.height, 0, 0, width, height );
    SHEET_CANVAS.image = image;  
    SHEET.setSheet( image.src )
    SHEET.initGrid( height / TILE_SIZE, 4 );
}

const initializeSelectedTileCanvas = ( ) => {
    SELECTED_TILE_CANVAS.width = TILE_SIZE * 2;
    SELECTED_TILE_CANVAS.height = TILE_SIZE * 2;
    
    SELECTED_TILE_CTX.fillStyle = "white";
    SELECTED_TILE_CTX.fillRect( 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );
}

const setTilesheet = ( src ) => {
    const image = new Image();
    
    image.src = src
    image.onload = ( ) => {       
        const sheetWidthInApp = image.width / 2;
        const sheetHeightInApp = image.height / 2;

        initializeSheetCanvas( sheetWidthInApp, sheetHeightInApp, image );
        initializeSelectedTileCanvas( );
    }
}

const initMapCanvas = ( rows, cols ) => {
    MAP_CANVAS.width = cols * TILE_SIZE
    MAP_CANVAS.height = rows * TILE_SIZE

    MAP.initGrid( rows, cols )
}

const clearMapGrid = ( ) => {
    MAP.clearGrid( )
}

document.addEventListener("DOMContentLoaded", function() {
    const sheetX = SHEET_CANVAS.getBoundingClientRect( ).x;
    const sheetY = SHEET_CANVAS.getBoundingClientRect( ).y;
    const mapX = MAP_CANVAS.getBoundingClientRect( ).x;
    const mapY = MAP_CANVAS.getBoundingClientRect( ).y;
    const previewMapX = PREVIEW_MAP_CANVAS.getBoundingClientRect( ).x;
    const previewMapY = PREVIEW_MAP_CANVAS.getBoundingClientRect( ).y;

    PREVIEW_MAP = new Map( previewMapX, previewMapY, "PREVIEW_MAP" );
    SHEET = new Sheet( sheetX, sheetY, "SHEET" );
    MAP = new Map( mapX, mapY, "MAP" );
});

Array.from(document.getElementsByClassName("map-selection-list-item-radio")).forEach( ( e ) => {
    e.addEventListener("click", ( e ) => {
        const attributes = document.getElementById(e.target.id).parentElement.attributes;
        const parentElement = document.getElementById(document.getElementById(e.target.id).parentElement.id);

        COLUMNS_TO_LOAD = parseInt(attributes["columns"].value) + 1;
        ROWS_TO_LOAD = parseInt(attributes["rows"].value) + 1;
        GRID_TO_LOAD = attributes["grid"].value.split(',');

        TILESHEET_TO_LOAD = attributes["tilesheet"].value
        MAPNAME_TO_LOAD = parentElement.id;
        if ( parentElement.getAttribute("neighbourhood") ) {
            NEIGHBOURHOOD_TO_LOAD = parentElement.getAttribute("neighbourhood").split('.')[0];      
            document.getElementById("preview-map-neighbourhood").innerText = "Neighbourhood: " + parentElement.getAttribute("neighbourhood").split('.')[0];                  
        }


        document.getElementById("preview-map-tileset").innerText = "Tileset: " + attributes["tilesheet"].value

        document.getElementById("preview-map-name").innerText = "Map name: " + parentElement.id;

        PREVIEW_MAP_CANVAS.width = COLUMNS_TO_LOAD * TILE_SIZE
        PREVIEW_MAP_CANVAS.height = ROWS_TO_LOAD * TILE_SIZE
        PREVIEW_MAP.initGrid( ROWS_TO_LOAD, COLUMNS_TO_LOAD );

        const image = new Image();
    
        image.src = '/png-files/tilesheets/' + TILESHEETS[attributes["tilesheet"].value].src;
        image.onload = ( ) => {       
            drawGrid( { 'rows': ROWS_TO_LOAD, 'columns': COLUMNS_TO_LOAD, 'tileSheet': image, 'grid': GRID_TO_LOAD }, TILESHEETS[attributes["tilesheet"].value].tiles, PREVIEW_MAP_CTX )
        }
    })
})

const calcTilesheetXyPositions = ( tilesInSheet ) => {
    let tileX = 0; let tileY = 0;
    let tilesheetXyValues = []

    for ( var i = 0; i <= tilesInSheet; i++ ) {
        tilesheetXyValues.push( { 'x': tileX, 'y': tileY } )
        tileX += TILE_SIZE * 2
        if ( i % 4 == 3 ) {
            tileX = 0
            tileY += TILE_SIZE * 2
        }
    }

    return tilesheetXyValues;
}

const drawGrid = ( currentMap, tilesInSheet, ctx ) => {
    const position = { 'x' : 0, 'y' : 0 }
    const tilesheetXyValues = calcTilesheetXyPositions( tilesInSheet )

    for ( var i = 0; i < currentMap.grid.length; i+=currentMap.columns ) {
        drawRow( currentMap, currentMap.grid.slice(i,i+currentMap.columns), position, tilesheetXyValues, ctx )

        position.y += TILE_SIZE
        position.x = 0;
    }
}

const drawRow = ( currentMap, currentRow, position, tilesheetXyValues, ctx ) => {
    for ( var j = 0; j < currentMap.columns; j++ ) {
        const currentTile = currentRow[j]

        drawTileInGridBlock( currentMap, currentTile, position, tilesheetXyValues, ctx )
        position.x += TILE_SIZE
    }
}

const drawTileInGridBlock = ( currentMap, tile, startPositionInCanvas, tilesheetXyValues, ctx ) => {
    if ( tile === "E" || tile === null) {
        return 
    }
    
    const blockSize = TILE_SIZE  
    const tilePositionInSheet = tilesheetXyValues[tile]

    ctx.drawImage(
        currentMap.tileSheet, 
        tilePositionInSheet.x, tilePositionInSheet.y,
        TILE_SIZE * 2, TILE_SIZE * 2,
        startPositionInCanvas.x, startPositionInCanvas.y,
        blockSize, blockSize
    )           
}