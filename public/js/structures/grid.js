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

    clearGrid( ) {
        this.grid = [];
    }
}

class Tile {
    constructor( index, x, y, isMap ) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.isMap = isMap

        this.isMap ? this.clearTileID( ) : this.setTileID( index );
        this.drawTileBorders( );
    };

    drawTileBorders( ) {
        const ctx = this.isMap ? MAP_CTX : SHEET_CTX;
        ctx.beginPath();
        ctx.moveTo( this.x, this.y );
        ctx.lineTo( this.x, this.y + TILE_SIZE );
        ctx.moveTo( this.x, this.y );
        ctx.lineTo( this.x + TILE_SIZE, this.y );
        ctx.stroke( );
    }

    setTileID( ID ) {
        this.ID = ID;
    };

    clearTileID( ) {
        this.ID = "E"
    };
};