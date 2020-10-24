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