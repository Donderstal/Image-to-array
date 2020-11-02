const showTilesheetPreview = ( ) => {
    const selectedValue = TILESHEET_SELECT.options[TILESHEET_SELECT.selectedIndex].value

    selectedValue in TILESHEETS 
        ? TILESHEET_PREVIEW.setAttribute( 'src', TILESHEET_FOLDER + TILESHEETS[selectedValue].src )
        : alert( 'Tilsheet ' + selectedValue + ' not found' );
}

const switchView = ( event ) => {
   let nextScreen;
   let className;

   switch ( event.target.id ) {
        case "log-in-button" : 
            nextScreen = "welcome-div";
            className = "col-sm-12 window-active";
            break;
        case "mapmaker-button" : 
            nextScreen = "mapmaker-menu-div";
            className = "row window window-active";
            break;
        case "new-map-button" : 
            nextScreen = "mapmaker-new-map-div";
            className = "row window window-active";
            break;
        case "start-new-map-button" : 
            if ( mapMakerDataIsSet( ) ) {
                prepareMapmaker( );
                nextScreen = "mapmaker-div";
                className = "row window window-active";
                break;
            }
            else {
                return;
            }
        case "map-overview-button" : 
            nextScreen = "map-overview-div";
            className = "row window window-active";
            break;
        case "back-to-map-menu-button" :
            unsetMapMaker( );
            nextScreen = "mapmaker-new-map-div";
            className = "row window window-active";
            break;
        case "confirm-load-map-button" : 
            loadMapToMapmaker( );
            nextScreen = "mapmaker-div";
            className = "window-active";
            break;
        default :
            alert( 'Navigation error. Tell Daan right away!!' );
            break;
   }

   document.getElementsByClassName('window-active')[0].className = "row window window-inactive";

   document.getElementById(nextScreen).className = className;
}

const loadMapToMapmaker = ( ) => {
    setTilesheet( '/png-files/tilesheets/' + TILESHEETS[TILESHEET_TO_LOAD].src )
    makeHiddenCanvasVisible( SHEET_CANVAS );
    makeHiddenCanvasVisible( MAP_CANVAS );

    initMapCanvas( ROWS_TO_LOAD, COLUMNS_TO_LOAD );

    MAP.setNeighbourhood( NEIGHBOURHOOD_TO_LOAD );
    MAP.setMapName( MAPNAME_TO_LOAD )
    
    setTextContentOfElements( { 
        "mapname-span": MAPNAME_TO_LOAD, "neighbourhood-span": NEIGHBOURHOOD_TO_LOAD, 
        "rows-span": ROWS_TO_LOAD, "columns-span": COLUMNS_TO_LOAD 
    } );

    MAP.initGrid( ROWS_TO_LOAD, COLUMNS_TO_LOAD )
    MAP.setTileGrid( GRID_TO_LOAD );
    MAP.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[TILESHEET_TO_LOAD].src, MAP.drawMapFromGridData )
}

const mapMakerDataIsSet = ( ) => {
    const rows = document.getElementById('rows-input').value;
    const columns = document.getElementById('columns-input').value;

    if ( rows > 16 || columns > 24 ) {
        alert( 'Your input is not valid. A map can have no more than 16 rows and 24 columns.' )
        return false;
    }
    else if ( rows == "" || columns == "" ) {
        alert( 'Please input a number of rows and columns');
        return false;
    }
    else if ( document.getElementById('tilesheet-selection-input').value ==  "" ) {
        alert( 'Please select a tilesheet before beginning');
        return false;
    }

    return true;
}

const confirmTilesheetChoice = ( ) => {
    const src = TILESHEET_PREVIEW.getAttribute("src");

    setTilesheet( src );
    setValueOfReadOnlyElement( 'tilesheet-selection-input', src );

    makeHiddenCanvasVisible( SHEET_CANVAS );
}

const captureSheetClick = ( event ) => {
    SHEET.getTileAtXY(event.offsetX, event.offsetY);
}

const captureMapClick = ( event ) => {
    if ( event.shiftKey ) {
        
    }
    else {
        MAP.getTileAtXY(event.offsetX, event.offsetY);        
    }
}

const prepareMapmaker = ( ) => {
    const rows = document.getElementById('rows-input').value;
    const columns = document.getElementById('columns-input').value;
    const mapName = document.getElementById("mapname-label").value;
    const neighbourhood = document.getElementById("neighbourhood-label").value;

    setMapInformation( mapName, neighbourhood );    
    setMapGrid( rows, columns );
}

const unsetMapMaker = ( ) => {
    unsetMapInformation( );
    unsetMapGrid( );
    unselectTileSheet( );
}

const unsetMapInformation = ( ) => {
    setTextContentOfElements( { "mapname-span": null, "neighbourhood-span": null } )

    MAP.setNeighbourhood( null );
    MAP.setMapName( null )
}

const unsetMapGrid = ( ) => {
    setTextContentOfElements( { "rows-span": null, "columns-span": null } )
    hideVisibleCanvas( MAP_CANVAS );

    MAP.clearGrid( );
}

const unselectTileSheet = ( ) =>{
    hideVisibleCanvas( SHEET_CANVAS );
    setValueOfReadOnlyElement( 'tilesheet-selection-input', "" );
}

const setMapGrid = ( rows, columns ) => {
    makeHiddenCanvasVisible( MAP_CANVAS );

    document.getElementById('rows-input').value = null;
    document.getElementById('columns-input').value = null;

    setTextContentOfElements( { "rows-span": rows, "columns-span": columns } )
    initMapCanvas( rows, columns );
}

const setMapInformation = ( mapName, neighbourhood ) => {
    MAP.setNeighbourhood( neighbourhood );
    MAP.setMapName( mapName )

    setTextContentOfElements( { "mapname-span": mapName, "neighbourhood-span": neighbourhood } )
}

const exportMapData = ( ) => {
    console.log(JSON.stringify(MAP.exportMapData( )));
}