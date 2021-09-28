class Grid {
    constructor( x, y, rows, cols, ctx ) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.array = [];
        this.ctx = ctx;
        this.isOverviewCanvas = this.ctx != MAP_ROADS_CTX &&this.ctx != MAP_CTX && this.ctx != SHEET_CTX && this.ctx != PREVIEW_MAP_CTX && this.ctx != MAP_FOREGROUND_CTX && this.ctx != MAP_SPAWN_POINTS_CTX;

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
        const column = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);

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
        this.hasSettings = false;
        this.angle = 0;
        this.mirrored = false;

        this.row = row;
        this.col = col;

        this.hasSprite = false;
        this.spriteType;
        this.spriteData = {};

        this.roads = [];
        this.isRoadTile = false;

        this.hasSpawnPoint = false;

        ( ctx == SHEET_CTX ) ? this.setTileID( this.index ) : this.clearTileID( );
        this.drawTileBorders( );
    };

    drawTileBorders( ) {
        this.ctx.beginPath();
        this.ctx.lineWidth = .5
        this.ctx.strokeStyle = 'black'
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
        this.direction = data.direction;
    }

    clearSpriteData( ) {
        this.hasSprite = false;
        this.spriteType = null;
        this.spriteData = null;
        this.direction = false;
    }

    setSettings( settings ) {
        this.hasSettings = true;
        this.mirrored = settings['mirrored'];
        this.angle = settings['angle'];
    }
    
    unSetSettings( ) {
        this.hasSettings = false;
        this.mirrored = false;
        this.angle = 0;
    }

    setTileID( ID ) {
        this.ID = ID;
    };

    clearTileID( ) {
        this.ID = "E"
    };

    setRoad( direction ) {
        this.roads = this.roads.includes(direction) ? this.roads : [ ...this.roads, direction ];
        this.isRoadTile = true;
    }

    unsetRoad( ) {
        this.roads = [];
        this.isRoadTile = false;
    }

    setSpawnPoint( direction = SELECTED_SPAWN_DIRECTION ) {
        this.hasSpawnPoint = true;
        this.spawnDirection = direction;
        this.drawSpawnPoint( )
    }

    drawSpawnPoint( ) {
        let sourceCanvas;
        switch( this.spawnDirection ) {
            case FACING_LEFT:
                sourceCanvas = document.getElementById("spawn-left-block-canvas")
                break;
            case FACING_UP:
                sourceCanvas = document.getElementById("spawn-up-block-canvas")
                break;
            case FACING_RIGHT:
                sourceCanvas = document.getElementById("spawn-right-block-canvas")
                break;
            case FACING_DOWN:
                sourceCanvas = document.getElementById("spawn-down-block-canvas")
                break;
        }        

        let sourceImage = new Image( )
        sourceImage.src = sourceCanvas.toDataURL( )
        sourceImage.onload = ( ) => {
            this.ctx.drawImage( sourceImage, 0, 0, TILE_SIZE, TILE_SIZE, this.x, this.y, TILE_SIZE, TILE_SIZE )
        }
    }

    unsetSpawnPoint( ) {
        this.hasSpawnPoint = false;
        this.spawnDirection = false;
        this.ctx.clearRect( this.x, this.y, TILE_SIZE, TILE_SIZE )
        this.drawTileBorders( );
    }

    exportSpawnData( ) {
        let col = this.col;
        let row = this.row;

        if ( col == 1 && this.spawnDirection == FACING_RIGHT ) {
            col -= 1
        } else if ( col == MAP.grid.cols && this.spawnDirection == FACING_LEFT ) {
            col += 1
        } else  if ( row == 1 && this.spawnDirection == FACING_DOWN ) {
            row -= 1
        } else  if ( row == MAP.grid.rows && this.spawnDirection == FACING_UP ) {
            row += 1
        }

        return {
            "col": col,
            "row": row,
            "direction": this.spawnDirection
        };
    }
}; 