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
        this.grid       = new Grid( this.x, this.y, rows, cols, this.ctx );
    };

    setTileGrid( gridToSet ) {
        this.grid.setTileGridToArray( gridToSet )
    }

    loadImageWithCallback( src, callback ) {
        this.sheetImage = new Image();
        this.sheetImage.src = src;

        this.sheetImage.onload = ( ) => { 
            const boundCallback = callback.bind(this);
            boundCallback( );
        };
    }

    drawMapFromGridData( ) {
        this.grid.drawMap( this.sheetImage )
    }

    clearGrid( ) {
        this.grid.clearGrid( );
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

    setSheet( src ) {
        this.src = src
        const splitSrc = src.split('/')
        const png = splitSrc[splitSrc.length - 1];
        Object.keys( TILESHEETS ).forEach( ( e ) => {
            if ( TILESHEETS[e].src == png ) {
                this.sheetName = e;
            }
        })
    };

    clearGrid( ) {
        super.clearGrid( );
        SHEET_CTX.clearRect( 0, 0, SHEET_CANVAS.WIDTH, SHEET_CANVAS.HEIGHT );
        this.grid.initializeGrid( );
    }

    captureTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        this.activeTile = tile;
        this.activeTileSettings = {
            'angle': 0,
            'mirrored': false
        }
        SELECTED_TILE_CTX.drawImage( SHEET_CANVAS.image, tile.x* 2, tile.y* 2, TILE_SIZE* 2, TILE_SIZE* 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 )
    }

    updateActiveTileSettings( key, value) {
        this.activeTileSettings[key] = value
        this.drawTileWithSetting( )
    }

    drawTileWithSetting(  ) {
        const ctx = SELECTED_TILE_CTX;
        this.activeTileSettings['mirrored'] ? ctx.setTransform( -1, 0, 0, 1, TILE_SIZE * 2, 0 ) : ctx.setTransform(1,0,0,1,0,0);
        switch( this.activeTileSettings['angle'] ) {
            case 0: 
                ctx.drawImage( SHEET_CANVAS.image, this.activeTile.x * 2, this.activeTile.y * 2, TILE_SIZE * 2, TILE_SIZE * 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );
                break;
            case 90:
                ctx.translate( 0 + TILE_SIZE * 2, 0 );
                ctx.rotate( 90 * ( Math.PI / 180 ) );
                ctx.drawImage( SHEET_CANVAS.image, this.activeTile.x* 2, this.activeTile.y* 2, TILE_SIZE* 2, TILE_SIZE* 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );      
                ctx.rotate( -(90 * ( Math.PI / 180 ) ))
                ctx.setTransform(1,0,0,1,0,0);
                break;
            case 180:
                ctx.translate( 0 + TILE_SIZE * 2, 0 + TILE_SIZE * 2 );
                ctx.rotate( Math.PI );
                ctx.drawImage( SHEET_CANVAS.image, this.activeTile.x* 2, this.activeTile.y* 2, TILE_SIZE* 2, TILE_SIZE* 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );   
                ctx.rotate( -Math.PI )
                ctx.setTransform(1,0,0,1,0,0);
                break;
            case 270:
                ctx.translate( 0, 0 + TILE_SIZE * 2 );
                ctx.rotate( 270 * ( Math.PI / 180 ) )
                ctx.drawImage( SHEET_CANVAS.image, this.activeTile.x * 2, this.activeTile.y* 2, TILE_SIZE* 2, TILE_SIZE* 2, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2 );           
                ctx.rotate( -(270 * ( Math.PI / 180 )) )
                ctx.setTransform(1,0,0,1,0,0);
                break;
            default:
                alert('Error in flipping tile. Call the police!')
        }
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

    drawTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.setTileID( SHEET.activeTile.index)
        tile.setSettings( SHEET.activeTileSettings );
        MAP_CTX.drawImage( SELECTED_TILE_CANVAS, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2, tile.x, tile.y, TILE_SIZE, TILE_SIZE )
    }

    clearTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.clearTileID( )
        tile.unSetSettings( );
        MAP_CTX.clearRect( tile.x, tile.y, TILE_SIZE, TILE_SIZE )
        tile.drawTileBorders( )
    }

    exportMapData( ) {
        let exportArray = [];
        this.grid.array.forEach( ( e ) => {
            if ( e.hasSettings ) {
                exportArray.push( { 'id': e.ID, 'angle': e.angle, 'mirrored': e.mirrored } )
            }
            else {
                exportArray.push(e.ID)
            }
        })

        const sprites = MAP_FOREGROUND.exportAllSprites( );

        return {
            'mapName' : this.mapName,
            'neighbourhood': this.neighbourhood,
            'tileSet' : SHEET.sheetName,
            'outdoors' : null,
            'music' : null,
            'neighbours' : { },
            'rows' : parseInt(this.grid.rows),
            'columns' : parseInt(this.grid.cols),
            'grid' : exportArray,
            'mapObjects' : sprites.mapObjects,            
            'characters' : sprites.characters,
            'actions' : [],
            'doors' : []
         };
    }
};

