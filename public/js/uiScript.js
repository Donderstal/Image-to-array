const showTilesheetPreview = ( ) => {
    const selectedValue = TILESHEET_SELECT.options[TILESHEET_SELECT.selectedIndex].value

    selectedValue in TILESHEETS 
        ? TILESHEET_PREVIEW.setAttribute( 'src', TILESHEET_FOLDER + TILESHEETS[selectedValue].src )
        : alert( 'Tilsheet ' + selectedValue + ' not found' );
}

const clearAllGrids = ( ) =>{
    MAP_FOREGROUND.doors.forEach((e)=>{ e.removeDoorDiv( )})
    PREVIEW_MAP.clearGrid( );
    FRONT_PREVIEW_MAP.clearGrid( );
    SHEET.clearGrid( );
    MAP.clearGrid( );
    MAP_FRONT_GRID.clearGrid( );
    MAP_ROADS.clearGrid( );
    MAP_SPAWN_POINTS.clearGrid( );
    MAP_FOREGROUND.clearGrid( );
}

const switchView = ( event ) => {
   let nextScreen;
   let className;

   switch ( event.target.id ) {
        case "go-back-button" :
        case "log-in-button" : 
            clearAllGrids( );
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
            const activeHoods = MAP_STORAGE["neighbourhoods"];

            document.getElementById('neighbourhood-select-tag').innerHTML = "<option value='null'>None</option>";
            Object.keys(activeHoods).forEach(key => {
                let option = document.createElement('option')
                option.setAttribute( 'value', key)
                option.appendChild(document.createTextNode(key))
                document.getElementById('neighbourhood-select-tag').append(option)
            })
            
            break;
        case "start-new-map-button" : 
            if ( mapMakerDataIsSet( ) ) {
                prepareMapmaker( );
                nextScreen = "mapmaker-div";
                className = "window-active";
                break;
            }
            else {
                return;
            }
        case "manage-neighbourhoods-button" : 
            prepareNeighbourhoodManager( )
            nextScreen = "neighbourhood-manager-div";
            className = "row window window-active my-auto p-2 h-100";
            break;
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
            document.getElementById("load-map-modal-dismiss").click( );
            nextScreen = "mapmaker-div";
            className = "window-active";
            break;
        default :
            alert( 'Navigation error. Tell Daan right away!!' );
            break;
    }

    if ( nextScreen != "welcome-div" ) {
        document.getElementById('go-back-button').style.visibility = "visible";
    } else {
        document.getElementById('go-back-button').style.visibility = "invisible";
    }

    if ( nextScreen == 'mapmaker-div' ) {
        setTimeout( ( ) => { document.getElementById("tiles-mode").click( ) }, 100)
        showElementWithId( "map-information-input" );
    }
    else {
        hideElementWithId( "map-information-input")
    }

   document.getElementsByClassName('window-active')[0].className = "row window window-inactive";

   document.getElementById(nextScreen).className = className;
}

