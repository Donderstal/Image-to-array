class Grid {
    constructor( x, y, rows, cols, ctx ) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.array = [];
        this.ctx = ctx;

        this.initializeGrid( );
    };
    
    initializeGrid( ) {
        const limit = this.rows * this.cols
        let tileX = 0;
        let tileY = 0;

        for( var i = 0; i < limit; i++ ) {
            this.array.push( new Tile( i, tileX, tileY, this.ctx ) )

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

    getTileAtXY( x, y ) {
        const column = Math.floor(event.offsetX / TILE_SIZE);
        const row = Math.floor(event.offsetY / TILE_SIZE);

        const tileIndex = (row * this.cols) + column;

        return this.array[tileIndex]
    }

    setTileGridToArray( tileGrid ) {
        this.array.forEach( ( e, index ) => {
            e.setTileID( tileGrid[index] );
        })
    }
}

class Tile {
    constructor( index, x, y, ctx ) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.index = index;  

        ( ctx == SHEET_CTX ) ? this.setTileID( this.index ) : this.clearTileID( );
        this.drawTileBorders( );
    };

    drawTileBorders( ) {
        this.ctx.beginPath();
        this.ctx.lineWidth = .5
        this.ctx.moveTo( this.x, this.y );
        this.ctx.lineTo( this.x, this.y + TILE_SIZE );
        this.ctx.moveTo( this.x, this.y );
        this.ctx.lineTo( this.x + TILE_SIZE, this.y );
        this.ctx.stroke( );
    }

    setTileID( ID ) {
        this.ID = ID;
    };

    clearTileID( ) {
        this.ID = "E"
    };
};