const initializeCanvas = ( name, width, height, image ) => {
    const canvas = name == "SHEET" ? SHEET_CANVAS : HIDDEN_CANVAS;
    const ctx = name == "SHEET" ? SHEET_CTX : HIDDEN_CTX;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage( image, 0, 0, image.width, image.height, 0, 0, width, height );

    canvas.image = image;
}

const setTilesheet = ( src ) => {
    const image = new Image();
    
    image.src = src
    image.onload = ( ) => {       
        const sheetWidthInApp = image.width / 2;
        const sheetHeightInApp = image.height / 2;

        initializeCanvas( "SHEET", sheetWidthInApp, sheetHeightInApp, image );
        initializeCanvas( "HIDDEN", sheetWidthInApp, sheetHeightInApp, image );

        SHEET.initGrid( sheetHeightInApp / TILE_SIZE, 4 );
    }
}

const initMapCanvas = ( cell ) => {
    MAP_CANVAS.width = cell.cols * TILE_SIZE
    MAP_CANVAS.height = cell.rows * TILE_SIZE

    MAP.initGrid( cell.rows, cell.cols )
}

document.addEventListener("DOMContentLoaded", function() {
    const sheetX = SHEET_CANVAS.getBoundingClientRect( ).x;
    const sheetY = SHEET_CANVAS.getBoundingClientRect( ).y;
    const mapX = MAP_CANVAS.getBoundingClientRect( ).x;
    const mapY = MAP_CANVAS.getBoundingClientRect( ).y;

    SHEET = new Sheet( sheetX, sheetY );
    MAP = new Map( mapX, mapY );
});