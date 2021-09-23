const getNodeWithID = ( ID ) => {
    return document.getElementById( ID );
}

const makeHiddenCanvasVisible = ( canvasElement ) => {
    canvasElement.classList.remove('invisible-canvas');
    canvasElement.classList.add('visible-canvas');
}

const hideVisibleCanvas = ( canvasElement ) => {
    canvasElement.classList.remove('visible-canvas');
    canvasElement.classList.add('invisible-canvas');
}

const setValueOfReadOnlyElement = ( elementID, value ) => {
    getNodeWithID(elementID).readOnly = false;
    getNodeWithID(elementID).value = value;
    getNodeWithID(elementID).readOnly = true;
}

const setTextContentOfElements = ( keyValuePairs ) => {
    for ( const key in keyValuePairs ) {
        getNodeWithID( key ).value = keyValuePairs[key];
    }
}

const createNodeWithClassOrID = ( element, className = null, id = null ) => {
    let node = document.createElement(element);
    node.className = className;
    node.id = id;

    return node;
}

const removeAllChildrenFromParent = ( elementID ) => {
    while (document.getElementById(elementID).firstChild) {
        document.getElementById(elementID).removeChild(document.getElementById(elementID).firstChild);
    }
}

const clearSpriteCanvas = ( ) => {
    const currentSpriteCanvas = document.getElementById('selected-sprite-canvas');
    const currentSpriteCtx = currentSpriteCanvas.getContext('2d')        
    currentSpriteCtx.clearRect( 0, 0, currentSpriteCanvas.width, currentSpriteCanvas.height );
} 

const hideListContainersAndShowGiven = ( divId, activateNewDiv = true ) => {
    const elementList = document.getElementsByClassName("right-list-container");
    for (let item of elementList) {
        console.log( item )
        console.log( item.style.visibility )
        item.style.visibility = "hidden";
        item.style.display = "none";
    }

    if ( activateNewDiv ) {
        document.getElementById(divId).style.visibility = "visible";
        document.getElementById(divId).style.display = "block";        
    }
}

const switchSpriteSettingMode = ( clickedElementId ) => {
    let switchMode =
    ( clickedElementId == "show-character-sprites" && !IN_SHOW_CHARACTER_SPRITES_MODE )
    || IN_SHOW_CHARACTER_SPRITES_MODE;

    if ( switchMode ) {
        IN_SHOW_CHARACTER_SPRITES_MODE = !IN_SHOW_CHARACTER_SPRITES_MODE;
        IN_SHOW_MAP_OBJECTS_MODE = !IN_SHOW_MAP_OBJECTS_MODE;
    }
}

class DataObject{
    constructor( data ) {
        Object.keys( data ).forEach( ( key ) =>{
            this[key] = data[key]
        })

        if ( this.isCar ) {
            this.setFrames( )
        }
    }

    get width_blocks( ) {
        if ( this["dimensional_alignment"] == "STANDARD") {
            return this.width_blocks_inner
        }
        else if ( this["dimensional_alignment"] == "HORI_VERT" ) {
            return this.hori_width_blocks
        }
        else if ( this["dimensional_alignment"] == "HORI_VERT" ) {
            return this.vert_width_blocks
        }
    }
    set width_blocks(width) {
        this.width_blocks_inner = width;
    }
    get height_blocks( ) {
        if ( this["dimensional_alignment"] == "STANDARD") {
            return this.height_blocks_inner
        }
        else if ( this["dimensional_alignment"] == "HORI_VERT" ) {
            return this.hori_height_blocks
        }
        else if ( this["dimensional_alignment"] == "HORI_VERT" ) {
            return this.vert_height_blocks
        }
    }    
    set height_blocks(height) {
        this.height_blocks_inner = height;
    }

    setFrames( ) {
        this[FACING_DOWN] = this.movement_frames[FACING_DOWN][0];
        this[FACING_LEFT] = this.movement_frames[FACING_LEFT][0];
        this[FACING_UP] = this.movement_frames[FACING_UP][0];
        this[FACING_RIGHT] = this.movement_frames[FACING_RIGHT][0];
    }

    getDimensionBlocks( direction ) {
        if ( direction == FACING_DOWN || direction == FACING_UP ) {
            return {
                "width": this.vert_width_blocks,
                "height": this.vert_height_blocks
            } 
        }
        else if ( direction == FACING_LEFT || direction == FACING_RIGHT ) {
            return {
                "width": this.hori_width_blocks,
                "height": this.hori_height_blocks
            } 
        }
        else {
            return {
                "width": this.width_blocks,
                "height": this.height_blocks
            } 
        }
    }

    getDimensions( direction ) {
        if ( direction == FACING_DOWN || direction == FACING_UP ) {
            return {
                "width": this.vert_width_blocks * TILE_SIZE,
                "height": this.vert_height_blocks * TILE_SIZE
            } 
        }
        else if ( direction == FACING_LEFT || direction == FACING_RIGHT ) {
            return {
                "width": this.hori_width_blocks * TILE_SIZE,
                "height": this.hori_height_blocks * TILE_SIZE
            } 
        } 
        else {
            return {
                "width": this.width_blocks * TILE_SIZE,
                "height": this.height_blocks * TILE_SIZE
            } 
        }
    }
}