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
}

const determineMousePosition = ( event ) => { 
    const sheetRect = SHEET_CANVAS.getBoundingClientRect( );
    const mapRect = MAP_CANVAS.getBoundingClientRect( );

    const isInMap = event.pageX > mapRect.left && event.pageX < mapRect.right && event.pageY > mapRect.top && event.pageY < mapRect.bottom;
    const isInSheet = event.pageX > sheetRect.left && event.pageX < sheetRect.right && event.pageY > sheetRect.top && event.pageY < sheetRect.bottom;

    if ( isInMap ) {
        passClickXyInMap( event, mapRect )
    }
    if ( isInSheet ) {
        passClickXyInSheet( event, sheetRect )
    }
}

const passClickXyInSheet = ( event, sheetRect ) => {
    const xInSheet = event.pageX - sheetRect.left;
    const yInSheet = event.pageY - sheetRect.top;
    getTileFromSheetOnClick( xInSheet, yInSheet );
}

const passClickXyInMap = ( event, mapRect ) => {
    const xInMap = event.pageX - mapRect.left;
    const yInMap = event.pageY - mapRect.top;

    if ( event.shiftKey ) {
        removeTileFromMapOnClick( xInMap, yInMap );
    }
    else {
        putTileInMapOnClick( xInMap, yInMap );            
    }
}

document.addEventListener('click', determineMousePosition, true); 