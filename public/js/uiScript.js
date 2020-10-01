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

const confirmTilesheetChoice = ( ) => {
    const src = TILESHEET_PREVIEW.getAttribute("src");
    setTilesheet( src )
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

document.getElementById('map-grid-button').addEventListener( 'click', setMapGrid, true )
document.getElementById('map-info-button').addEventListener( 'click', setMapInformation, true )

document.getElementById('export-map-button').addEventListener( 'click', exportMapData, true )