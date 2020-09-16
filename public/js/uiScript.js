const showTilesheetPreview = ( ) => {
    const select = document.getElementById('tilesheet-select')
    const selectedValue = select.options[select.selectedIndex].value

    let url = '/png-files/tilesheets/'

    switch(selectedValue) {
        case 'Bedroom':
            url += 'Bed_Room.png'
            break;
        case 'Starting neighbourhood':
            url += 'city1big_tiles.png'
            break;
        case 'Downtown':
            url += 'city2_modern.png'
            break;
        case 'Generic set A':
            url += 'Generic_Room_A_Tile_Set.png'
            break;
        case 'Generic set B':
            url += 'Generic_Room_B_Tile_Set.png'
            break;
        case 'Generic set C':
            url += 'Generic_Room_C_Tile_Set.png'
            break;
        case 'Yum mart':
            url += 'Interior_Yum_Mart_Tiles.png'
            break;
        default :
            alert( 'Tilesheet name not recognized. Tell Daan right away!!' );
    }

    document.getElementById('sheet-preview').setAttribute('src', url);
}

const confirmTilesheetChoice = ( ) => {
    const src = document.getElementById('sheet-preview').getAttribute("src");
    setTilesheet( src )
}