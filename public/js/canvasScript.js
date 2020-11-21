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

const mirrorTile = (  ) => {
    document.getElementById('tile-mirrored-span').innerHTML =  "";
    let mirroredTextNode = document.createTextNode("Mirrored: " + !SHEET.activeTileSettings.mirrored);
    SHEET.updateActiveTileSettings( 'mirrored', !SHEET.activeTileSettings.mirrored);
    document.getElementById('tile-mirrored-span').append(mirroredTextNode);
}

const flipTile = ( direction ) => {
    document.getElementById('tile-angle-span').innerHTML =  "";

    const isClockWise = direction == "Clockwise";
    let newAngle;
    switch ( SHEET.activeTileSettings.angle ) {
        case 0: 
            newAngle = isClockWise ? 90 : 270
            break;
        case 90:
            newAngle = isClockWise ? 180 : 0;
            break;
        case 180:
            newAngle =  isClockWise ? 270 : 90;
            break;
        case 270:
            newAngle = isClockWise ? 0 : 180;
            break;
        default:
            alert('Error in flipping tile. Call the police!')
    }
    SHEET.updateActiveTileSettings('angle', newAngle);

    let angleTextNode = document.createTextNode("Angle: " + newAngle + "°");
    document.getElementById('tile-angle-span').append(angleTextNode);
}

const setMapJSON = ( JSON ) => {
    TILESHEET_TO_LOAD = JSON["tileSet"];
    NEIGHBOURHOOD_TO_LOAD = JSON["mapName"].split('/')[0];
    MAPNAME_TO_LOAD = JSON["mapName"].split('/')[2];

    document.getElementById("preview-map-neighbourhood").innerText = "Neighbourhood: " + NEIGHBOURHOOD_TO_LOAD
    document.getElementById("preview-map-tileset").innerText = "Tileset: " + TILESHEET_TO_LOAD
    document.getElementById("preview-map-name").innerText = "Map name: " + MAPNAME_TO_LOAD

    ROWS_TO_LOAD = JSON.rows + 1;
    COLUMNS_TO_LOAD = JSON.columns + 1;
    GRID_TO_LOAD = ( typeof JSON.grid[0] == 'string' || JSON.grid[0] == 'number' ) ? JSON.grid : JSON.grid.flat()


    PREVIEW_MAP_CANVAS.width = COLUMNS_TO_LOAD * TILE_SIZE
    PREVIEW_MAP_CANVAS.height = ROWS_TO_LOAD * TILE_SIZE
    PREVIEW_MAP.initGrid( ROWS_TO_LOAD, COLUMNS_TO_LOAD );
    PREVIEW_MAP.setTileGrid( GRID_TO_LOAD );
    PREVIEW_MAP.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[TILESHEET_TO_LOAD].src, PREVIEW_MAP.drawMapFromGridData );
}

const drawSpriteFromCanvasToSelectedSpriteCanvas = ( ) => {
    const currentSpriteCtx = document.getElementById('selected-sprite-canvas').getContext('2d')
    currentSpriteCtx.clearRect( 0, 0, STRD_SPRITE_WIDTH, STRD_SPRITE_HEIGHT );    
    let sourceY
    
    switch( SELECTED_SPRITE_POSITION ) {
        case 'FACING_DOWN':
            sourceY = 0;
            break;
        case 'FACING_LEFT':
            sourceY = STRD_SPRITE_HEIGHT
            break;
        case 'FACING_RIGHT':
            sourceY = STRD_SPRITE_HEIGHT *  2
            break;
        case 'FACING UP':
            sourceY = STRD_SPRITE_HEIGHT * 3
            break;
    }

    currentSpriteCtx.drawImage( 
        document.getElementById(SELECTED_SPRITE).image, 
        0, sourceY, 
        STRD_SPRITE_WIDTH, STRD_SPRITE_HEIGHT, 
        0, 0, 
        STRD_SPRITE_WIDTH, STRD_SPRITE_HEIGHT
    )
}

const generatePNGCanvasElements = ( ) => {
    const wrapper = document.getElementById('pngs-div')
    document.getElementById('selected-sprite-canvas').width = STRD_SPRITE_WIDTH;
    document.getElementById('selected-sprite-canvas').height = STRD_SPRITE_HEIGHT;

    PNG_FILES["characters"].forEach( ( e ) => {
        const image = new Image( );
        image.src = "/png-files/sprites/" + e;
        image.onload = ( ) => {
            const canvas = document.createElement('canvas');
            canvas.className = "visible-canvas"
            canvas.id = e
            canvas.width = STRD_SPRITE_WIDTH;
            canvas.height = STRD_SPRITE_HEIGHT;
            canvas.image = image;
            
            const ctx = canvas.getContext("2d")
            ctx.drawImage( image, 0, 0, STRD_SPRITE_WIDTH, STRD_SPRITE_HEIGHT, 0, 0, STRD_SPRITE_WIDTH, STRD_SPRITE_HEIGHT)

            canvas.addEventListener( 'click', ( e ) => {
                SELECTED_SPRITE = e.target.id;
                SELECTED_SPRITE_POSITION = 'FACING_DOWN';

                drawSpriteFromCanvasToSelectedSpriteCanvas( );
            })

            wrapper.append(canvas)            
        }

    })
}