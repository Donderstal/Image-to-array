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
        let element = getNodeWithID( key );
        element.tagName == 'INPUT' ? element.value = keyValuePairs[key] : element.innerText = keyValuePairs[key] ;
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

class MapRoad {
    constructor( direction ) {
        this.direction = direction

        this.topRow;
        this.bottomRow;

        this.leftCol;
        this.rightCol;
    }

    get isHorizontal( ) { return this.direction == FACING_LEFT || this.direction == FACING_RIGHT; };
    get isVertical( ) { return !this.isHorizontal; };
    get endsAtIntersection( ) { 
        switch( this.direction ) {
            case FACING_LEFT:
                return this.endCol != 1;
            case FACING_UP:
                return this.endRow != 1;
            case FACING_RIGHT:
                return this.endCol != MAP.grid.cols;
            case FACING_DOWN:
                return this.endRow != MAP.grid.rows;
        }
    }
    get hasStart( ) {
        switch( this.direction ) {
            case FACING_LEFT:
                return this.startCol == MAP.grid.cols;
            case FACING_UP:
                return this.startRow == MAP.grid.rows;
            case FACING_RIGHT:
                return this.startCol == 1;
            case FACING_DOWN:
                return this.startRow == 1;
        }
    }

    setRoadFromTileList( tileList ) {
        this.tileList = tileList;

        if ( this.isHorizontal ) {
            this.setRows( Math.min(...tileList.map(item => item.row)), Math.max(...tileList.map(item => item.row)) )
        }
        else {
            this.setCols( Math.min(...tileList.map(item => item.col)), Math.max(...tileList.map(item => item.col)) )
        }
        switch( this.direction ) {
            case FACING_LEFT:
                this.startCol = Math.max(...tileList.map(item => item.col));
                this.endCol = Math.min(...tileList.map(item => item.col));
                break;
            case FACING_UP:
                this.startRow = Math.max(...tileList.map(item => item.row));
                this.endRow = Math.min(...tileList.map(item => item.row));
                break;
            case FACING_RIGHT:
                this.startCol = Math.min(...tileList.map(item => item.col));
                this.endCol = Math.max(...tileList.map(item => item.col));
                break;
            case FACING_DOWN:
                this.startRow = Math.min(...tileList.map(item => item.row));
                this.endRow = Math.max(...tileList.map(item => item.row));
                break;
        }
    }

    mergeRoad( road ) {
        road.tileList.forEach( ( e ) => {
            let tile = e;
            let isInArray = false;
            for ( var i = 0; i < this.tileList.length; i++) {
                if (this.tileList[i] === tile) {
                    isInArray = true;
                }
            }
            
            if ( !isInArray ){
                this.tileList.push( tile );                
            }
            
        } )

        this.setRoadFromTileList( this.tileList )
    }

    clearTiles( tileList ) {
        tileList.forEach( ( e ) => {
            if ( this.tileList.includes( e ) ) {
                let tile = e;
                this.tileList = this.tileList.filter( ( e ) => { return e != tile; })
            }
        })

        this.setRoadFromTileList( this.tileList )
    }

    setRows( topRow, bottomRow ) {
        this.topRow = topRow;
        this.bottomRow = bottomRow;
    }

    setCols( leftCol, rightCol ) {
        this.leftCol = leftCol;
        this.rightCol = rightCol;
    }

    getExportObject( ) {
        let exportObject = {
            "direction": this.direction,
            "alignment": this.isHorizontal ? "HORI" : "VERT",
            "hasStart": this.hasStart
        }

        if ( this.isHorizontal ) {
            exportObject["topRow"] = this.topRow;
            exportObject["bottomRow"] = this.bottomRow;
        }
        else {
            exportObject["leftCol"] = this.leftCol;
            exportObject["rightCol"] = this.rightCol;
        }

        return exportObject;
    }
}