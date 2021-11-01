const stopMapOverviewScroll = ( ) => {
    IS_OVERVIEW_SCROLL_ACTIVE = false;
}

const initMapOverviewScrollOnClick = ( event ) => {
    IS_OVERVIEW_SCROLL_ACTIVE = true;
    OVERVIEW_SCROLL_X_COUNTER = event.pageX - OVERVIEW_CANVAS_WRAPPER.offsetLeft;
    OVERVIEW_SCROLL_LEFT = OVERVIEW_CANVAS_WRAPPER.scrollLeft;    
}

const mapOverviewHorizontalScroll = ( event ) => {
    const x = event.pageX - OVERVIEW_CANVAS_WRAPPER.offsetLeft;
    const step = x - OVERVIEW_SCROLL_X_COUNTER;
    OVERVIEW_CANVAS_WRAPPER.scrollLeft = OVERVIEW_SCROLL_LEFT - step;
}

const setMapOverviewElementsTotalWidth = ( width ) => {
    OVERVIEW_CANVAS_WRAPPER.width = width;
}

const clearOverviewWrapperElements = ( ) => {
    removeAllChildrenFromParent( "map-overview-canvas-wrapper" );
}

const setLoadMapListeners = ( ) => {
    Array.from(document.getElementsByClassName('load-from-overview')).forEach( ( el ) => {
        el.addEventListener( 'click', ( e ) => {
            const mapName = e.target.id.split('-')[2];
            const activeMaps = IN_SUBMAP_OVERVIEW ? MAP_OVERVIEW_CURRENT_SUBMAP : MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD
            const keysList = Object.keys( activeMaps )
            const map = activeMaps[keysList[mapName]]

            TILESHEET_TO_LOAD = map["tileSet"];
            NEIGHBOURHOOD_TO_LOAD = map["neighbourhood"]
            MAPNAME_TO_LOAD = map["mapName"]
            COLUMNS_TO_LOAD = map["columns"];
            ROWS_TO_LOAD = map["rows"];
            GRID_TO_LOAD = map["grid"].flat(1);
            CHARACTERS_TO_LOAD = map["characters"];
            OBJECTS_TO_LOAD = map["mapObjects"];

            loadMapToMapmaker( );
            document.getElementsByClassName('window-active')[0].className = "row window window-inactive";
            document.getElementById("mapmaker-div").className = "window-active";
        } )
    })
}

const getCanvasElementsListFromMapJSON = ( ) => {
    let canvasElementsList = [ ];
    let overviewClassList = "overview-canvas";
    let Xcounter = 0;

    const json = IN_SUBMAP_OVERVIEW ? MAP_OVERVIEW_CURRENT_SUBMAP : MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD

    Object.keys( json ).forEach( ( mapName, index ) => {
        canvasElementsList.push( { 
            mapCanvas: createNodeWithClassOrID( 'canvas', overviewClassList, mapName ),
            infoCanvas: createNodeWithClassOrID( 'canvas', overviewClassList ),
            buttonsDiv: createNodeWithClassOrID( 'div', overviewClassList ),
            mapData: json[mapName],
            mapClass : null,
            index: index
        } );

        Xcounter += json[mapName].columns * TILE_SIZE;
    } );

    setMapOverviewElementsTotalWidth( Xcounter )

    return canvasElementsList
}

const setOverviewCanvas = ( mapCanvas ) => {
    mapCanvas.width = MAX_CANVAS_WIDTH;
    mapCanvas.height = MAX_CANVAS_HEIGHT;    
    OVERVIEW_CANVAS_WRAPPER.append( mapCanvas )
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
    let canvasX = 0;
    let canvasY = OVERVIEW_CANVAS_WRAPPER.getBoundingClientRect( ).y

    let canvasElementsList = getCanvasElementsListFromMapJSON( );
    canvasElementsList.forEach( ( e ) => {
        setCanvasElementData( e, canvasX, canvasY );
        canvasX += e.mapData.columns * TILE_SIZE;
    } );

    Array.from(document.getElementsByClassName('show-submaps')).forEach( ( button ) => {
        button.addEventListener( 'click', handleShowSubMapsButtonClick, true )
    } )

    setLoadMapListeners( );
}

class CanvasSlot {
    constructor( key ) {
        this.isSet = false;
        this.key = key;
        this.canvas = createNodeWithClassOrID( 'canvas', "overview-canvas", this.key );
    }

    loadMapToCanvas( data ) {
        
    }
}

class CanvasGrid {
    constructor( data ){
        data.horizontal_slots.forEach((slotChar, index) => { 
            let horiChar = slotChar;
            let horiIndex = index;
            data.vertical_slots.forEach((e, vertIndex ) => {
                this[horiChar+e] = new CanvasSlot(horiChar+e);
            });
        })
        Object.keys(data.grid).forEach((key) => { 

        })
    }
}

new CanvasGrid( ["A", "B", "C", "D", "E"], ["1", "2", "3", "4"] )