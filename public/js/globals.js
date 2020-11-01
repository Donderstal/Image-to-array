const TILESHEET_SELECT = document.getElementById('tilesheet-select');
const TILESHEET_FOLDER = '/png-files/tilesheets/'
const TILESHEET_PREVIEW = document.getElementById( 'sheet-preview' );

const SHEET_CANVAS = document.getElementById('tilesheet-canvas');
const SELECTED_TILE_CANVAS = document.getElementById('selected-tile-canvas');
const MAP_CANVAS = document.getElementById('map-canvas');
const PREVIEW_MAP_CANVAS = document.getElementById('preview-map-canvas');

const SHEET_CTX = SHEET_CANVAS.getContext("2d");
const SELECTED_TILE_CTX = SELECTED_TILE_CANVAS.getContext("2d");
const MAP_CTX = MAP_CANVAS.getContext("2d");
const PREVIEW_MAP_CTX = PREVIEW_MAP_CANVAS.getContext("2d");

let SHEET;
let MAP;
let PREVIEW_MAP;

let TILESHEET_TO_LOAD;
let COLUMNS_TO_LOAD;
let ROWS_TO_LOAD;
let GRID_TO_LOAD;
let MAPNAME_TO_LOAD;
let NEIGHBOURHOOD_TO_LOAD

const TILE_SIZE = 32;

const MAX_ROWS = 16;
const MAX_COLS = 24;

const MAX_CANVAS_WIDTH = TILE_SIZE * MAX_COLS;
const MAX_CANVAS_HEIGHT= TILE_SIZE * MAX_ROWS

const SHEET_COL_1_Y_POS = 0;
const SHEET_COL_2_Y_POS = TILE_SIZE;
const SHEET_COL_3_Y_POS = TILE_SIZE * 2;
const SHEET_COL_4_Y_POS = TILE_SIZE * 3;

const TILESHEETS = {
    "my_neighbourhood" : {
        "src": "city1big_tiles.png",
        "tiles": 590
    },
    "my_house" : {
        "src": "Bed_Room.png",
        "tiles": 31
    },
    "Generic_Room_A_Tile_Set" : {
        "src": "Generic_Room_A_Tile_Set.png",
        "tiles": 83
    },
    "Generic_Room_B_Tile_Set" : {
        "src": "Generic_Room_B_Tile_Set.png",
        "tiles": 112
    },
    "Generic_Room_C_Tile_Set" : {
        "src": "Generic_Room_C_Tile_Set.png",
        "tiles": 63
    },
    "Interior_Yum_Mart_Tiles" : {
        "src": "Interior_Yum_Mart_Tiles.png",
        "tiles": 79
    },
    "downtown" : {
        "src": "city2_modern.png",
        "tiles": 608
    }
};

const setSheetXyValues = ( tilesInSheet ) => {
    let tileX = 0; let tileY = 0;
    let tilesheetXyValues = []

    for ( var i = 0; i <= tilesInSheet; i++ ) {
        tilesheetXyValues.push( { 'x': tileX, 'y': tileY } )
        tileX += TILE_SIZE * 2
        if ( i % 4 == 3 ) {
            tileX = 0
            tileY += TILE_SIZE * 2
        }
    }

    return tilesheetXyValues;
}

const SHEET_XY_VALUES = setSheetXyValues( 608 );

