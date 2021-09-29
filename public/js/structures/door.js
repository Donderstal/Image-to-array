class Door {
    constructor( tile, spriteType, index, destination = "", direction = "" ) {
        
        this.x = tile.x;
        this.y = tile.y;
        this.col = tile.col;
        this.row = tile.row;

        this.destination = destination;
        this.direction = direction;
        this.index = index;

        this.spriteType = spriteType;

        let element = document.getElementById( this.spriteType );

        this.dataObject = element.dataObject;
        this.image = element.image;
        this.width = element.width;
        this.height = element.height
        this.draw( )
        this.addDoorDiv( );
    }

    draw( ) {
        MAP_FOREGROUND_CTX.drawImage(
            this.image,
            0, 0,
            this.width * 2, this.height * 2,
            this.x, this.y -  ((this.dataObject.height_blocks - 1) * TILE_SIZE),
            this.width, this.height
        )
        MAP_FOREGROUND_CTX.fillStyle = "white";
        MAP_FOREGROUND_CTX.font = '32px serif';
        MAP_FOREGROUND_CTX.fillText( this.index, this.x, this.y )
    }

    addDoorDiv( ) {
        let doorDiv = document.getElementById("doors-control-prototype").cloneNode(true);
        this.doorId = "door-control-" + this.col + " " + this.row;
        doorDiv.id = this.doorId
        doorDiv.style.visibility = "visible";
        doorDiv.style.display = "block";
        let h5 = doorDiv.getElementsByTagName("h5")
        h5[0].innerText = "Door #" + this.index;

        this.setListeners( doorDiv )
        document.getElementById("doors-options-div-inner").append(doorDiv)
    }

    setListeners( doorDiv ) {
        doorDiv.onmouseenter = ( ) => {
            MAP_FOREGROUND.drawDoorsInGrid( )
            MAP_FOREGROUND.highlightDoor( this );
         };
        doorDiv.onmouseleave = ( ) => { 
            MAP_FOREGROUND.drawDoorsInGrid( )
        };
        
        let button = doorDiv.getElementsByTagName("button");
        button[0].onclick = ( ) => {
            this.removeDoorDiv( );
            MAP_FOREGROUND.doors.splice(this.index, 1);
            MAP_FOREGROUND.drawDoorsInGrid( );
        }

        let selectDestination = doorDiv.getElementsByClassName("neighbour-select");
        if ( this.destination != "" ) {
            appendOptionToSelect( this.destination, selectDestination[0], true )
        }
        selectDestination[0].onchange = ( e ) => {
            this.destination = e.target.value;
        }
        let selectDirection = doorDiv.getElementsByClassName("direction-select");
        if ( this.direction != "" ) {
            appendOptionToSelect( this.direction, selectDirection[0], true )
        }
        selectDirection[0].onchange = ( e ) => {
            this.direction = e.target.value;
        }
    }

    removeDoorDiv( ) {
        let doorDiv = document.getElementById(this.doorId);
        document.getElementById("doors-options-div-inner").removeChild( doorDiv );
    }
}