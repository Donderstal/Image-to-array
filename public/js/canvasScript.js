const tile_size = 32;

const setTilesheet = ( src ) => {
    const image = new Image();
    
    image.src = src
    image.onload = ( ) => {       
        const sheetWidthInApp = image.width / 2 
        const sheetHeightInApp = image.height / 2
        const hiddenCanvas = document.getElementById('hidden-canvas')
        const tilesheetCanvas = document.getElementById('tilesheet-canvas')

        tilesheetCanvas.width = sheetWidthInApp
        tilesheetCanvas.height =  sheetHeightInApp

        hiddenCanvas.width = sheetWidthInApp
        hiddenCanvas.height = sheetHeightInApp

        hiddenCanvas.getContext("2d").drawImage( image, 0, 0, image.width, image.height, 0, 0, sheetWidthInApp, sheetHeightInApp )
        tilesheetCanvas.getContext("2d").drawImage( image, 0, 0, image.width, image.height, 0, 0, sheetWidthInApp, sheetHeightInApp )

        tilesheetCanvas.image = image
    }
}

const drawGrid = ( cells ) => {
    const rows =  cells.rows
    const cols =  cells.cols  
    document.getElementById('map-canvas').width = rows * tile_size
    document.getElementById('map-canvas').height = rows * tile_size  
    gridCtx = document.getElementById('map-canvas').getContext('2d')

    for ( var i = 0; i <= ( rows - 1 ); i++ ) {
        x = 0
        y = i * tile_size
        for ( var j = 0; j <= ( cols - 1 ) ; j++ ) {
            gridCtx.beginPath();
            gridCtx.lineWidth = "1";
            gridCtx.fillText( i, x, y)
            gridCtx.moveTo( x, y );
            gridCtx.lineTo( x, y + tile_size )
            gridCtx.moveTo( x, y );
            gridCtx.lineTo( x + tile_size, y )
            gridCtx.stroke()
            x += tile_size  
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const cells = {
        'rows': 16,
        'cols': 24
    }
    drawGrid(cells)
});