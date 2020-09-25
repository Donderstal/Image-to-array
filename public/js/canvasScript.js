const tile_size = 32;

const setTilesheet = ( src ) => {
    const image = new Image();
    
    image.src = src
    image.onload = ( ) => {       
        const sheetWidthInApp = image.width / 2 
        const sheetHeightInApp = image.height / 2

        SHEET_CANVAS.width = sheetWidthInApp
        SHEET_CANVAS.height =  sheetHeightInApp

        HIDDEN_CANVAS.width = sheetWidthInApp
        HIDDEN_CANVAS.height = sheetHeightInApp

        HIDDEN_CTX.drawImage( image, 0, 0, image.width, image.height, 0, 0, sheetWidthInApp, sheetHeightInApp )
        SHEET_CTX.drawImage( image, 0, 0, image.width, image.height, 0, 0, sheetWidthInApp, sheetHeightInApp )

        SHEET_CANVAS.image = image
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
    const cells = {
        'rows': 16,
        'cols': 24
    }
    drawGrid({ rows: MAX_ROWS, cols: MAX_COLS })
});