const initializeCanvas = ( name, width, height, image ) => {
    const canvas = name == "SHEET" ? SHEET_CANVAS : HIDDEN_CANVAS;
    const ctx = name == "SHEET" ? SHEET_CTX : HIDDEN_CTX;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage( image, 0, 0, image.width, image.height, 0, 0, width, height )

    canvas.image = image
}

const setTilesheet = ( src ) => {
    const image = new Image();
    
    image.src = src
    image.onload = ( ) => {       
        const sheetWidthInApp = image.width / 2;
        const sheetHeightInApp = image.height / 2;

        initializeCanvas( "SHEET", sheetWidthInApp, sheetHeightInApp, image );
        initializeCanvas( "HIDDEN", sheetWidthInApp, sheetHeightInApp, image );

        drawGrid( "SHEET", sheetHeightInApp / TILE_SIZE, 4 )
    }
}

const initMapCanvas = ( cells ) => {
    MAP_CANVAS.width = cells.cols * TILE_SIZE
    MAP_CANVAS.height = cells.rows * TILE_SIZE

    drawGrid( "MAP", cells.rows, cells.cols )
}

const drawGrid = ( canvas, rows, cols ) => {
    const ctx = canvas == "MAP" ? MAP_CTX : SHEET_CTX;

    for ( var i = 0; i <= ( rows - 1 ); i++ ) {
        x = 0
        y = i * TILE_SIZE
        for ( var j = 0; j <= ( cols - 1 ) ; j++ ) {
            ctx.beginPath();
            ctx.moveTo( x, y );
            ctx.lineTo( x, y + TILE_SIZE )
            ctx.moveTo( x, y );
            ctx.lineTo( x + TILE_SIZE, y )
            ctx.stroke()
            x += TILE_SIZE 
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initMapCanvas({ rows: MAX_ROWS, cols: MAX_COLS })
});