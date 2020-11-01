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
    OVERVIEW_CANVAS_WRAPPER.scrollLeft = scrollLeft - step;
    OVERVIEW_INFO_WRAPPER.scrollLeft = scrollLeft - step;
    OVERVIEW_BUTTONS_WRAPPER.scrollLeft = scrollLeft - step;
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

const getCanvasElementsListFromMapJSON = ( json ) => {
    let canvasElementsList = [ ];
    let overviewClassList = "overview-canvas border-right border-warning";
    let Xcounter = 0;

    const json = IN_SUBMAP_OVERVIEW ? MAP_OVERVIEW_CURRENT_SUBMAP : MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD

    Object.keys( json ).forEach( ( mapName ) => {
        canvasElementsList.push( { 
            node: createNodeWithClassOrID( 'canvas', overviewClassList, mapName ),
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