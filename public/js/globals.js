const TILESHEET_SELECT = document.getElementById('tilesheet-select');

const SHEET_CANVAS = document.getElementById('tilesheet-canvas');
const HIDDEN_CANVAS = document.getElementById('hidden-canvas');
const MAP_CANVAS = document.getElementById('map-canvas');

const SHEET_CTX = SHEET_CANVAS.getContext("2d");
const HIDDEN_CTX = HIDDEN_CANVAS.getContext("2d");
const MAP_CTX = MAP_CANVAS.getContext("2d");

const TILE_SIZE = 32;

const SHEET_COL_1_Y_POS = 0;
const SHEET_COL_2_Y_POS = TILE_SIZE;
const SHEET_COL_3_Y_POS = TILE_SIZE * 2;
const SHEET_COL_4_Y_POS = TILE_SIZE * 3;