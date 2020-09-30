class CanvasWithGrid {
    constructor( x, y ) {
        this.x = x;
        this.y = y;
        this.isMap;
    };

    setDimensions( ) {
        this.width = width;
        this.height = height;
    };

    initGrid( rows, cols ) {
        this.grid = new Grid( this.x, this.y, rows, cols, this.isMap );
    };

    clearGrid( ) {
        this.grid.clearGrid( );
    };

    getTileAtXY( x, y ) {
        return this.grid.getTileAtXY( x, y );
    };
};

class Sheet extends CanvasWithGrid {
    constructor( x, y ) {
        super( x, y );
        this.isMap = false;
        console.log("initializing sheet!");
    };

    setSheet( sheetName ) {
        this.sheetName = sheetName;
    };

    getTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        SELECTED_TILE_CTX.drawImage( SHEET_CANVAS, tile.x, tile.y, TILE_SIZE, TILE_SIZE, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 )
    }
}

class Map extends CanvasWithGrid {
    constructor( x, y ) {
        super( x, y );
        this.isMap = true;
        console.log("initializing map!")
    };

    setMapName( mapName ) {
        this.mapName = mapName;
    }
};