const loadMapToMapmaker = ( ) => {
    setTilesheet( '/png-files/tilesheets/' + TILESHEETS[TILESHEET_TO_LOAD].src )
    makeHiddenCanvasVisible( SHEET_CANVAS );
    makeHiddenCanvasVisible( MAP_CANVAS );
    ON_MAPMAKER_PAGE = true;

    initMapCanvas( ROWS_TO_LOAD, COLUMNS_TO_LOAD );

    if ( NEIGHBOURS_TO_LOAD != undefined ) {
        appendOptionToSelect( NEIGHBOURS_TO_LOAD["left"], document.getElementById("neighbours-input-left"), true )
        appendOptionToSelect( NEIGHBOURS_TO_LOAD["up"], document.getElementById("neighbours-input-up"), true )
        appendOptionToSelect( NEIGHBOURS_TO_LOAD["right"], document.getElementById("neighbours-input-right"), true )
        appendOptionToSelect( NEIGHBOURS_TO_LOAD["down"], document.getElementById("neighbours-input-down"), true )
    }

    MAP.setNeighbourhood( NEIGHBOURHOOD_TO_LOAD );
    MAP.setMapName( MAPNAME_TO_LOAD );
    
    setTextContentOfElements( { 
        "mapname-span": MAPNAME_TO_LOAD, "neighbourhood-span": NEIGHBOURHOOD_TO_LOAD, 
        "rows-span": ROWS_TO_LOAD, "columns-span": COLUMNS_TO_LOAD 
    } );

    MAP.initGrid( ROWS_TO_LOAD, COLUMNS_TO_LOAD )
    
    if ( CHARACTERS_TO_LOAD != undefined && CHARACTERS_TO_LOAD != null ) {
        MAP_FOREGROUND.setCharacters( CHARACTERS_TO_LOAD );
    }
    if ( OBJECTS_TO_LOAD != undefined && OBJECTS_TO_LOAD != null ) {
        MAP_FOREGROUND.setObjects( OBJECTS_TO_LOAD );   
    }

    if ( ROADS_TO_LOAD != undefined && ROADS_TO_LOAD != null ) {
        MAP.setRoads( ROADS_TO_LOAD )
    }

    if ( SPAWN_POINTS_TO_LOAD != undefined && SPAWN_POINTS_TO_LOAD != null ) {
        MAP_SPAWN_POINTS.setSpawnPoints( SPAWN_POINTS_TO_LOAD )
    }

    MAP_FOREGROUND.drawSpritesInGrid( );
    MAP.setTileGrid( GRID_TO_LOAD );
    MAP.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[TILESHEET_TO_LOAD].src, MAP.drawMapFromGridData );

    MAP_FRONT_GRID.initGrid( ROWS_TO_LOAD, COLUMNS_TO_LOAD );
    MAP_FRONT_GRID.setTileGrid( FRONT_GRID_TO_LOAD );
    MAP_FRONT_GRID.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[TILESHEET_TO_LOAD].src, MAP_FRONT_GRID.drawMapFromGridData );
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

    document.getElementById("dismiss-tilesheet-modal").click( );
}

const captureSheetClick = ( event ) => {
    if ( MAPMAKER_IN_TILE_MODE ) {
        SHEET.captureTileAtXY(event.offsetX, event.offsetY);
        HAS_SELECTED_TILE = true;
    }
    else if ( !event.shiftKey && MAPMAKER_IN_BLOCKED_TILES_MODE ) {
        SHEET.setTileAsUnblocked(event.offsetX, event.offsetY);
    }
    else if ( event.shiftKey && MAPMAKER_IN_BLOCKED_TILES_MODE ) {
        SHEET.unsetTileAsUnblocked(event.offsetX, event.offsetY);
    }

}

const captureForegroundClick = ( event ) => {
    if ( event.shiftKey ) {
        MAP_FOREGROUND.clearSpriteFromTile(event.offsetX, event.offsetY);      
    }
    else if ( IN_SHOW_CHARACTER_SPRITES_MODE && HAS_SELECTED_SPRITE ) {
        MAP_FOREGROUND.placeCharacterSpriteAtXY(event.offsetX, event.offsetY);        
    }
    else if ( ( IN_SHOW_MAP_OBJECTS_MODE || MAPMAKER_IN_DOORS_MODE ) && HAS_SELECTED_SPRITE ) {
        MAP_FOREGROUND.placeObjectSpriteAtXY(event.offsetX, event.offsetY);     
    }
}

const prepareMapmaker = ( ) => {
    const rows = document.getElementById('rows-input').value;
    const columns = document.getElementById('columns-input').value;
    const mapName = document.getElementById("mapname-label").value;
    const neighbourhood = document.getElementById("neighbourhood-select-tag").value;

    ON_MAPMAKER_PAGE = true;

    setMapInformation( mapName, neighbourhood );    
    setMapGrid( rows, columns );
}

