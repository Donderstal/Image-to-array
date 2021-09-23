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

    MAP_FOREGROUND_CANVAS.width = cols * TILE_SIZE
    MAP_FOREGROUND_CANVAS.height = rows * TILE_SIZE

    MAP_FOREGROUND.initGrid( rows, cols )
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
    NEIGHBOURHOOD_TO_LOAD = JSON["neighbourhood"]
    MAPNAME_TO_LOAD = JSON["mapName"]
    CHARACTERS_TO_LOAD = JSON["characters"];
    OBJECTS_TO_LOAD = JSON["mapObjects"];

    document.getElementById("preview-map-neighbourhood").innerText = "Neighbourhood: " + NEIGHBOURHOOD_TO_LOAD
    document.getElementById("preview-map-tileset").innerText = "Tileset: " + TILESHEET_TO_LOAD
    document.getElementById("preview-map-name").innerText = "Map name: " + MAPNAME_TO_LOAD

    ROWS_TO_LOAD = parseInt(JSON.rows);
    COLUMNS_TO_LOAD = parseInt(JSON.columns);
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
        case 'FACING_UP':
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

const turnSelectedSprite = ( direction ) => {
    SELECTED_SPRITE_POSITION = direction;

    if ( IN_SHOW_CHARACTER_SPRITES_MODE ) {
        drawSpriteFromCanvasToSelectedSpriteCanvas( );
    }
    else if ( IN_SHOW_MAP_OBJECTS_MODE && document.getElementById(SELECTED_SPRITE).dataObject.dimensional_alignment == 'HORI_VERT' ) {
        drawMapObjectFromCanvasToSelectedSpriteCanvas();
    }

}

const drawMapObjectFromCanvasToSelectedSpriteCanvas = ( ) => {
    let selectedCanvas = document.getElementById(SELECTED_SPRITE);
    const currentSpriteCanvas = document.getElementById('selected-sprite-canvas');
    const currentSpriteCtx = currentSpriteCanvas.getContext('2d')    
    let dataObject = selectedCanvas.dataObject

    let dimensions = dataObject.getDimensions( SELECTED_SPRITE_POSITION );
    currentSpriteCanvas.width = dimensions.width
    currentSpriteCanvas.height = dimensions.height;
    currentSpriteCtx.clearRect( 0, 0, currentSpriteCanvas.width, currentSpriteCanvas.height );
    currentSpriteCtx.drawImage( 
        document.getElementById(SELECTED_SPRITE).image, 
        dataObject[SELECTED_SPRITE_POSITION] ? dataObject[SELECTED_SPRITE_POSITION].x : 0, 
        dataObject[SELECTED_SPRITE_POSITION] ? dataObject[SELECTED_SPRITE_POSITION].y : 0, 
        dimensions.width * 2, dimensions.height * 2, 
        0, 0, 
        dimensions.width, dimensions.height
    )
}

const generatePNGCanvasElements = ( ) => {
    const charactersWrapper = document.getElementById('character-sprite-pngs-div');

    PNG_FILES["characters"].forEach( ( e ) => {
        const image = new Image( );
        image.src = "/png-files/sprites/" + e;
        image.onload = ( ) => {
            const canvas = createSpriteCanvas( e, STRD_SPRITE_WIDTH, STRD_SPRITE_HEIGHT, image )
            const ctx = canvas.getContext("2d")
            ctx.drawImage( image, 0, 0, STRD_SPRITE_WIDTH, STRD_SPRITE_HEIGHT, 0, 0, STRD_SPRITE_WIDTH, STRD_SPRITE_HEIGHT)
            canvas.addEventListener( 'click', ( e ) => { characterListener( e, false ) });
            canvas.addEventListener( 'dragstart', ( e ) => { characterListener( e, true ) });
            charactersWrapper.append(canvas)            
        };
    });

    const spriteTypesList = [
        [getDoorsAndWindows( ), document.getElementById("windows-doors-pngs-div")],
        [getBackgroundItems( ), document.getElementById("background-items-pngs-div")],
        [getGroundedAtBottomItems( ), document.getElementById("grounded-at-bottom-items-pngs-div")],
        [getNotGroundedItems( ), document.getElementById("not-grounded-items-div")],
        [getCars(), document.getElementById("cars-div")],
        [getRestItems(), restWrapper = document.getElementById("rest-sprites-div")]
    ]

    spriteTypesList.forEach( ( e ) => {
        const dataList = e[0];
        const element = e[1];

        element.dataList = dataList;
        Object.keys( dataList ).forEach( ( x ) => {
            const image = new Image( );
            image.src = "/png-files/sprite-assets/" + dataList[x].src;
    
            image.onload = ( ) => {
                let dataObject = new DataObject( dataList[x] )
                let dimensions = dataObject.getDimensions( dataObject.isCar ? FACING_DOWN : "NO_DIRECTION" );
                const canvas = createSpriteCanvas( x, dimensions.width, dimensions.height, image )
                canvas.dataObject = dataObject
                const ctx = canvas.getContext("2d")  
                
                if ( dataObject.isCar ) {
                    ctx.drawImage( 
                        image, dataObject[FACING_DOWN].x, dataObject[FACING_DOWN].y, 
                        dimensions.width * 2, dimensions.height * 2, 
                        0, 0, canvas.width, canvas.height
                    );     
                }
                else {
                    ctx.drawImage( 
                        image, 0, 0, 
                        dimensions.width * 2, dimensions.height * 2, 
                        0, 0, canvas.width, canvas.height
                    );                    
                }

                canvas.addEventListener( 'click', ( e ) => {mapObjectListener(e, true)});
                canvas.addEventListener( 'dragstart', ( e ) => {mapObjectListener(e, true)});
                element.append(canvas)            
            };
        } )
    });
}

const createSpriteCanvas = ( id, width, height, image ) => {
    const canvas = document.createElement('canvas');
    canvas.className = "visible-canvas mb-2"
    canvas.id = id
    canvas.width = width;
    canvas.height = height
    canvas.image = image;
    canvas.setAttribute("draggable", true)
    return canvas;
}

const characterListener = ( e, isDragStart ) => {
    document.getElementById('selected-sprite-canvas').width = STRD_SPRITE_WIDTH;
    document.getElementById('selected-sprite-canvas').height = STRD_SPRITE_HEIGHT;
    SELECTED_SPRITE = e.target.id;
    SELECTED_SPRITE_POSITION = 'FACING_DOWN';

    drawSpriteFromCanvasToSelectedSpriteCanvas( );
    if ( isDragStart )
        handleDragStart( e )
}

const mapObjectListener = ( e, isDragStart ) => {
    SELECTED_SPRITE = e.target.id;
    if ( e.target.dataObject.isCar ) {
        IS_CAR = true;
        SELECTED_SPRITE_POSITION = 'FACING_DOWN'
    }
    else {
        IS_CAR = false;
        SELECTED_SPRITE_POSITION = false;
    }
    drawMapObjectFromCanvasToSelectedSpriteCanvas( );
    if ( isDragStart )
        handleDragStart( e )
}