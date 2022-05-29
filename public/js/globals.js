const TILESHEET_SELECT = document.getElementById('tilesheet-select');
const TILESHEET_FOLDER = '/png-files/tilesheets/'
const TILESHEET_PREVIEW = document.getElementById( 'sheet-preview' );

const SHEET_CANVAS = document.getElementById('tilesheet-canvas');
const SELECTED_TILE_CANVAS = document.getElementById('selected-tile-canvas');
const MAP_CANVAS = document.getElementById('map-canvas');
const MAP_FRONT_GRID_CANVAS = document.getElementById('map-grid-front-canvas');
const MAP_ROADS_CANVAS = document.getElementById('map-roads-canvas');
const MAP_SPAWN_POINTS_CANVAS = document.getElementById('map-spawn-points-canvas');
const MAP_FOREGROUND_CANVAS = document.getElementById('map-foreground-canvas');
const PREVIEW_MAP_CANVAS = document.getElementById('preview-map-canvas');
const FRONT_PREVIEW_MAP_CANVAS = document.getElementById('front-preview-map-canvas');

const SHEET_CTX = SHEET_CANVAS.getContext("2d");
const SELECTED_TILE_CTX = SELECTED_TILE_CANVAS.getContext("2d");
const MAP_CTX = MAP_CANVAS.getContext("2d");
const MAP_FRONT_GRID_CTX = MAP_FRONT_GRID_CANVAS.getContext("2d");
const MAP_ROADS_CTX = MAP_ROADS_CANVAS.getContext("2d");
const MAP_SPAWN_POINTS_CTX = MAP_SPAWN_POINTS_CANVAS.getContext("2d");
const MAP_FOREGROUND_CTX = MAP_FOREGROUND_CANVAS.getContext("2d")
const PREVIEW_MAP_CTX = PREVIEW_MAP_CANVAS.getContext("2d");
const FRONT_PREVIEW_MAP_CTX = FRONT_PREVIEW_MAP_CANVAS.getContext("2d");

const OVERVIEW_CANVAS_WRAPPER =  document.querySelector('.map-overview-canvas-wrapper');

const STRD_SPRITE_WIDTH = 64;
const STRD_SPRITE_HEIGHT = 112;
let SELECTED_SPRITE;
let SELECTED_SPRITE_POSITION;
let IS_CAR;

let SHEET;
let MAP;
let MAP_ROADS;
let MAP_SPAWN_POINTS;
let PREVIEW_MAP;
let FRONT_PREVIEW_MAP;
let MAP_FOREGROUND;

let TILESHEET_TO_LOAD;
let COLUMNS_TO_LOAD;
let ROWS_TO_LOAD;
let GRID_TO_LOAD;
let FRONT_GRID_TO_LOAD;
let MAPNAME_TO_LOAD;
let NEIGHBOURHOOD_TO_LOAD;
let NEIGHBOURS_TO_LOAD;
let ROADS_TO_LOAD;
let SPAWN_POINTS_TO_LOAD;

let IS_OVERVIEW_SCROLL_ACTIVE;
let OVERVIEW_SCROLL_X_COUNTER;
let OVERVIEW_SCROLL_Y_COUNTER;
let OVERVIEW_SCROLL_LEFT;
let OVERVIEW_SCROLL_TOP;

let MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD;
let MAP_OVERVIEW_CURRENT_SUBMAP;
let IN_SUBMAP_OVERVIEW;

let ON_MAPMAKER_PAGE = false;
let SPRITE_GRID_IS_HIDDEN = true;
let FRONT_TILES_GRID_IS_HIDDEN = true;
let MOUSE_DRAG_IN_MAPMAKER;
let MOUSE_DRAG_RANGE = {
    START: null,
    END: null
};

let ALL_MAPS = {};

let HOOD_MANAGER_DATA = {
    ACTIVE: null,
    HOODJSON: {},
    EDITING_HOOD: false
};

let MAP_STORAGE = { 
    "neighbourhoods": null,
    "maps": null
};

let PNG_FILES = { 
    "characters": null,
    "objects": null
};

let MAPMAKER_IN_TILE_MODE = true;
let HAS_SELECTED_TILE = false;

let MAPMAKER_IN_OBJECT_MODE = false;
let HAS_SELECTED_SPRITE = false;
let IN_SHOW_CHARACTER_SPRITES_MODE;
let IN_SHOW_MAP_OBJECTS_MODE;

let MAPMAKER_IN_NEIGHBOURS_MODE = false;

let MAPMAKER_IN_ROADS_MODE = false;
let SELECTED_ROAD_DIRECTION = false;

let MAPMAKER_IN_SPAWN_MODE = false;
let SELECTED_SPAWN_DIRECTION = false;

let MAPMAKER_IN_DOORS_MODE = false;

let MAPMAKER_IN_BLOCKED_TILES_MODE = false;

const TILE_SIZE = 32;

const MAX_ROWS = 16;
const MAX_COLS = 24;

const MAX_CANVAS_WIDTH = TILE_SIZE * MAX_COLS;
const MAX_CANVAS_HEIGHT= TILE_SIZE * MAX_ROWS

const SHEET_COL_1_Y_POS = 0;
const SHEET_COL_2_Y_POS = TILE_SIZE;
const SHEET_COL_3_Y_POS = TILE_SIZE * 2;
const SHEET_COL_4_Y_POS = TILE_SIZE * 3;

const FACING_DOWN                   = 'FACING_DOWN'
const FACING_LEFT                   = 'FACING_LEFT'
const FACING_RIGHT                  = 'FACING_RIGHT'
const FACING_UP                     = 'FACING_UP'

const TILESHEETS = {
    "my_neighbourhood" : {
        "src": "city1big_tiles.png",
        "tiles": 590
    },
    "my_neighbourhood_2" : {
        "src": "City4_Tiles.png",
        "tiles": 1200
    },
    "starting_neighbourhood_clean" : {
        "src": "Starting_neighbourhood_2.png",
        "tiles": 1200
    },
    "my_house" : {
        "src": "Bed_Room.png",
        "tiles": 31
    },
    "Generic_Room_A_Tile_Set" : {
        "src": "Generic_Room_A_Tile_Set.png",
        "tiles": 83
    },
    "Generic_Room_AX" : {
        "src": "Generic_Room_AX_Tile_Sheet.png",
        "tiles": 83
    },
    "Generic_Room_B_Tile_Set" : {
        "src": "Generic_Room_B_Tile_Set.png",
        "tiles": 112
    },
    "Generic_Room_BX" : {
        "src": "Generic_Room_BX.png",
        "tiles": 83
    },
    "Generic_Room_C_Tile_Set" : {
        "src": "Generic_Room_C_Tile_Set.png",
        "tiles": 63
    },
    "Generic_Room_DX" : {
        "src": "Generic_Room_DX_Tile_Sheet.png",
        "tiles": 83
    },
    "Interior_Yum_Mart_Tiles" : {
        "src": "Interior_Yum_Mart_Tiles.png",
        "tiles": 79
    },
    "downtown" : {
        "src": "city2modern_TILES.png",
        "tiles": 608
    },
    "downtown_2" : {
        "src": "City5_Tiles.png",
        "tiles": 608
    },
    "battle_downtown" : {
        "src": "battle_tiles.png",
        "tiles": 150
    },
    "Yum_Mart": {
        "src": "Yum_mart.png",
        "tiles": 40
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

const SHEET_XY_VALUES = setSheetXyValues( 1300 );

