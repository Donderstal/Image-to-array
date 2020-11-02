class Grid {
    constructor( x, y, rows, cols, ctx ) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.array = [];
        this.ctx = ctx;
        this.isOverviewCanvas = this.ctx != MAP_CTX && this.ctx != SHEET_CTX && this.ctx != PREVIEW_MAP_CTX;

        this.initializeGrid( );
    };
    
    initializeGrid( ) {
        const limit = this.rows * this.cols
        let tileX = ( this.isOverviewCanvas ) ? this.getXOffset( ) : 0;
        let tileY = ( this.isOverviewCanvas ) ? this.getYOffset( ) : 0;

        for( var i = 0; i < limit; i++ ) {
            this.array.push( new Tile( i, tileX, tileY, this.ctx ) )

            if ( ( i + 1 ) % this.cols == 0 ) {
                tileX = ( this.isOverviewCanvas ) ? this.getXOffset( ) : 0;
                tileY += TILE_SIZE;
            } else {
                tileX += TILE_SIZE
            }
        };
    };

    getXOffset( ) {
        const overflowColumns = MAX_COLS - this.cols;
        return ( overflowColumns * TILE_SIZE ) / 2;
    }

    getYOffset( ) {
        const overflowRows = MAX_ROWS - this.rows;
        return ( overflowRows * TILE_SIZE ) / 2;
    }

    clearGrid( ) {
        this.grid = [];
    }

    drawMap( tileSheet ) {
        for ( var i = 0; i < this.array.length; i += this.cols ) {
            let row = this.array.slice( i, i + this.cols )
            this.drawRowInMap( row, tileSheet )
        }
    }

    drawRowInMap( currentRow, tileSheet ) {
        for ( var j = 0; j < this.cols; j++ ) {
            const currentTile = currentRow[j]
            currentTile.drawTileInMap( tileSheet )
        }
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

    drawTileInMap( sheetImage ) {
        if ( this.ID === "E" || this.ID === null) {
            return;
        }

        const tilesheetXy = SHEET_XY_VALUES[this.ID]
    
        this.ctx.drawImage(
            sheetImage, 
            tilesheetXy.x, tilesheetXy.y,
            TILE_SIZE * 2, TILE_SIZE * 2,
            this.x, this.y,
            TILE_SIZE, TILE_SIZE
        )
    }

    setTileID( ID ) {
        this.ID = ID;
    };

    clearTileID( ) {
        this.ID = "E"
    };
};