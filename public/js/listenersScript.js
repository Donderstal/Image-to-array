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
        if ( e.className == "account-form inactive-form" && (e.id == "registration-form" || e.id == "login-form" )) {
            e.className = "account-form active-form"
        }
        else if ( e.className == "account-form inactive-form" && (e.id == "registration-form" || e.id == "login-form" )) {
            e.className = "account-form inactive-form"
        }
    } )
})

document.getElementById("toggle-request-restore").addEventListener( 'click', ( ) => {
    Array.from(document.getElementsByClassName('account-form')).forEach( ( e ) => {
        if ( e.className == "account-form inactive-form" && (e.id == "request-restore-form" || e.id == "restore-password-form" )) {
            e.className = "account-form active-form"
        }
        else if ( e.className != "account-form inactive-form" && (e.id == "request-restore-form" || e.id == "restore-password-form" )) {
            e.className = "account-form inactive-form"
        }
    } )
})

document.addEventListener("DOMContentLoaded", function() {
    const sheetX = SHEET_CANVAS.getBoundingClientRect( ).x;
    const sheetY = SHEET_CANVAS.getBoundingClientRect( ).y;
    const mapX = MAP_CANVAS.getBoundingClientRect( ).x;
    const mapY = MAP_CANVAS.getBoundingClientRect( ).y;
    const previewMapX = PREVIEW_MAP_CANVAS.getBoundingClientRect( ).x;
    const previewMapY = PREVIEW_MAP_CANVAS.getBoundingClientRect( ).y;

    PREVIEW_MAP = new Map( previewMapX, previewMapY, "PREVIEW_MAP" );
    SHEET = new Sheet( sheetX, sheetY, "SHEET" );
    MAP = new Map( mapX, mapY, "MAP" );
});

Array.from(document.getElementsByClassName("map-selection-list-item-radio")).forEach( ( e ) => {
    e.addEventListener("click", ( e ) => {
        const attributes = document.getElementById(e.target.id).parentElement.attributes;
        const parentElement = document.getElementById(document.getElementById(e.target.id).parentElement.id);

        COLUMNS_TO_LOAD = parseInt(attributes["columns"].value) + 1;
        ROWS_TO_LOAD = parseInt(attributes["rows"].value) + 1;
        GRID_TO_LOAD = attributes["grid"].value.split(',');

        TILESHEET_TO_LOAD = attributes["tilesheet"].value
        MAPNAME_TO_LOAD = parentElement.id;
        if ( parentElement.getAttribute("neighbourhood") ) {
            NEIGHBOURHOOD_TO_LOAD = parentElement.getAttribute("neighbourhood").split('.')[0];      
            document.getElementById("preview-map-neighbourhood").innerText = "Neighbourhood: " + parentElement.getAttribute("neighbourhood").split('.')[0];                  
        }


        document.getElementById("preview-map-tileset").innerText = "Tileset: " + attributes["tilesheet"].value

        document.getElementById("preview-map-name").innerText = "Map name: " + parentElement.id;

        PREVIEW_MAP_CANVAS.width = COLUMNS_TO_LOAD * TILE_SIZE
        PREVIEW_MAP_CANVAS.height = ROWS_TO_LOAD * TILE_SIZE
        PREVIEW_MAP.initGrid( ROWS_TO_LOAD, COLUMNS_TO_LOAD );

        const image = new Image();
    
        image.src = '/png-files/tilesheets/' + TILESHEETS[attributes["tilesheet"].value].src;
        image.onload = ( ) => {       
            drawGrid( { 'rows': ROWS_TO_LOAD, 'columns': COLUMNS_TO_LOAD, 'tileSheet': image, 'grid': GRID_TO_LOAD }, TILESHEETS[attributes["tilesheet"].value].tiles, PREVIEW_MAP_CTX )
        }
    })
})