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
        this.roads = []
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

    addRoad( direction, tileList ) {
        tileList.forEach( ( e ) => {
            this.drawSelectedRoadBlockAtTile( e.x, e.y );
        })

        let pendingRoad = new MapRoad( direction );
        pendingRoad.setRoadFromTileList( tileList );
        this.deleteCrossingOppositeDirectionRoads( direction, pendingRoad );

        let collidingRoads = this.findCollidingRoadIfPossible(direction, pendingRoad);
        collidingRoads.forEach( ( e ) => {
            pendingRoad.mergeRoad( e );
            this.roads.splice( this.roads.indexOf( e ), 1 )
        })

        this.roads.push( pendingRoad );
    }

    deleteCrossingOppositeDirectionRoads( direction, pendingRoad ) {
        let collidingRoads;
        switch( direction ) {
            case FACING_LEFT:
                collidingRoads = this.findCollidingRoadIfPossible( FACING_RIGHT, pendingRoad )
                break;
            case FACING_UP:
                collidingRoads = this.findCollidingRoadIfPossible( FACING_DOWN, pendingRoad )
                break;
            case FACING_RIGHT:
                collidingRoads = this.findCollidingRoadIfPossible( FACING_LEFT, pendingRoad )
                break;
            case FACING_DOWN:
                collidingRoads = this.findCollidingRoadIfPossible( FACING_UP, pendingRoad )
                break;
        }
        collidingRoads.forEach( ( e ) => {
            this.roads.splice( this.roads.indexOf( e ), 1 )
        })
    }

    clearRoadTiles( direction, tileList ) {
        tileList.forEach( ( e ) => {
            this.removeSelectedRoadBlockAtTile( e.x, e.y )
        })

        let pendingRoad = new MapRoad( direction );
        pendingRoad.setRoadFromTileList( tileList );

        this.roads.forEach( ( e ) => {
            e.clearTiles( pendingRoad.tileList );
            if ( e.tileList.length == 0 ) {
                this.roads.splice( this.roads.indexOf( e ), 1 )
            }
        })
    }

    findCollidingRoadIfPossible(direction, pendingRoad) {
        let collidingRoads = [];
        this.roads.forEach( ( e ) => { 
            if ( e.direction == direction ) {
                let roadsCanCollide = e.isHorizontal 
                    ? e.topRow == pendingRoad.topRow && e.bottomRow == pendingRoad.bottomRow 
                    : e.leftCol == pendingRoad.leftCol && e.rightCol == pendingRoad.rightCol

                if ( !roadsCanCollide ) {
                    return;
                }
                switch( e.direction ) {
                    case FACING_LEFT:
                        if ( ( pendingRoad.startCol == ( e.endCol - 1) || pendingRoad.startCol >= e.endCol ) 
                        || ( pendingRoad.endCol == ( e.startCol + 1) || pendingRoad.endCol <= e.startCol ) ) {
                            collidingRoads =  [ ...collidingRoads, e ]
                        }
                        break;
                    case FACING_UP:
                        if (( pendingRoad.startRow == ( e.endRow - 1) || pendingRoad.startRow >= e.endRow ) 
                        || ( pendingRoad.endRow == ( e.startRow + 1) || pendingRoad.endRow <= e.startRow ) ) {
                            collidingRoads =  [ ...collidingRoads, e ]
                        }
                        break;
                    case FACING_RIGHT:
                        if ( ( pendingRoad.startCol == ( e.endCol + 1) || pendingRoad.startCol <= e.endCol ) 
                        || ( pendingRoad.endCol == ( e.startCol - 1) || pendingRoad.endCol >= e.startCol ) ) {
                            collidingRoads =  [ ...collidingRoads, e ]
                        }
                        break;
                    case FACING_DOWN:
                        if ( ( pendingRoad.startRow == ( e.endRow + 1) || pendingRoad.startRow <= e.endRow ) 
                        || ( pendingRoad.endRow == ( e.startRow - 1) || pendingRoad.endRow >= e.startRow )) {
                            collidingRoads =  [ ...collidingRoads, e ]
                        }
                        break;
                } 
            }
        })
        return collidingRoads;
    }

    drawSelectedRoadBlockAtTile( x, y ) {
        let sourceCanvas;
        switch ( SELECTED_ROAD_DIRECTION ) {
            case FACING_LEFT:
                sourceCanvas = document.getElementById("car-left-block-canvas")
                break;
            case FACING_UP:
                sourceCanvas = document.getElementById("car-up-block-canvas")
                break;
            case FACING_RIGHT:
                sourceCanvas = document.getElementById("car-right-block-canvas")
                break;
            case FACING_DOWN:
                sourceCanvas = document.getElementById("car-down-block-canvas")
                break;
        }
        let sourceImage = new Image( );
        sourceImage.src = sourceCanvas.toDataURL( )
        sourceImage.onload = ( ) => {
            const tile = super.getTileAtXY( x, y );
            let newRoadIsHorizontal = SELECTED_ROAD_DIRECTION == FACING_LEFT || SELECTED_ROAD_DIRECTION == FACING_RIGHT
            if ( tile.roads.length != 0 && 
                ( (!newRoadIsHorizontal && (tile.roads[0] == FACING_LEFT || tile.roads[0] == FACING_RIGHT))
                || (newRoadIsHorizontal && (tile.roads[0] == FACING_UP || tile.roads[0] == FACING_DOWN)) ) 
                ) {
                let sourceImage2 = new Image( );
                sourceImage2.src = sourceCanvas.toDataURL( )
                sourceImage2.onload = ( ) => {
                    MAP_ROADS_CTX.drawImage( 
                        sourceImage, 
                        0, 0, TILE_SIZE / 2, TILE_SIZE / 2, 
                        tile.x, tile.y, TILE_SIZE / 2, TILE_SIZE / 2
                    )
                    MAP_ROADS_CTX.drawImage( 
                        sourceImage2, 
                        TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 2, 
                        tile.x + TILE_SIZE / 2, tile.y + TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE / 2
                    )
                }
                tile.setRoad( SELECTED_ROAD_DIRECTION )
            }
            else {
                MAP_ROADS_CTX.drawImage( sourceImage, 0, 0, TILE_SIZE, TILE_SIZE, tile.x, tile.y, TILE_SIZE, TILE_SIZE )
                tile.setRoad( SELECTED_ROAD_DIRECTION )
            }
        }

    }

    removeSelectedRoadBlockAtTile( x, y ) {
        const tile = this.getTileAtXY( x, y );
        MAP_ROADS_CTX.clearRect( tile.x, tile.y, TILE_SIZE, TILE_SIZE )
        tile.unsetRoad( SELECTED_ROAD_DIRECTION );
        tile.drawTileInMap( this.sheetImage )
        MAP_ROADS.grid.array.forEach( ( e ) => {
            e.drawTileBorders( );
        })
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

        const leftInput = document.getElementById("neighbours-input-left")
        const upInput = document.getElementById("neighbours-input-up")
        const rightInput = document.getElementById("neighbours-input-right")
        const downInput = document.getElementById("neighbours-input-down")
        let returner = {
            'mapName' : this.mapName,
            'neighbourhood': this.neighbourhood,
            'neighbours' : {},
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

         returner.neighbours.right = rightInput.options[rightInput.selectedIndex].value;
         returner.neighbours.left = leftInput.options[leftInput.selectedIndex].value;
         returner.neighbours.up = upInput.options[upInput.selectedIndex].value;
         returner.neighbours.down = downInput.options[downInput.selectedIndex].value;

         return returner;
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