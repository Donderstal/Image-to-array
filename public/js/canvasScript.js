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
    let mirrorSetting = SHEET.activeTile.settings.mirror;
    const isHorizontal = direction == "Hori";
    switch ( mirrorSetting ) {
        case "No": 
            SHEET.activeTile.settings.mirror = isHorizontal ? "Hori" : "Vert";
            break;
        case "Hori":
            SHEET.activeTile.settings.mirror = isHorizontal ? "No" : "Both";
            break;
        case "Vert":
            SHEET.activeTile.settings.mirror = isHorizontal ? "Both" : "No";
            break;
        case "Both":
            SHEET.activeTile.settings.mirror = isHorizontal ? "Vert" : "Hori";
            break;
        default:
            alert('Error in mirroring tile. Call the police!')
    }
}

const flipTile = ( direction ) => {
    let angleSetting = SHEET.activeTile.settings.angle;
    const isClockWise = direction == "Hori";
    switch ( angleSetting ) {
        case 0: 
            SHEET.activeTile.settings.angle = isClockWise ? 90 : 270;
            break;
        case 90:
            SHEET.activeTile.settings.angle = isClockWise ? 180 : 0;
            break;
        case 180:
            SHEET.activeTile.settings.angle = isClockWise ? 270 : 90;
            break;
        case 270:
            SHEET.activeTile.settings.angle = isClockWise ? 0 : 180;
            break;
        default:
            alert('Error in flipping tile. Call the police!')
    }
}

