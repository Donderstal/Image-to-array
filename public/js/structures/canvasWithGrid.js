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