const unsetMapMaker = ( ) => {
    ON_MAPMAKER_PAGE = false;
    unsetMapInformation( );
    unsetMapGrid( );
    unselectTileSheet( );
}

const unsetMapInformation = ( ) => {
    setTextContentOfElements( { "mapname-span": "", "neighbourhood-span": "" } )

    MAP.setNeighbourhood( "" );
    MAP.setMapName( "" )
}

const unsetMapGrid = ( ) => {
    setTextContentOfElements( { "rows-span": "", "columns-span": "" } )
    hideVisibleCanvas( MAP_CANVAS );
    MAP.clearGrid( );
}

const unselectTileSheet = ( ) =>{
    hideVisibleCanvas( SHEET_CANVAS );
    setValueOfReadOnlyElement( 'tilesheet-selection-input', "" );
}

const setMapGrid = ( rows, columns ) => {
    makeHiddenCanvasVisible( MAP_CANVAS );
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

const appendOptionToSelect = ( value, parent, isSelected = false ) => {
    let element = document.createElement("option")
    element.value = value;
    element.innerText = value;
    if ( isSelected )
        element.selected = true;
    parent.append( element )
}

const setUserMapsToPreview = ( ) => {
    const neighbourhoods = MAP_STORAGE["neighbourhoods"];
    const maps = MAP_STORAGE["maps"];

    const filesWrapper = document.getElementsByClassName("load-maps-names-div")[0];

    let neighbourSelectList = document.getElementsByClassName( "neighbour-select" );
    [ ...neighbourSelectList ].forEach( ( e ) => {
        let parent = e;
        Object.keys( maps).forEach( ( mapkey ) => {
            appendOptionToSelect( maps[mapkey].neighbourhood + "/" + maps[mapkey].mapName, parent )
        })
    })

    addTitleElementToLoadMapMenu("Neighbourhoods", filesWrapper)

    Object.keys(neighbourhoods).forEach( key => {
        let node = document.createElement("div")
        node.className = "load-neighbourhood-from-server"
        let textNode = document.createTextNode(key)
        node.appendChild(textNode);
        createListForJSONMaps( node, neighbourhoods[key] )
        filesWrapper.append(node)
    });

    addTitleElementToLoadMapMenu("Individual maps", filesWrapper)

    let node = document.createElement("div")
    node.className = "load-maps-from-server"
    createListForJSONMaps( node, maps )
    filesWrapper.append(node)
}

const addTitleElementToLoadMapMenu = ( text, filesWrapper ) => {
    let node = document.createElement("h6")
    let textNode = document.createTextNode(text)
    node.appendChild(textNode)
    filesWrapper.appendChild(node)
    filesWrapper.appendChild(document.createElement("hr"))
}

const addElementsToList = ( unorderedList, mapsObject, key ) => {
    let mapLi = document.createElement("li");
    mapLi.className = 'map-selection-list-item'

    let textNode = document.createTextNode(key)
    mapLi.appendChild(textNode);

    let mapInput = document.createElement("input")
    mapInput.setAttribute( 'type', 'radio')
    mapInput.setAttribute( "name", "load-map-preview")
    mapInput.id = mapsObject["mapName"];
    mapInput.className = 'map-selection-list-item-radio'
    ALL_MAPS[mapsObject["mapName"]] = mapsObject

    mapInput.addEventListener( "click", ( e ) => {
        setMapJSON( ALL_MAPS[e.target.id] );
    })

    mapLi.append(mapInput)

    if ( mapsObject["subMaps"] ) {
        createListForJSONMaps( mapLi, mapsObject["subMaps"] )
    }

    unorderedList.append(mapLi)
}

const createListForJSONMaps = ( parent, mapsObject ) => {
    let unorderedList = document.createElement("ul")
    unorderedList.className = "map-selection-list"

    Object.keys(mapsObject).forEach( key => {
        addElementsToList( unorderedList, mapsObject[key], key );
    });

    parent.appendChild(unorderedList);
}