class ObjectsGrid extends CanvasWithGrid {
    constructor( x, y, ctx ) {
        super( x, y, ctx );
        this.characters = false;
        this.objects = false;
        console.log("initializing objectsGrid!")
    };
    setCharacters( characters ) {
        characters.forEach( ( character ) => {
            const col = character.type == 'walking' ? character.lastPosition.col : character.col; 
            const row = character.type == 'walking' ? character.lastPosition.row : character.row; 
            this.grid.array.forEach( ( tile ) => {
                if ( tile.row == row && tile.col == col ) {
                    tile.setSpriteData( "character", character )
                }
            })
        })
    }
    setObjects( objects ) {
        objects.forEach( ( object ) => {
            this.grid.array.forEach( ( tile ) => {
                if ( tile.row == object.row && tile.col == object.col ) {
                    tile.setSpriteData( "object", object )
                }
            })
        })
    }
    placeCharacterSpriteAtXY(x, y) {
        const tile = super.getTileAtXY(x,y)
        tile.setSpriteData( 'character', 
            { 
                "anim_type": "NPC_ANIM_TYPE_IDLE",
                "row": tile.row,
                "col": tile.col,
                "sprite": SELECTED_SPRITE,
                "direction": SELECTED_SPRITE_POSITION
            }
        )
        this.drawSpritesInGrid( )
    }
    placeObjectSpriteAtXY(x, y){
        const tile = super.getTileAtXY(x,y)
        let objectData = {  
            "type"  : SELECTED_SPRITE.split('.')[0],
            "row"   : tile.row,
            "col"   : tile.col,
        }
        if ( IS_CAR )
            objectData["direction"] = SELECTED_SPRITE_POSITION;
        tile.setSpriteData( 'object', objectData )

        this.drawSpritesInGrid( )
    }
    drawSpritesInGrid( ) {
        this.ctx.clearRect(0, 0, MAP_FOREGROUND_CANVAS.width, MAP_FOREGROUND_CANVAS.height);
        this.grid.array.forEach( ( tile ) => {
            tile.drawTileBorders( )
            if ( tile.hasSprite ) {
                const element = document.getElementById( tile.spriteType == 'object' ? tile.spriteData.type : tile.spriteData.sprite)
                if ( tile.spriteType == 'object' && typeof tile.spriteData.direction != 'string' ) {
                    this.ctx.drawImage(
                        element.image,
                        0, 0,
                        element.width * 2, element.height * 2,
                        tile.x, element.dataObject.height_blocks > 1 ? tile.y -  ( (element.dataObject.height_blocks - 1) * TILE_SIZE ) : tile.y,
                        element.width, element.height
                    )
                }
                else if ( tile.spriteType == 'object' && typeof tile.spriteData.direction == 'string' ) {
                    let dimensions = element.dataObject.getDimensions( tile.direction );
                    this.ctx.drawImage(
                        element.image,
                        element.dataObject[tile.direction].x, element.dataObject[tile.direction].y, 
                        dimensions.width * 2, dimensions.height * 2,
                        tile.x, (dimensions.height) > TILE_SIZE ? tile.y -  (dimensions.height - TILE_SIZE) : tile.y,
                        dimensions.width, dimensions.height
                    )
                }
                else if ( tile.spriteType == 'character' ) {
                    let sourceY;
                    switch( tile.spriteData.direction ) {
                        case 'FACING_DOWN':
                            sourceY = 0;
                            break;
                        case 'FACING_LEFT':
                            sourceY = STRD_SPRITE_HEIGHT
                            break;
                        case 'FACING_RIGHT':
                            sourceY = STRD_SPRITE_HEIGHT *  2
                            break;
                        case 'FACING_UP':
                            sourceY = STRD_SPRITE_HEIGHT * 3
                            break;
                    }
                    this.ctx.drawImage(
                        element.image,
                        0, sourceY,
                        element.width, element.height,
                        tile.x, tile.y - ( TILE_SIZE * 0.75 ),
                        STRD_SPRITE_WIDTH / 2, STRD_SPRITE_HEIGHT / 2
                    )
                }
            }
        })
    }
    clearSpriteFromTile(x, y) {
        const tile = super.getTileAtXY(x,y);
        tile.clearSpriteData( );
        this.drawSpritesInGrid( );
    }
    exportAllSprites( ) {
        let allSprites = {
            "characters": [ ],
            "mapObjects": [ ]
        }
        this.grid.array.forEach( ( tile ) => {
            tile.drawTileBorders( )
            if ( tile.hasSprite ) {
                if ( tile.spriteType == 'object' ) {
                    allSprites.mapObjects.push( tile.spriteData )
                }
                else if ( tile.spriteType == 'character' ) {
                    allSprites.characters.push( tile.spriteData )
                }
            }
        })

        return allSprites;
    }
}