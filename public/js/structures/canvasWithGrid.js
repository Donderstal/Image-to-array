class CanvasWithGrid {
    constructor( x, y, ctx ) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
    };

    setDimensions( ) {
        this.width = width;
        this.height = height;
    };

    initGrid( rows, cols ) {
        this.rows       = rows;
        this.columns    = cols;
        this.grid       = new Grid( this.x, this.y, rows, cols, this.ctx );
    };

    setTileGrid( gridToSet ) {
        this.setTileGridToArray( gridToSet )
    }

    loadImageWithCallback( src, callback ) {
        this.sheetImage = new Image();
        this.sheetImage.src = src;

        this.sheetImage.onload( callback )
    }

    clearGrid( ) {
        this.grid.clearGrid( );
        this.rows       = null;
        this.columns    = null;
    };

    getTileAtXY( x, y ) {
        return this.grid.getTileAtXY( x, y );
    };
};

class Sheet extends CanvasWithGrid {
    constructor( x, y, ctx ) {
        super( x, y, ctx );
        console.log("initializing sheet!");
    };

    setSheet( sheetName ) {
        this.sheetName = sheetName;
    };

    clearGrid( ) {
        super.clearGrid( );
        SHEET_CTX.clearRect( 0, 0, SHEET_CANVAS.WIDTH, SHEET_CANVAS.HEIGHT );
        this.grid.initializeGrid( );
    }

    getTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        this.activeTile = tile;
        SELECTED_TILE_CTX.drawImage( SHEET_CANVAS, tile.x, tile.y, TILE_SIZE, TILE_SIZE, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 )
    }
}

class Map extends CanvasWithGrid {
    constructor( x, y, ctx ) {
        super( x, y, ctx );
        console.log("initializing map!")
    };

    setMapName( mapName ) {
        this.mapName = mapName;
    }

    clearGrid( ) {
        super.clearGrid( );
        MAP_CTX.clearRect( 0, 0, MAP_CANVAS.width, MAP_CANVAS.height )
        this.grid.initializeGrid( );
    }

    setNeighbourhood( neighbourhood ) {
        this.neighbourhood = neighbourhood
    }

    getTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.setTileID( SHEET.activeTile.index )
        MAP_CTX.drawImage( SHEET_CANVAS, SHEET.activeTile.x, SHEET.activeTile.y, TILE_SIZE, TILE_SIZE, tile.x, tile.y, TILE_SIZE, TILE_SIZE )
    }

    drawMap( ) {
        const position = { 'x' : 0, 'y' : 0 }

        for ( var i = 0; i < this.grid.array.length; i+=this.columns ) {
            this.drawRowInMap( this.grid.array(i,i+this.columns), position )
    
            position.y += TILE_SIZE
            position.x = 0;
        }
    }

    drawRowInMap( currentRow, position ) {
        for ( var j = 0; j < this.columns; j++ ) {
            const currentTile = currentRow[j]
    
            drawTileInGridBlock( currentTile, position )
            position.x += TILE_SIZE
        }
    }

    drawTileInMap( tile, startPositionInCanvas ) {
        if ( tile === "E" || tile === null) {
            return;
        }

        const tilePositionInSheet = SHEET_XY_VALUES[tile]
    
        this.ctx.drawImage(
            this.sheetImage, 
            tilePositionInSheet.x, tilePositionInSheet.y,
            TILE_SIZE * 2, TILE_SIZE * 2,
            startPositionInCanvas.x, startPositionInCanvas.y,
            TILE_SIZE, TILE_SIZE
        )
    }

    exportMapData( ) {
        let exportArray = [];
        this.grid.array.forEach( ( e ) => {
            exportArray.push(e.ID)
        })

        return {
            'mapName' : this.neighbourhood + '/' + this.mapName,
            'tileSet' : SHEET.sheetName,
            'outdoors' : null,
            'music' : null,
            'neighbours' : { },
            'rows' : this.grid.rows - 1,
            'cols' : this.grid.cols - 1,
            'grid' : exportArray,
            'mapObjects' : [],            
            'characters' : [],
            'actions' : [],
            'doors' : []
         };
    }
};