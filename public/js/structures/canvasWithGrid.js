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

    initGrid( rows, cols, drawBorders = true ) {
        this.grid       = new Grid( this.x, this.y, rows, cols, this.ctx, drawBorders );
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

    setTileAsUnblocked( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.setAsUnblocked( );
        this.redraw( );
    }

    unsetTileAsUnblocked( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.unsetAsUnblocked( );
        this.redraw( );
    }

    redraw( ) {
        this.ctx.clearRect( 0, 0, SHEET_CANVAS.image.width / 2, SHEET_CANVAS.image.height / 2 );
        this.ctx.drawImage( SHEET_CANVAS.image, 0, 0, SHEET_CANVAS.image.width, SHEET_CANVAS.image.height, 0, 0, SHEET_CANVAS.image.width / 2, SHEET_CANVAS.image.height / 2 );
        this.grid.array.forEach( ( tile ) => { tile.drawTileBorders( ) } )
    }

    logBlockedTiles( ) {
        let logger = [];
        this.grid.array.forEach( ( tile ) => { 
            if ( !tile.isUnblocked ) {
                logger.push( tile.ID );
            }
        })
        console.log(logger)
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
        this.ctx.clearRect( 0, 0, MAP_CANVAS.width, MAP_CANVAS.height )
        this.grid.initializeGrid( );
    }

    setNeighbourhood( neighbourhood ) {
        this.neighbourhood = neighbourhood
    }

    drawTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.setTileID( SHEET.activeTile.index)
        tile.setSettings( SHEET.activeTileSettings );
        this.ctx.drawImage( SELECTED_TILE_CANVAS, 0, 0, TILE_SIZE * 2, TILE_SIZE * 2, tile.x, tile.y, TILE_SIZE, TILE_SIZE )
    }

    clearTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.clearTileID( )
        tile.unSetSettings( );
        this.ctx.clearRect( tile.x, tile.y, TILE_SIZE, TILE_SIZE )
        tile.drawTileBorders( )
    }

    clearSpawnPointFromTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.unsetSpawnPoint( )
    }

    setSpawnPointToTileAtXY( x, y ) {
        const tile = super.getTileAtXY( x, y );
        tile.setSpawnPoint( )
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

    drawSelectedRoadBlockAtTile( x, y, direction = SELECTED_ROAD_DIRECTION ) {
        let sourceCanvas;
        switch ( direction ) {
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
            let newRoadIsHorizontal = direction == FACING_LEFT || direction == FACING_RIGHT
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
                tile.setRoad( direction )
            }
            else {
                MAP_ROADS_CTX.drawImage( sourceImage, 0, 0, TILE_SIZE, TILE_SIZE, tile.x, tile.y, TILE_SIZE, TILE_SIZE )
                tile.setRoad( direction )
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

    setRoads( roadObjects ) {
        roadObjects.forEach( ( e ) => {
            let road = new MapRoad( e.direction );
            road.setRoadFromDataObject( e );
            this.roads.push( road );
        })
    }

    setSpawnPoints( spawnPointsList ) {
        spawnPointsList.forEach( ( spawn ) => {
            let spawnData = spawn;
            spawnData.col = spawnData.col < 1 ? 1 : spawnData.col > this.grid.cols ? this.grid.cols : spawnData.col;
            spawnData.row = spawnData.row < 1 ? 1 : spawnData.row > this.grid.rows ? this.grid.rows : spawnData.row;
            this.grid.array.forEach( ( e ) => {
                if ( spawnData.col == e.col && spawnData.row == e.row) {
                    e.setSpawnPoint( spawnData.direction )
                }
            })
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

        let frontArray = []
        MAP_FRONT_GRID.grid.array.forEach( ( e ) => {
            if ( e.hasSettings ) {
                frontArray.push( { 'id': e.ID, 'angle': e.angle, 'mirrored': e.mirrored } )
            }
            else {
                frontArray.push(e.ID)
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
            'spawnPoints' : MAP_SPAWN_POINTS.grid.array.filter( ( e ) => { return e.hasSpawnPoint } ).map( ( e ) => { return e.exportSpawnData( ) } ),
            'roads': [ ...this.roads.map( ( e ) => { return e.getExportObject( ) })],
            'tileSet' : SHEET.sheetName,
            'outdoors' : null,
            'music' : null,
            'neighbours' : { },
            'rows' : parseInt(this.grid.rows),
            'columns' : parseInt(this.grid.cols),
            'grid' : exportArray,
            'frontGrid' : frontArray,
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
        this.doors = [];
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
                    if ( object.hasDoor ) {
                        this.doors.push( new Door( tile, object.type, this.doors.length, object.destination, object.directionIn ) )
                    }
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

        if ( objectData.type.includes( 'door' ) ) {
            this.doors.push( new Door( tile, objectData.type, this.doors.length ) )
        }

        this.drawSpritesInGrid( )
    }
    drawSpritesInGrid( inMapMaker = true ) {
        if ( inMapMaker ) {
            this.ctx.clearRect(0, 0, MAP_FOREGROUND_CANVAS.width, MAP_FOREGROUND_CANVAS.height);            
        }
        this.grid.array.forEach( ( tile ) => {
            try {
                if ( inMapMaker ) {
                    tile.drawTileBorders( )                    
                }

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
            }
            catch( ex ){
                console.log(ex.message);
            }

        })
    }
    drawDoorsInGrid( ) {
        this.ctx.clearRect(0, 0, MAP_FOREGROUND_CANVAS.width, MAP_FOREGROUND_CANVAS.height);
        this.grid.array.forEach( ( tile ) => {
            tile.drawTileBorders( )
        })
        this.doors.forEach( ( e ) => {
            console.log(e)
            e.draw( );
        } );
    }
    setDoorListToGrid( list ) {
        list.forEach( ( doorItem ) => { 
            let tileList = this.grid.array.filter( ( tile ) => { return doorItem.col == tile.col && doorItem.row == tile.row; })
            let doorTile = tileList[0]
            this.doors.push( new Door( doorTile, list.type, this.doors.length ) )
        })
    }
    clearSpriteFromTile(x, y) {
        const tile = super.getTileAtXY(x,y);
        if ( tile.hasSprite && tile.spriteType == 'object' && tile.spriteData.type.includes( 'door' ) ) {
            let doors = this.doors.filter( ( e ) => { return e.col == tile.col && e.row == tile.row })
            let door = doors[0];
            let doorIndex = this.doors.indexOf( door );
            door.removeDoorDiv( )
            this.doors.splice(doorIndex, 1)
        }
        tile.clearSpriteData( );
        this.drawSpritesInGrid( );
    }
    deleteDoorAtTile( tile ) {
        this.doors.forEach( ( door, index ) => {
            if ( door.row == tile.row && door.col == tile.col && door.spriteType == tile.spriteType ) {
                door.removeDoorDiv( )
                this.door.splice(index, 1);
            }
        })
    }
    highlightDoorAtXy( x, y ) {
        this.doors.forEach( ( door ) => {
            let spriteTop = door.y -  ( (door.dataObject.height_blocks - 1) * TILE_SIZE );
            if ( x > door.x && x < door.x + door.width 
                && y > spriteTop && y < spriteTop + door.height )
            {
                this.highlightDoor( door )
            }
        })
    }
    highlightDoor( door ) {
        let spriteTop = door.y -  ( (door.dataObject.height_blocks - 1) * TILE_SIZE );
        this.ctx.strokeStyle = 'white'
        this.ctx.lineWidth = 1.5
        this.ctx.strokeRect( door.x, spriteTop, door.width, door.height )
    }
    exportAllSprites( ) {
        let allSprites = {
            "characters": [ ],
            "mapObjects": [ ]
        }
        this.grid.array.forEach( ( tile ) => {
            tile.drawTileBorders( )
            if ( tile.hasSprite ) {
                if ( tile.spriteType == 'object' && !tile.spriteData.type.includes( 'door' ) ) {
                    allSprites.mapObjects.push( tile.spriteData )
                }
                else if ( tile.spriteType == 'object' && tile.spriteData.type.includes( 'door' ) ) {
                    let data = {}
                    this.doors.forEach( ( door ) => {
                        if ( door.row == tile.row && door.col == tile.col ) {
                            data = { 
                                ...tile.spriteData, 
                                'hasDoor': true, 
                                'directionIn': door.direction, 
                                'destination': door.destination
                            }
                        }
                    })
                    allSprites.mapObjects.push( data )
                }
                else if ( tile.spriteType == 'character' ) {
                    allSprites.characters.push( tile.spriteData )
                }
            }
        })

        return allSprites;
    }
}