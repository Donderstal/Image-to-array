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

const mirrorTile = ( direction ) => {
    const isHorizontal = direction == "Hori";
    switch ( SHEET.activeTileSettings.mirror ) {
        case "No": 
            SHEET.updateActiveTileSettings('mirror', isHorizontal ? "Hori" : "Vert");
            break;
        case "Hori":
            SHEET.updateActiveTileSettings('mirror', isHorizontal ? "No" : "Both");
            break;
        case "Vert":
            SHEET.updateActiveTileSettings('mirror', isHorizontal ? "Both" : "No");
            break;
        case "Both":
            SHEET.updateActiveTileSettings('mirror', isHorizontal ? "Vert" : "Hori");
            break;
        default:
            alert('Error in mirroring tile. Call the police!')
    }
}

const flipTile = ( direction ) => {
    const isClockWise = direction == "Clockwise";
    switch ( SHEET.activeTileSettings.angle ) {
        case 0: 
            SHEET.updateActiveTileSettings('angle', isClockWise ? 90 : 270);
            break;
        case 90:
            SHEET.updateActiveTileSettings('angle', isClockWise ? 180 : 0);
            break;
        case 180:
            SHEET.updateActiveTileSettings('angle', isClockWise ? 270 : 90);
            break;
        case 270:
            SHEET.updateActiveTileSettings('angle', isClockWise ? 0 : 180);
            break;
        default:
            alert('Error in flipping tile. Call the police!')
    }
}

