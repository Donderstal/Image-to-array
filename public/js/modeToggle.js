const toggleMode = ( event ) => {
    clearCurrentEditMode( )
    switch( event.target.id ) {
        case "tiles-mode" : 
            initTilesMode( )
            break;
        case "map-objects-mode" :
            initMapObjectsMode( )
            break;
        case "neighbours-mode" : 
            initNeighboursMode( )
            break;  
    }
}

const clearCurrentEditMode = ( ) => {
    MAPMAKER_IN_TILE_MODE = false;
    MAPMAKER_IN_OBJECT_MODE = false;
    HAS_SELECTED_TILE = false;
    HAS_SELECTED_SPRITE = false;

    document.getElementById("selected-sprite-canvas").getContext('2d').clearRect( 0, 0, document.getElementById("selected-sprite-canvas").width, document.getElementById("selected-sprite-canvas").width )
    SELECTED_TILE_CTX.clearRect( 0, 0, SELECTED_TILE_CANVAS.width, SELECTED_TILE_CANVAS.height )
}

const initTilesMode = ( ) => {
    MAPMAKER_IN_TILE_MODE = true;       
    hideListContainersAndShowGiven( "", false );    

    [ "map-foreground-canvas", "map-objects-options-div", "selected-sprite-div" ].forEach( 
        ( e ) => { hideElementWithId( e) }
    );
    [ "tilesheet-div", "selected-tile-div" ].forEach( 
        ( e ) => { showElementWithId( e) }
    );  

    document.getElementById("map-canvas").style.pointerEvents = "auto"
    document.getElementById("map-foreground-canvas").style.pointerEvents = "none"
} 

const initMapObjectsMode = ( ) => {
    MAPMAKER_IN_OBJECT_MODE = true;
    IN_SHOW_CHARACTER_SPRITES_MODE = true;
    IN_SHOW_MAP_OBJECTS_MODE = false;

    [ "map-foreground-canvas", "map-objects-options-div", "selected-sprite-div" ].forEach( 
        ( e ) => { showElementWithId( e) }
    );

    [ "tilesheet-div", "selected-tile-div"].forEach( 
        ( e ) => { hideElementWithId( e) }
    );

    document.getElementById("map-canvas").style.pointerEvents = "none"
    document.getElementById("map-foreground-canvas").style.pointerEvents = "auto"
    hideListContainersAndShowGiven( "character-sprite-pngs-div" )
}

const initNeighboursMode = ( ) => {

} 

const hideElementWithId = ( id ) => {
    document.getElementById(id).style.visibility = "hidden";
    document.getElementById(id).style.display = "none";
};

const showElementWithId = ( id ) => {
    document.getElementById(id).style.visibility = "visible";
    document.getElementById(id).style.display = "block";
}