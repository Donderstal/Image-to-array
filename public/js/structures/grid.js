class Grid {
    constructor( x, y, rows, cols, isMap ) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.array = [];
        this.isMap = isMap;

        this.initializeGrid( );
    };
    
    initializeGrid( ) {
        const limit = this.rows * this.cols
        let tileX = 0;
        let tileY = 0;

        for( var i = 0; i < limit; i++ ) {
            this.array.push( new Tile( i, tileX, tileY, this.isMap ) )

            if ( ( i + 1 ) % this.cols == 0 ) {
                tileX = 0;
                tileY += TILE_SIZE;
            } else {
                tileX += TILE_SIZE
            }
        };
    };
}

class Tile {
    constructor( index, x, y, isMap ) {
        this.x = x;
        this.y = y;
        this.index = index;

        isMap ? this.clearTileID( ) : this.setTileID( index );
    };

    setTileID( ID ) {
        this.ID = ID;
    };

    clearTileID( ) {
        this.ID = "E"
    };
};