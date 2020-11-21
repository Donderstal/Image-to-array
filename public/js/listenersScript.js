SHEET_CANVAS.addEventListener( 'click', captureSheetClick, true )
MAP_CANVAS.addEventListener( 'click', captureMapClick, true )
MAP_FOREGROUND_CANVAS.addEventListener( 'click', captureForegroundClick, true)

document.getElementById('export-map-button').addEventListener( 'click', exportMapData, true )

Array.from(document.getElementsByClassName('navigation-button')).forEach( ( e ) => {
    e.addEventListener( 'click', switchView, true )
} )

document.getElementById('clear-grid-button').addEventListener( 'click', clearMapGrid, true )

document.getElementById('clear-inputs-button').addEventListener( 'click', ( ) => {
    Array.from(document.getElementsByClassName('new-map-input')).forEach( ( e ) => {
        e.value = ""
    } )
})

document.getElementById("toggle-register-login").addEventListener( 'click', ( ) => {
    Array.from(document.getElementsByClassName('account-form')).forEach( ( e ) => {
        if ( e.className == "account-form inactive-form" && (e.id == "registration-form" || e.id == "login-form" )) {
            e.className = "account-form active-form"
        }
        else if ( e.className == "account-form inactive-form" && (e.id == "registration-form" || e.id == "login-form" )) {
            e.className = "account-form inactive-form"
        }
    } )
})

document.getElementById("toggle-request-restore").addEventListener( 'click', ( ) => {
    Array.from(document.getElementsByClassName('account-form')).forEach( ( e ) => {
        if ( e.className == "account-form inactive-form" && (e.id == "request-restore-form" || e.id == "restore-password-form" )) {
            e.className = "account-form active-form"
        }
        else if ( e.className != "account-form inactive-form" && (e.id == "request-restore-form" || e.id == "restore-password-form" )) {
            e.className = "account-form inactive-form"
        }
    } )
})

document.addEventListener("DOMContentLoaded", function() {
    setUserMapFilesIfLoggedIn( );
    const sheetX = SHEET_CANVAS.getBoundingClientRect( ).x;
    const sheetY = SHEET_CANVAS.getBoundingClientRect( ).y;
    const mapX = MAP_CANVAS.getBoundingClientRect( ).x;
    const mapY = MAP_CANVAS.getBoundingClientRect( ).y;
    const previewMapX = PREVIEW_MAP_CANVAS.getBoundingClientRect( ).x;
    const previewMapY = PREVIEW_MAP_CANVAS.getBoundingClientRect( ).y;
    const mapForegroundY = MAP_FOREGROUND_CANVAS.getBoundingClientRect( ).y;;
    const mapForegroundX = MAP_FOREGROUND_CANVAS.getBoundingClientRect( ).x;;

    PREVIEW_MAP = new Map( previewMapX, previewMapY, PREVIEW_MAP_CTX );
    SHEET = new Sheet( sheetX, sheetY, SHEET_CTX );
    MAP = new Map( mapX, mapY, MAP_CTX );
    MAP_FOREGROUND =  new ObjectsGrid( mapForegroundX, mapForegroundY, MAP_FOREGROUND_CTX );
});

Array.from(document.getElementsByClassName('select-map-for-overview-button')).forEach( ( e ) => {
    e.addEventListener( 'click', ( e ) => { 
        clearOverviewWrapperElements( )
        fetch('/master-folder/' + e.target.id)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(json => {
            MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD = json
            initializeMapOverviewCanvases( );
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            } 
        );
    }, true )
} )

OVERVIEW_CANVAS_WRAPPER.addEventListener('mousedown', (e) => {
    initMapOverviewScrollOnClick(e)
});
OVERVIEW_CANVAS_WRAPPER.addEventListener('mouseleave', () => {
    stopMapOverviewScroll();
});
OVERVIEW_CANVAS_WRAPPER.addEventListener('mouseup', () => { 
    stopMapOverviewScroll(); 
});
OVERVIEW_CANVAS_WRAPPER.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if ( IS_OVERVIEW_SCROLL_ACTIVE ) {
        mapOverviewHorizontalScroll( e ) 
    } else {
        return;
    }
});

