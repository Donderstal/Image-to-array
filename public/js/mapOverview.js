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
    OVERVIEW_INFO_WRAPPER.scrollLeft = OVERVIEW_SCROLL_LEFT - step;
    OVERVIEW_BUTTONS_WRAPPER.scrollLeft = OVERVIEW_SCROLL_LEFT - step;
}

const initButtonsInDiv = ( div, mapData ) => {
    const buttonClassList = 'btn btn-large btn-success m-2'

    const showSubMapsButton = createNodeWithClassOrID( 
        'button',
        buttonClassList + 'select-map-for-overview-button show-submaps', 
        mapData.mapName
    );
    showSubMapsButton.innerText = IN_SUBMAP_OVERVIEW ? "Show main maps" : "Show submaps"
    div.append(showSubMapsButton)

    const loadMapButton = createNodeWithClassOrID( 
        'button',
        buttonClassList + 'select-map-for-overview-button load-from-overview', 
        'load-' + mapData.mapName + '-from-overview'
    );
    loadMapButton.innerText = "Load map to mapmaker"
    div.append(loadMapButton)
}

const setMapOverviewElementsTotalWidth = ( width ) => {
    OVERVIEW_INFO_WRAPPER.width = width;
    OVERVIEW_CANVAS_WRAPPER.width = width;
    OVERVIEW_BUTTONS_WRAPPER.width = width;
}

const clearOverviewWrapperElements = ( ) => {
    removeAllChildrenFromParent( "map-overview-canvas-wrapper" );
    removeAllChildrenFromParent( "map-overview-info-wrapper" );
    removeAllChildrenFromParent( "map-overview-buttons-wrapper" );
}

const getCanvasElementsListFromMapJSON = ( ) => {
    let canvasElementsList = [ ];
    let overviewClassList = "overview-canvas border-right border-warning";
    let Xcounter = 0;

    const json = IN_SUBMAP_OVERVIEW ? MAP_OVERVIEW_CURRENT_SUBMAP : MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD

    Object.keys( json ).forEach( ( mapName ) => {
        canvasElementsList.push( { 
            mapCanvas: createNodeWithClassOrID( 'canvas', overviewClassList, mapName ),
            infoCanvas: createNodeWithClassOrID( 'canvas', overviewClassList ),
            buttonsDiv: createNodeWithClassOrID( 'div', overviewClassList ),
            mapData: json[mapName],
            mapClass : null,
        } );

        Xcounter += json[mapName].columns * TILE_SIZE;
    } );

    setMapOverviewElementsTotalWidth( Xcounter )

    return canvasElementsList
}


const setInfoToInfoCanvas = ( canvas, data ) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#343a40";    
    ctx.font = TILE_SIZE / 2 + "px Arial";
    ctx.fillText( "Name: " + data.mapName.split('/')[2], TILE_SIZE, TILE_SIZE );
    ctx.fillText( "Characters: " + ( ( data.characters == undefined ) ? "No" : data.characters.length ), TILE_SIZE, TILE_SIZE * 1.75 );
    ctx.fillText( "Doors: " + ( ( data.doors == undefined ) ? "No" : data.doors.length ), TILE_SIZE, TILE_SIZE * 2.50 );
    ctx.fillText( "Mapobjects: " + ( ( data.mapObjects == undefined ) ? "No" : data.mapObjects.length ), TILE_SIZE, TILE_SIZE * 3.25 );

    ctx.fillText( "SUBMAPS", TILE_SIZE * 8, TILE_SIZE );
    if ( data.subMaps != undefined ) {
        Object.keys(data.subMaps).forEach( ( subMap, index ) => {
            ctx.fillText( "* " + subMap, TILE_SIZE * 8, ( TILE_SIZE * 1.75 ) + ( TILE_SIZE * ( index * .75 ) ) );
        } )
    }
    else {
        ctx.fillText( "No", TILE_SIZE * 8, TILE_SIZE * 1.75 );
    }
}

const setOverviewCanvas = ( mapCanvas ) => {
    mapCanvas.width = MAX_CANVAS_WIDTH;
    mapCanvas.height = MAX_CANVAS_HEIGHT;    
    OVERVIEW_CANVAS_WRAPPER.append( mapCanvas )
}

const setInfoCanvas = ( infoCanvas, mapData ) => {
    infoCanvas.width     = MAX_CANVAS_WIDTH;
    infoCanvas.height    = 6 * TILE_SIZE;    
    OVERVIEW_INFO_WRAPPER.append( infoCanvas );
    setInfoToInfoCanvas( infoCanvas, mapData );
}

const setButtonsDiv = ( buttonsDiv, mapData ) => {
    initButtonsInDiv( buttonsDiv, mapData );

    buttonsDiv.style.width = MAX_CANVAS_WIDTH + "px";
    buttonsDiv.style.height = 2 * TILE_SIZE + "px";

    OVERVIEW_BUTTONS_WRAPPER.append(buttonsDiv)
}

const setMapClass = ( mapClass, mapCanvas, mapData, canvasX, canvasY ) => {
    mapClass      = new Map( canvasX, canvasY, mapCanvas.getContext( "2d" ) );
    mapClass.initGrid( mapData.rows + 1, mapData.columns + 1 );
    mapClass.setTileGrid( mapData.grid.flat(1) );
    mapClass.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[mapData.tileSet].src, mapClass.drawMapFromGridData );
}

const setCanvasElementData = ( element, canvasX, canvasY ) => {
    const mapData = element.mapData;
    setOverviewCanvas( element.mapCanvas );
    setInfoCanvas( element.infoCanvas, mapData );
    setButtonsDiv( element.buttonsDiv, mapData );
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
}