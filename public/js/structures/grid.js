class Grid {
    constructor( x, y, rows, cols, ctx ) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.array = [];
        this.ctx = ctx;
        this.isOverviewCanvas = this.ctx != MAP_CTX && this.ctx != SHEET_CTX && this.ctx != PREVIEW_MAP_CTX && this.ctx != MAP_FOREGROUND_CTX;

        this.initializeGrid( );
    };
    
    initializeGrid( ) {
        const limit = this.rows * this.cols
        let tileX = ( this.isOverviewCanvas ) ? this.getXOffset( ) : 0;
        let tileY = ( this.isOverviewCanvas ) ? this.getYOffset( ) : 0;
        let row = 1;
        let col = 1;

        for( var i = 0; i < limit; i++ ) {
            this.array.push( new Tile( i, tileX, tileY, this.ctx, row, col ) )

            if ( ( i + 1 ) % this.cols == 0 ) {
                tileX = ( this.isOverviewCanvas ) ? this.getXOffset( ) : 0;
                tileY += TILE_SIZE;
                col = 1;
                row += 1;
            } else {
                tileX += TILE_SIZE
                col += 1
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
            if ( typeof tileGrid[index] == 'string' || typeof tileGrid[index] == 'number' ) {
                e.setTileID( tileGrid[index] );                
            }
            else {
                e.setTileID( tileGrid[index].id );     
                e.setSettings( { 'mirrored': tileGrid[index].mirrored, 'angle': tileGrid[index].angle } )
            }
        })
    }
}

class Tile {
    constructor( index, x, y, ctx, row, col ) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.index = index;  
        this.angle = 0;
        this.mirrored = false;
        this.row = row;
        this.col = col;
        this.hasSprite = false;
        this.spriteType;
        this.spriteData = {};

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

        this.flipTileBeforeDrawing( sheetImage, tilesheetXy );
    
        this.ctx.drawImage(
            SELECTED_TILE_CANVAS, 
            0, 0,
            TILE_SIZE * 2, TILE_SIZE * 2,
            this.x, this.y,
            TILE_SIZE, TILE_SIZE
        )
    }

    flipTileBeforeDrawing( sheetImage, tilesheetXy ) {
        const ctx = SELECTED_TILE_CTX;
        this.mirrored ? ctx.setTransform( -1, 0, 0, 1, TILE_SIZE * 2, 0 ) : ctx.setTransform(1,0,0,1,0,0);
        switch( this.angle ) {
            case 0: 
                ctx.drawImage( sheetImage, tilesheetXy.x, tilesheetXy.y, TILE_SIZE * 2, TILE_SIZE * 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );
                break;
            case 90:
                ctx.translate( 0 + TILE_SIZE * 2, 0 );
                ctx.rotate( 90 * ( Math.PI / 180 ) );
                ctx.drawImage( sheetImage, tilesheetXy.x, tilesheetXy.y, TILE_SIZE * 2, TILE_SIZE * 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );   
                ctx.rotate( -(90 * ( Math.PI / 180 ) ))
                ctx.setTransform(1,0,0,1,0,0);
                break;
            case 180:
                ctx.translate( 0 + TILE_SIZE * 2, 0 + TILE_SIZE * 2 );
                ctx.rotate( Math.PI );
                ctx.drawImage( sheetImage, tilesheetXy.x, tilesheetXy.y, TILE_SIZE * 2, TILE_SIZE * 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );   
                ctx.rotate( -Math.PI )
                ctx.setTransform(1,0,0,1,0,0);
                break;
            case 270:
                ctx.translate( 0, 0 + TILE_SIZE * 2 );
                ctx.rotate( 270 * ( Math.PI / 180 ) )
                ctx.drawImage( sheetImage, tilesheetXy.x, tilesheetXy.y, TILE_SIZE * 2, TILE_SIZE * 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );      
                ctx.rotate( -(270 * ( Math.PI / 180 )) )
                ctx.setTransform(1,0,0,1,0,0);
                break;
            default:
                alert('Error in flipping tile. Call the police!')
        }
    }

    setSpriteData( type, data ) {
        this.hasSprite = true;
        this.spriteType = type;
        this.spriteData = data;
    }

    setSettings( settings ) {
        this.mirrored = settings['mirrored'];
        this.angle = settings['angle'];
    }

    setTileID( ID ) {
        this.ID = ID;
    };

    clearTileID( ) {
        this.ID = "E"
    };
};