MAP_CANVAS.addEventListener('mouseup', (event) => { 
    let endingTile = MAP.getTileAtXY(event.offsetX, event.offsetY);
    MOUSE_DRAG_RANGE.END = { 'x': endingTile.x, 'y': endingTile.y }
    const square = {
        TOP: MOUSE_DRAG_RANGE.START.y > MOUSE_DRAG_RANGE.END.y ? MOUSE_DRAG_RANGE.END.y : MOUSE_DRAG_RANGE.START.y,
        RIGHT: MOUSE_DRAG_RANGE.START.x > MOUSE_DRAG_RANGE.END.x ? MOUSE_DRAG_RANGE.START.x : MOUSE_DRAG_RANGE.END.x,
        BOTTOM: MOUSE_DRAG_RANGE.START.y > MOUSE_DRAG_RANGE.END.y ? MOUSE_DRAG_RANGE.START.y : MOUSE_DRAG_RANGE.END.y,
        LEFT: MOUSE_DRAG_RANGE.START.x > MOUSE_DRAG_RANGE.END.x ? MOUSE_DRAG_RANGE.END.x : MOUSE_DRAG_RANGE.START.x
    }
    
    MAP.grid.array.forEach( ( tile ) => {
        if ( tile.x >= square.LEFT && tile.x <= square.RIGHT && tile.y >= square.TOP && tile.y <= square.BOTTOM ){
            tile.setTileID( SHEET.activeTile.index )
            MAP_CTX.drawImage( 
                SELECTED_TILE_CANVAS, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2, tile.x, tile.y, TILE_SIZE, TILE_SIZE 
            )
        }
    } )
});
MAP_CANVAS.addEventListener('mousedown', (event) => {
    MOUSE_DRAG_IN_MAPMAKER = false;
    let startingTile = MAP.getTileAtXY(event.offsetX, event.offsetY);   
    MOUSE_DRAG_RANGE.START = { 'x': startingTile.x, 'y': startingTile.y }
});
MAP_CANVAS.addEventListener('mousemove', (event) => {
    MOUSE_DRAG_IN_MAPMAKER = true;
});

document.getElementById('arrow-flip-left').addEventListener( 'click', ( ) => { flipTile("Counter-clockwise") }, true )
document.getElementById('arrow-flip-right').addEventListener( 'click', ( ) => { flipTile("Clockwise") }, true )
document.getElementById('mirror-hori-icon').addEventListener( 'click', ( ) => { mirrorTile( ) }, true )

document.addEventListener('keydown', ( e ) => {
    if ( ON_MAPMAKER_PAGE && MAPMAKER_IN_TILE_MODE ) {
        // q
        if ( e.keyCode == 81 ){
            flipTile("Counter-clockwise")
        }
        // w
        else if ( e.keyCode == 87 ) {
            mirrorTile( )
        }
        // e
        else if ( e.keyCode == 69 ){
            flipTile("Clockwise")
        }
    }
    else if ( ON_MAPMAKER_PAGE && MAPMAKER_IN_OBJECT_MODE && IN_SHOW_CHARACTER_SPRITES_MODE ) {
        // q
        if ( e.keyCode == 81 ){
            turnSelectedSprite("FACING_LEFT")
        }
        // w
        else if ( e.keyCode == 87 ) {
            turnSelectedSprite( SELECTED_SPRITE_POSITION == "FACING_UP" ? "FACING_DOWN" : "FACING_UP" )
        }
        // e
        else if ( e.keyCode == 69 ){
            turnSelectedSprite('FACING_RIGHT')
        }
    }
})

document.getElementById("return-to-hood-selection").addEventListener( 'click', unsetNeighbourhoodForManager)

