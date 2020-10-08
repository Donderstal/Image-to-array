const showTilesheetPreview = ( ) => {
    const selectedValue = TILESHEET_SELECT.options[TILESHEET_SELECT.selectedIndex].value
    let filename;

    switch( selectedValue ) {
        case 'Bedroom':
            filename = 'Bed_Room.png'
            break;
        case 'Starting neighbourhood':
            filename = 'city1big_tiles.png'
            break;
        case 'Downtown':
            filename = 'city2_modern.png'
            break;
        case 'Generic set A':
            filename = 'Generic_Room_A_Tile_Set.png'
            break;
        case 'Generic set B':
            filename = 'Generic_Room_B_Tile_Set.png'
            break;
        case 'Generic set C':
            filename = 'Generic_Room_C_Tile_Set.png'
            break;
        case 'Yum mart':
            filename = 'Interior_Yum_Mart_Tiles.png'
            break;
        default :
            alert( 'Tilesheet name not recognized. Tell Daan right away!!' );
    }

    TILESHEET_PREVIEW.setAttribute( 'src', TILESHEET_FOLDER + filename );
}

const switchView = ( event ) => {
   let nextScreen;

   switch ( event.target.id ) {
        case "log-in-button" : 
            nextScreen = "welcome-div";
            break;
        case "mapmaker-button" : 
            nextScreen = "mapmaker-menu-div";
            break;
        case "new-map-button" : 
            nextScreen = "mapmaker-new-map-div";
            break;
        case "start-new-map-button" : 
            if ( mapMakerDataIsSet( ) ) {
                prepareMapmaker( );
                nextScreen = "mapmaker-div";
                break;
            }
            else {
                return;
            }
        case "back-to-map-menu-button" :
            unsetMapMaker( );
            nextScreen = "mapmaker-new-map-div";
            break;
        default :
            alert( 'Navigation error. Tell Daan right away!!' );
            break;
   }

   document.getElementsByClassName('window-active')[0].className = "row window window-inactive";

   document.getElementById(nextScreen).className = nextScreen == "mapmaker-div" ? "window-active" : "row window window-active";
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
    setTilesheet( src )
    document.getElementById('tilesheet-selection-input').readOnly = false;
    document.getElementById('tilesheet-selection-input').value = src;
    document.getElementById('tilesheet-selection-input').readOnly = true;
    SHEET_CANVAS.classList.remove('invisible-canvas');
    SHEET_CANVAS.classList.add('visible-canvas');
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
    setMapInformation( );    
    setMapGrid( );
}

const unsetMapMaker = ( ) => {
    unsetMapInformation( );
    unsetMapGrid( );
    unselectTileSheet( );
}

const unsetMapInformation = ( ) => {
    document.getElementById("mapname-span").textContent = null;
    document.getElementById("neighbourhood-span").textContent = null;

    MAP.setNeighbourhood( null );
    MAP.setMapName( null )
}

const unsetMapGrid = ( ) => {
    document.getElementById("rows-span").textContent = null;
    document.getElementById("columns-span").textContent = null;

    MAP_CANVAS.classList.remove('visible-canvas');
    MAP_CANVAS.classList.add('invisible-canvas');

    MAP.clearGrid( );
}

const unselectTileSheet = ( ) =>{
    SHEET_CANVAS.classList.remove('visible-canvas');
    SHEET_CANVAS.classList.add('invisible-canvas');
    document.getElementById('tilesheet-selection-input').readOnly = false;
    document.getElementById('tilesheet-selection-input').value = "";
    document.getElementById('tilesheet-selection-input').readOnly = true;
}

const setMapGrid = ( ) => {
    const rows = document.getElementById('rows-input').value;
    const columns = document.getElementById('columns-input').value;

    if ( rows > 16 || columns > 24 ) {
        alert( 'Your input is not valid. A map can have no more than 16 rows and 24 columns.' )
        return;
    }

    MAP_CANVAS.classList.remove('invisible-canvas');
    MAP_CANVAS.classList.add('visible-canvas')

    document.getElementById('rows-input').value = null;
    document.getElementById('columns-input').value = null;

    document.getElementById("rows-span").textContent = rows;
    document.getElementById("columns-span").textContent = columns;

    initMapCanvas( rows, columns );
}

const setMapInformation = ( ) => {
    const mapName = document.getElementById("mapname-label").value;
    const neighbourhood = document.getElementById("neighbourhood-label").value;

    MAP.setNeighbourhood( neighbourhood );
    MAP.setMapName( mapName )
    
    document.getElementById("mapname-span").textContent = mapName;
    document.getElementById("neighbourhood-span").textContent = neighbourhood;
}

const exportMapData = ( ) => {
    alert(JSON.stringify(MAP.exportMapData( )));
}

SHEET_CANVAS.addEventListener( 'click', captureSheetClick, true )
MAP_CANVAS.addEventListener( 'click', captureMapClick, true )

document.getElementById('export-map-button').addEventListener( 'click', exportMapData, true )

Array.from(document.getElementsByClassName('navigation-button')).forEach( ( e ) => {
    e.addEventListener( 'click', switchView, true )
} )

document.getElementById('clear-grid-button').addEventListener( 'click', clearMapGrid, true )

document.getElementById('clear-inputs-button').addEventListener( 'click', ( ) => {
    Array.from(document.getElementsByClassName('new-map-input')).forEach( ( e ) => {
        e.value = ""
    } )
})

document.getElementById("toggle-register-login").addEventListener( 'click', ( ) => {
    Array.from(document.getElementsByClassName('account-form')).forEach( ( e ) => {
        if ( e.className == "account-form inactive-form") {
            e.className = "account-form active-form"
        }
        else {
            e.className = "account-form inactive-form"
        }
    } )
})