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

const captureSheetClick = ( event ) => {
    console.log('in sheet!')
    console.log(event.offsetX, event.offsetY)
}

const captureMapClick = ( event ) => {
    console.log('in map!')
    console.log(event.offsetX, event.offsetY)
}

const setMapGrid = ( ) => {
    const rows = document.getElementById('rows-input').value;
    const cols = document.getElementById('columns-input').value;

    if ( rows > 16 || cols > 24 ) {
        alert( 'Your input is not valid. A map can have no more than 16 rows and 24 columns.' )
        return;
    }

    initMapCanvas( rows, cols );
}

SHEET_CANVAS.addEventListener( 'click', captureSheetClick, true )

MAP_CANVAS.addEventListener( 'click', captureMapClick, true )

document.getElementById('map-grid-button').addEventListener( 'click', setMapGrid, true )