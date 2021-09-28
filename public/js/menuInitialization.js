const generatePNGCanvasElements = ( ) => {
    initCharactersDiv( );
    initMapObjectDivs( );
    setTimeout( ( ) => {
        initRoadSelectionDiv( );
    }, 150)
    setTimeout( ( ) => {
        initSpawnPointsSelectionDiv( );
    }, 250)
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

const initRoadSelectionDiv = ( ) => {
    [
        [ "car-left-sprite-canvas", FACING_LEFT ],
        [ "car-up-sprite-canvas", FACING_UP ],
        [ "car-right-sprite-canvas", FACING_RIGHT ],
        [ "car-down-sprite-canvas", FACING_DOWN ]
    ].forEach( ( e ) => {
        let carData = document.getElementById("car_a").dataObject;
        let carImage = document.getElementById("car_a").image;
        let destinationCanvas = document.getElementById( e[0] );
        let dimensions = carData.getDimensions( e[1] );
        destinationCanvas.width = dimensions.width;
        destinationCanvas.height = dimensions.height;

        destinationCanvas.getContext("2d").drawImage( 
            carImage, carData[e[1]].x, carData[e[1]].y, 
            dimensions.width * 2, dimensions.height * 2, 
            0, 0, destinationCanvas.width, destinationCanvas.height
        )

        destinationCanvas.addEventListener( 'click', roadsListener )
    });
    
    [
        [ "car-left-block-canvas", "#FFC000", "/png-files/arrow-left.png" ],
        [ "car-up-block-canvas", "#FFFC00", "/png-files/arrow-up.png" ],
        [ "car-right-block-canvas", "#FF0000", "/png-files/arrow-right.png" ],
        [ "car-down-block-canvas", "#00FFFF", "/png-files/arrow-down.png" ]
    ].forEach( ( e ) => {
        initBlockCanvas( e, true )
    });
}

const initSpawnPointsSelectionDiv = ( ) => {
    [
        [ "spawn-left-block-canvas", "#FFC000", "/png-files/arrow-left.png" ],
        [ "spawn-up-block-canvas", "#FFFC00", "/png-files/arrow-up.png" ],
        [ "spawn-right-block-canvas", "#FF0000", "/png-files/arrow-right.png" ],
        [ "spawn-down-block-canvas", "#00FFFF", "/png-files/arrow-down.png" ]
    ].forEach( ( e ) => {
        initBlockCanvas( e, false )
    });
}

const initBlockCanvas = ( e, isRoadCanvas ) => {
    let destinationCanvas = document.getElementById( e[0] );
    destinationCanvas.width = TILE_SIZE;
    destinationCanvas.height = TILE_SIZE;
    let ctx = destinationCanvas.getContext("2d")
    ctx.fillStyle = e[1]
    ctx.fillRect( 0, 0, TILE_SIZE, TILE_SIZE )

    let arrowImage = new Image( )
    arrowImage.src = e[2];
    arrowImage.onload = ( ) => {
        ctx.drawImage(
            arrowImage,
            0, 0,
            arrowImage.width, arrowImage.height,
            TILE_SIZE * .165, TILE_SIZE * .165,
            TILE_SIZE * .66, TILE_SIZE * .66
        )
    }

    destinationCanvas.addEventListener( 'click', isRoadCanvas ? roadsListener : spawnPointsListener )
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

const roadsListener = ( event ) => {
    [ ...document.getElementsByClassName("road-canvas-wrapper")].forEach( ( e ) =>{
        e.classList.remove( 'selected-road-button' )
    })

    if ( event.target.id.includes('left') ) {
        wrapperId = "road-canvas-wrapper-left";
        SELECTED_ROAD_DIRECTION = FACING_LEFT
    } else if ( event.target.id.includes('up') ) {
        wrapperId = "road-canvas-wrapper-up"
        SELECTED_ROAD_DIRECTION = FACING_UP
    } else if ( event.target.id.includes('right') ) {
        wrapperId = "road-canvas-wrapper-right"
        SELECTED_ROAD_DIRECTION = FACING_RIGHT
    } else if ( event.target.id.includes('down') ) {
        wrapperId = "road-canvas-wrapper-down"
        SELECTED_ROAD_DIRECTION = FACING_DOWN
    }

    document.getElementById(wrapperId).classList.add( 'selected-road-button' )
}

const spawnPointsListener = ( event ) => {
    [ ...document.getElementsByClassName("road-canvas-wrapper")].forEach( ( e ) =>{
        e.classList.remove( 'selected-road-button' )
    })

    if ( event.target.id.includes('left') ) {
        wrapperId = "spawn-points-wrapper-left";
        SELECTED_SPAWN_DIRECTION = FACING_LEFT
    } else if ( event.target.id.includes('up') ) {
        wrapperId = "spawn-points-wrapper-up"
        SELECTED_SPAWN_DIRECTION = FACING_UP
    } else if ( event.target.id.includes('right') ) {
        wrapperId = "spawn-points-wrapper-right"
        SELECTED_SPAWN_DIRECTION = FACING_RIGHT
    } else if ( event.target.id.includes('down') ) {
        wrapperId = "spawn-points-wrapper-down"
        SELECTED_SPAWN_DIRECTION = FACING_DOWN
    }

    document.getElementById(wrapperId).classList.add( 'selected-road-button' )
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