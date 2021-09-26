const generatePNGCanvasElements = ( ) => {
    const charactersWrapper = document.getElementById('character-sprite-pngs-div');

    initCharactersDiv( );
    initMapObjectDivs( );
}

const initCharactersDiv = ( ) => {
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
}

const initMapObjectDivs = ( ) => {
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
    HAS_SELECTED_SPRITE = true;
    SELECTED_SPRITE_POSITION = 'FACING_DOWN';

    drawSpriteFromCanvasToSelectedSpriteCanvas( );
    if ( isDragStart )
        handleDragStart( e )
}

const mapObjectListener = ( e, isDragStart ) => {
    SELECTED_SPRITE = e.target.id;
    HAS_SELECTED_SPRITE = true;
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