document.getElementById("tiles-mode").addEventListener( 'click', ( ) => {
    MAPMAKER_IN_TILE_MODE = !MAPMAKER_IN_TILE_MODE;
    MAPMAKER_IN_OBJECT_MODE = !MAPMAKER_IN_OBJECT_MODE;

    MAP_FOREGROUND_CANVAS.style.visibility = "hidden";
    MAP_FOREGROUND_CANVAS.style.display = "none";
    
    document.getElementById("map-canvas").style.pointerEvents = "auto"
    document.getElementById("map-foreground-canvas").style.pointerEvents = "none"
    
    document.getElementById("map-objects-options-div").style.visibility = "hidden";
    document.getElementById("map-objects-options-div").style.display = "none";
    
    document.getElementById("character-sprite-pngs-div").style.visibility = "hidden";
    document.getElementById("character-sprite-pngs-div").style.display = "none";
    document.getElementById("map-objects-pngs-div").style.visibility = "hidden";
    document.getElementById("map-objects-pngs-div").style.display = "none";

    document.getElementById("selected-sprite-div").style.visibility = "hidden";
    document.getElementById("selected-sprite-div").style.display = "none";

    document.getElementById("selected-tile-div").style.visibility = "visible";
    document.getElementById("selected-tile-div").style.display = "block";
    
    document.getElementById("tilesheet-div").style.visibility = "visible";
    document.getElementById("tilesheet-div").style.display = "block";
}, true )

document.getElementById("map-objects-mode").addEventListener( 'click', ( ) => {
    MAPMAKER_IN_TILE_MODE = !MAPMAKER_IN_TILE_MODE;
    MAPMAKER_IN_OBJECT_MODE = !MAPMAKER_IN_OBJECT_MODE;

    IN_SHOW_CHARACTER_SPRITES_MODE = false;
    IN_SHOW_MAP_OBJECTS_MODE = true;

    MAP_FOREGROUND_CANVAS.style.visibility = "visible";
    MAP_FOREGROUND_CANVAS.style.display = "block";

    document.getElementById("map-canvas").style.pointerEvents = "none"
    document.getElementById("map-foreground-canvas").style.pointerEvents = "auto"

    document.getElementById("map-objects-options-div").style.visibility = "visible";
    document.getElementById("map-objects-options-div").style.display = "block";

    document.getElementById("tilesheet-div").style.visibility = "hidden";
    document.getElementById("tilesheet-div").style.display = "none";
    document.getElementById("selected-tile-div").style.visibility = "hidden";
    document.getElementById("selected-tile-div").style.display = "none";

    document.getElementById("selected-sprite-div").style.visibility = "visible";
    document.getElementById("selected-sprite-div").style.display = "block";
    document.getElementById("map-objects-pngs-div").style.visibility = "visible";
    document.getElementById("map-objects-pngs-div").style.display = "block";
}, true )

document.getElementById("show-character-sprites").addEventListener( 'click', ( ) => {
    if ( !IN_SHOW_CHARACTER_SPRITES_MODE ) {
        IN_SHOW_CHARACTER_SPRITES_MODE = !IN_SHOW_CHARACTER_SPRITES_MODE;
        IN_SHOW_MAP_OBJECTS_MODE = !IN_SHOW_MAP_OBJECTS_MODE;

        const currentSpriteCanvas = document.getElementById('selected-sprite-canvas');
        const currentSpriteCtx = currentSpriteCanvas.getContext('2d')      
        currentSpriteCtx.clearRect( 0, 0, currentSpriteCanvas.width, currentSpriteCanvas.height );
            
        document.getElementById("character-sprite-pngs-div").style.visibility = "visible";
        document.getElementById("character-sprite-pngs-div").style.display = "block";

        document.getElementById("map-objects-pngs-div").style.visibility = "hidden";
        document.getElementById("map-objects-pngs-div").style.display = "none";
    }
}, true )

document.getElementById("show-map-objects").addEventListener( 'click', ( ) => {
    if ( !IN_SHOW_MAP_OBJECTS_MODE ) {
        IN_SHOW_CHARACTER_SPRITES_MODE = !IN_SHOW_CHARACTER_SPRITES_MODE;
        IN_SHOW_MAP_OBJECTS_MODE = !IN_SHOW_MAP_OBJECTS_MODE;

        const currentSpriteCanvas = document.getElementById('selected-sprite-canvas');
        const currentSpriteCtx = currentSpriteCanvas.getContext('2d')        
        currentSpriteCtx.clearRect( 0, 0, currentSpriteCanvas.width, currentSpriteCanvas.height );

        document.getElementById("map-objects-pngs-div").style.visibility = "visible";
        document.getElementById("map-objects-pngs-div").style.display = "block";
            
        document.getElementById("character-sprite-pngs-div").style.visibility = "hidden";
        document.getElementById("character-sprite-pngs-div").style.display = "none";
    }
}, true )