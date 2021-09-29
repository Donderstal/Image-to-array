const toggleMode = ( event ) => {
    if( MAPMAKER_IN_DOORS_MODE && document.getElementById("door-sprites").checked ) {
        document.getElementById("edit-doors").click( );
    }
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
        case "roads-mode" : 
            initRoadsMode( )
            break;  
        case "spawn-mode" : 
            initSpawnPointsMode( )
            break;  
        case "doors-mode" :
            initDoorsMode( );
            break;
    }
}

const clearCurrentEditMode = ( ) => {
    MAPMAKER_IN_TILE_MODE = false;
    MAPMAKER_IN_OBJECT_MODE = false;
    MAPMAKER_IN_NEIGHBOURS_MODE = false;
    MAPMAKER_IN_ROADS_MODE = false;
    MAPMAKER_IN_DOORS_MODE = false;

    IN_SHOW_CHARACTER_SPRITES_MODE = false;
    IN_SHOW_MAP_OBJECTS_MODE = false;

    HAS_SELECTED_TILE = false;
    HAS_SELECTED_SPRITE = false;

    document.getElementById("selected-sprite-canvas").getContext('2d').clearRect( 0, 0, document.getElementById("selected-sprite-canvas").width, document.getElementById("selected-sprite-canvas").width )
    SELECTED_TILE_CTX.clearRect( 0, 0, SELECTED_TILE_CANVAS.width, SELECTED_TILE_CANVAS.height );
    [ 
        "map-foreground-canvas", "map-objects-options-div", "selected-sprite-div", "tilesheet-div", "selected-tile-div", "map-roads-canvas", "map-spawn-points-canvas"
    ].forEach( 
        ( e ) => { hideElementWithId( e) }
    );
}

const initTilesMode = ( ) => {
    MAPMAKER_IN_TILE_MODE = true;       
    hideListContainersAndShowGiven( "", false );    
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
    
    turnOnForeground( );
    hideListContainersAndShowGiven( "character-sprite-pngs-div" )
}

const initNeighboursMode = ( ) => {
    MAPMAKER_IN_NEIGHBOURS_MODE = true;
    hideListContainersAndShowGiven( "", false ); 
    [ "neighbour-options-div" ].forEach( 
        ( e ) => { showElementWithId( e) }
    );
    turnOnBackground( );
} 

const initRoadsMode = ( ) => {
    MAPMAKER_IN_ROADS_MODE = true;
    SELECTED_ROAD_DIRECTION = false;
    hideListContainersAndShowGiven( "", false ); 
    [ "road-options-div", "map-roads-canvas" ].forEach( 
        ( e ) => { showElementWithId( e) }
    );
    turnOnBackground( );
} 

const initSpawnPointsMode = ( ) => {
    MAPMAKER_IN_SPAWN_MODE = true;
    SELECTED_SPAWN_DIRECTION = false;
    hideListContainersAndShowGiven( "", false ); 
    [ "spawn-points-options-div", "map-spawn-points-canvas" ].forEach( 
        ( e ) => { showElementWithId( e) }
    );
    turnOnBackground( );
}

const initDoorsMode = ( ) => {
    MAPMAKER_IN_DOORS_MODE = true;

    [ "map-foreground-canvas", "doors-options-div" ].forEach( 
        ( e ) => { showElementWithId(e) }
    );
    
    turnOnForeground( );
    MAP_FOREGROUND.drawDoorsInGrid( )
    hideListContainersAndShowGiven( "doors-options-div" )
}

const turnOnForeground = ( ) => {
    document.getElementById("map-canvas").style.pointerEvents = "none"
    document.getElementById("map-foreground-canvas").style.pointerEvents = "auto"
}

const turnOnBackground = ( ) => {
    document.getElementById("map-canvas").style.pointerEvents = "auto"
    document.getElementById("map-foreground-canvas").style.pointerEvents = "none"
}

const hideElementWithId = ( id ) => {
    document.getElementById(id).style.visibility = "hidden";
    document.getElementById(id).style.display = "none";
};

const showElementWithId = ( id ) => {
    document.getElementById(id).style.visibility = "visible";
    document.getElementById(id).style.display = "block";
}