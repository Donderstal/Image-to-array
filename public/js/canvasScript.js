const initializeCanvas = ( name, width, height, image ) => {
    const canvas = name == "SHEET" ? SHEET_CANVAS : HIDDEN_CANVAS;
    const ctx = name == "SHEET" ? SHEET_CTX : HIDDEN_CTX;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage( image, 0, 0, image.width, image.height, 0, 0, sheetWidthInApp, sheetHeightInApp )

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
    }
}

const drawGrid = ( cells ) => {
    MAP_CANVAS.width = cells.cols * TILE_SIZE
    MAP_CANVAS.height = cells.rows * TILE_SIZE

    for ( var i = 0; i <= ( cells.rows - 1 ); i++ ) {
        x = 0
        y = i * TILE_SIZE
        for ( var j = 0; j <= ( cells.cols - 1 ) ; j++ ) {
            MAP_CTX.beginPath();
            MAP_CTX.moveTo( x, y );
            MAP_CTX.lineTo( x, y + TILE_SIZE )
            MAP_CTX.moveTo( x, y );
            MAP_CTX.lineTo( x + TILE_SIZE, y )
            MAP_CTX.stroke()
            x += TILE_SIZE 
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    drawGrid({ rows: MAX_ROWS, cols: MAX_COLS })
});