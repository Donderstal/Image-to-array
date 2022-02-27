let canvasGrid = false;

const stopMapOverviewScroll = ( ) => {
    IS_OVERVIEW_SCROLL_ACTIVE = false;
}

const initMapOverviewScrollOnClick = ( event ) => {
    IS_OVERVIEW_SCROLL_ACTIVE = true;
    OVERVIEW_SCROLL_Y_COUNTER = event.pageY - OVERVIEW_CANVAS_WRAPPER.offsetTop;
    OVERVIEW_SCROLL_X_COUNTER = event.pageX - OVERVIEW_CANVAS_WRAPPER.offsetLeft;
    OVERVIEW_SCROLL_TOP = OVERVIEW_CANVAS_WRAPPER.scrollTop;    
    OVERVIEW_SCROLL_LEFT = OVERVIEW_CANVAS_WRAPPER.scrollLeft;    
}

const mapOverviewHorizontalScroll = ( event ) => {
    const x = event.pageX - OVERVIEW_CANVAS_WRAPPER.offsetLeft;
    const stepHori = x - OVERVIEW_SCROLL_X_COUNTER;
    OVERVIEW_CANVAS_WRAPPER.scrollLeft = OVERVIEW_SCROLL_LEFT - stepHori;

    const y = event.pageY - OVERVIEW_CANVAS_WRAPPER.offsetTop;
    const stepVert = y - OVERVIEW_SCROLL_Y_COUNTER;
    OVERVIEW_CANVAS_WRAPPER.scrollTop = OVERVIEW_SCROLL_TOP - stepVert;
}

const setMapOverviewElementsTotalWidth = ( width ) => {
    OVERVIEW_CANVAS_WRAPPER.width = width;
}

const clearOverviewWrapperElements = ( ) => {
    removeAllChildrenFromParent( "map-overview-canvas-wrapper" );
}


const setMapClass = ( mapClass, mapCanvas, mapData, canvasX, canvasY ) => {
    mapClass      = new Map( canvasX, canvasY, mapCanvas.getContext( "2d" ) );
    mapClass.initGrid( mapData.rows, mapData.columns );
    mapClass.setTileGrid( mapData.grid.flat(1) );
    mapClass.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[mapData.tileSet].src, mapClass.drawMapFromGridData );
}

const setCanvasElementData = ( element, canvasX, canvasY ) => {
    const mapData = element.mapData;
    setOverviewCanvas( element.mapCanvas );
    setMapClass( element.mapClass, element.mapCanvas, mapData, canvasX, canvasY );
}

const handleShowSubMapsButtonClick = ( event ) => {
    clearOverviewWrapperElements( );

    if ( IN_SUBMAP_OVERVIEW ) {
        MAP_OVERVIEW_CURRENT_SUBMAP = null;
        IN_SUBMAP_OVERVIEW = false;
    }
    else {
        clearOverviewWrapperElements( );
        MAP_OVERVIEW_CURRENT_SUBMAP = MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD[event.target.id.split('/')[2]].subMaps;
        IN_SUBMAP_OVERVIEW = true;
    }

    initializeMapOverviewCanvases( );     
}

const initializeMapOverviewCanvases = ( ) => {
    console.log(MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD);
    canvasGrid = new CanvasGrid(MAP_OVERVIEW_CURRENT_NEIGHBOURHOOD);
    document.getElementById("export-neighbourhood").style.visibility = "visible";
}

const exportAsZip = ( ) => {
    if ( canvasGrid != false ) {
        canvasGrid.exportAsZip();
    }
}

class CanvasSlot {
    constructor( key, column, row ) {
        this.isSet = false;
        this.key = key;
        this.column = column;
        this.row = row;
        this.setCanvas( );
    }

