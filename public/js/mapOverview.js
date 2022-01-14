/// Scrolling listeners;
const stopMapOverviewScroll = ( ) => {
    IS_OVERVIEW_SCROLL_ACTIVE = false;
}

const initMapOverviewScrollOnClick = ( event ) => {
    IS_OVERVIEW_SCROLL_ACTIVE = true;
    OVERVIEW_SCROLL_Y_COUNTER = event.pageY - OVERVIEW_CANVAS_WRAPPER.offsetTop;
    OVERVIEW_SCROLL_X_COUNTER = event.pageX - OVERVIEW_CANVAS_WRAPPER.offsetLeft;
    OVERVIEW_SCROLL_TOP = OVERVIEW_CANVAS_WRAPPER.scrollTop;    
    OVERVIEW_SCROLL_LEFT = OVERVIEW_CANVAS_WRAPPER.scrollLeft;    
}

const mapOverviewHorizontalScroll = ( event ) => {
    const x = event.pageX - OVERVIEW_CANVAS_WRAPPER.offsetLeft;
    const stepHori = x - OVERVIEW_SCROLL_X_COUNTER;
    OVERVIEW_CANVAS_WRAPPER.scrollLeft = OVERVIEW_SCROLL_LEFT - stepHori;

    const y = event.pageY - OVERVIEW_CANVAS_WRAPPER.offsetTop;
    const stepVert = y - OVERVIEW_SCROLL_Y_COUNTER;
    OVERVIEW_CANVAS_WRAPPER.scrollTop = OVERVIEW_SCROLL_TOP - stepVert;
}

const setMapOverviewElementsTotalWidth = ( width ) => {
    OVERVIEW_CANVAS_WRAPPER.width = width;
}

const clearOverviewWrapperElements = ( ) => {
    removeAllChildrenFromParent( "map-overview-canvas-wrapper" );
}


const setMapClass = ( mapClass, mapCanvas, mapData, canvasX, canvasY ) => {
    mapClass      = new Map( canvasX, canvasY, mapCanvas.getContext( "2d" ) );
    mapClass.initGrid( mapData.rows, mapData.columns );
    mapClass.setTileGrid( mapData.grid.flat(1) );
    mapClass.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[mapData.tileSet].src, mapClass.drawMapFromGridData );
}

const setCanvasElementData = ( element, canvasX, canvasY ) => {
    const mapData = element.mapData;
    setOverviewCanvas( element.mapCanvas );
    setMapClass( element.mapClass, element.mapCanvas, mapData, canvasX, canvasY );
}

const handleShowSubMapsButtonClick = ( event ) => {
    clearOverviewWrapperElements( );

    if ( IN_SUBMAP_OVERVIEW ) {
        MAP_OVERVIEW_CURRENT_SUBMAP = null;
        IN_SUBMAP_OVERVIEW = false;
    }
    else {
        clearOverviewWrapperElements( );
        MAP_OVERVIEW_CURRENT_SUBMAP = MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD[event.target.id.split('/')[2]].subMaps;
        IN_SUBMAP_OVERVIEW = true;
    }

    initializeMapOverviewCanvases( );     
}

const initializeMapOverviewCanvases = ( ) => {
    console.log(MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD);
    new CanvasGrid(MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD)
}

class CanvasSlot {
    constructor( key, column, row ) {
        this.isSet = false;
        this.key = key;
        this.column = column;
        this.row = row;
        this.setCanvas( );
    }

    drawMap( ) {
        this.map = new Map( this.canvas.x, this.canvas.y, this.canvas.getContext( "2d" ) );
        this.map.initGrid( this.rows, this.columns );
        this.map.setTileGrid( this.grid );
        this.map.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[this.tileSet].src, (() => {
            this.map.drawMapFromGridData( )
            this.spriteGrid = new ObjectsGrid( this.canvas.x, this.canvas.y, this.canvas.getContext( "2d" ) );
            this.spriteGrid.initGrid( this.rows, this.columns, false );
            this.spriteGrid.setCharacters( this.characters );
            this.spriteGrid.setObjects( this.objects );
            this.spriteGrid.drawSpritesInGrid( false );        
        }).bind(this) );

    }

    setCanvas( ) {
        this.canvas = createNodeWithClassOrID( 'canvas', "overview-canvas", this.key );
        this.canvas.width = MAX_CANVAS_WIDTH;
        this.canvas.height = MAX_CANVAS_HEIGHT;
        this.canvas.style.gridRow = this.row;
        this.canvas.style.gridColumn = this.column;
        OVERVIEW_CANVAS_WRAPPER.append( this.canvas );        
    }

    loadMapToCanvas( data ) {
        if ( data != undefined ) {
            let map = MAP_STORAGE.maps[data];
            this.rows = map.rows;
            this.columns = map.columns;
            this.grid = map.grid.flat(1);
            this.tileSet = map.tileSet;
            this.characters = map.characters;
            this.objects = map.mapObjects;
            this.drawMap( );
        }
    }
}

class CanvasGrid {
    constructor( data ){
        data.horizontal_slots.forEach((slotChar, index) => { 
            let horiChar = slotChar;
            let horiIndex = index;
            data.vertical_slots.forEach((e, vertIndex) => {
                this[horiChar+e] = new CanvasSlot(horiChar+e, horiIndex + 1, vertIndex + 1);
                this[horiChar+e].loadMapToCanvas(data[horiChar+e]);
            });
        })
    }
}