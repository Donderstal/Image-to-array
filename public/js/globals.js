const TILESHEET_SELECT = document.getElementById('tilesheet-select');
const TILESHEET_FOLDER = '/png-files/tilesheets/'
const TILESHEET_PREVIEW = document.getElementById( 'sheet-preview' );

const SHEET_CANVAS = document.getElementById('tilesheet-canvas');
const HIDDEN_CANVAS = document.getElementById('hidden-canvas');
const MAP_CANVAS = document.getElementById('map-canvas');

const SHEET_CTX = SHEET_CANVAS.getContext("2d");
const HIDDEN_CTX = HIDDEN_CANVAS.getContext("2d");
const MAP_CTX = MAP_CANVAS.getContext("2d");

const PAGE_RECT = document.getElementsByTagName('html')[0].getBoundingClientRect( );

const TILE_SIZE = 32;

const MAX_ROWS = 16;
const MAX_COLS =24;

const SHEET_COL_1_Y_POS = 0;
const SHEET_COL_2_Y_POS = TILE_SIZE;
const SHEET_COL_3_Y_POS = TILE_SIZE * 2;
const SHEET_COL_4_Y_POS = TILE_SIZE * 3;