    drawMap( ) {
        this.map = new Map( this.canvas.x, this.canvas.y, this.canvas.getContext( "2d" ) );
        this.map.initGrid( this.rows, this.columns );
        this.map.setTileGrid( this.grid );
        this.map.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[this.tileSet].src, (() => {
            this.map.drawMapFromGridData( )
            this.frontMap = new Map( this.canvas.x, this.canvas.y, this.canvas.getContext( "2d" ) );
            this.frontMap.initGrid( this.rows, this.columns );
            this.frontMap.setTileGrid( this.frontGrid );
            this.frontMap.loadImageWithCallback( '/png-files/tilesheets/' + TILESHEETS[this.tileSet].src, (() => {
                this.frontMap.drawMapFromGridData( false )
                this.spriteGrid = new ObjectsGrid( this.canvas.x, this.canvas.y, this.canvas.getContext( "2d" ) );
                this.spriteGrid.initGrid( this.rows, this.columns, false );
                this.spriteGrid.setCharacters( this.characters );
                this.spriteGrid.setObjects( this.mapObjects );
                this.spriteGrid.drawSpritesInGrid( false );        
            }).bind(this) );   
        }).bind(this) );

    }

    setCanvas( ) {
        this.canvas = createNodeWithClassOrID( 'canvas', "overview-canvas", this.key );
        this.canvas.width = MAX_CANVAS_WIDTH;
        this.canvas.height = MAX_CANVAS_HEIGHT;
        this.canvas.style.gridRow = this.row;
        this.canvas.style.gridColumn = this.column;
        OVERVIEW_CANVAS_WRAPPER.append( this.canvas );        
    }

    loadMapToCanvas( data ) {
        if ( data != undefined ) {
            let map = MAP_STORAGE.maps[data];
            this.rawJSON = map;
            this.mapName = map.mapName;
            this.rows = map.rows;
            this.columns = map.columns;
            this.grid = map.grid.flat(1);
            this.frontGrid = map.hasOwnProperty("frontGrid") ? map.frontGrid.flat(1) : this.grid.map((e) => {return "E";});
            this.tileSet = map.tileSet;
            this.characters = map.characters;
            this.mapObjects = map.mapObjects;
            this.actions = map.actions;
            this.spawnPoints = map.spawnPoints;
            this.roads = map.roads;
            this.drawMap( );
            this.isSet = true;
        }
    }

    getMapDataForExport( neighbourhoodName, mapKey ) {
        return {
            frontGrid: "FRONT_GRID",
            grid: "GRID",
            outdoors: this.rows == 16 && this.columns == 24,
            mapName: neighbourhoodName +"/"+ mapKey,
            rows: this.rows,
            columns: this.columns,
            tileSet: this.tileSet,
            characters: this.characters,
            mapObjects: this.mapObjects,
            spawnPoints: this.spawnPoints,
            roads: this.roads,
            actions: this.actions
        }
    }
}

class CanvasGrid {
    constructor( data ){
        this.maps = [];
        this.name = data.name;
        data.horizontal_slots.forEach((slotChar, index) => { 
            let horiChar = slotChar;
            let horiIndex = index;
            data.vertical_slots.forEach((e, vertIndex) => {
                this[horiChar+e] = new CanvasSlot(horiChar+e, horiIndex + 1, vertIndex + 1);
                this[horiChar+e].loadMapToCanvas(data[horiChar+e]);
                this.maps.push(this[horiChar+e]);
            });
        })
    }

    exportAsZip( ) {
        var zip = new JSZip();
        this.maps.forEach((map) => {
            if ( map.isSet ) {
                const mapFolder = zip.folder(map.key);
                mapFolder.file([map.key]+".js", JSON.stringify(map.getMapDataForExport( this.name, map.key )));
                mapFolder.file("grid.js", JSON.stringify(map.grid));
                mapFolder.file("frontgrid.js", JSON.stringify(map.frontGrid));          
            }
        })
        zip.generateAsync({
            type: "base64"
        }).then(function(content) {
            window.location.href = "data:application/zip;base64," + content;
        });    
    }
}