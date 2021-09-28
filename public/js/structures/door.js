class Door {
    constructor( tile, spriteType ) {
        this.x = tile.x;
        this.y = tile.y;
        this.col = tile.col;
        this.row = tile.row;

        this.to;
        this.from;
        this.directionIn;

        this.spriteType = spriteType;

        let element = document.getElementById( this.spriteType );

        this.dataObject = element.dataObject;
        this.image = element.image;
        this.width = element.width;
        this.height = element.height
        this.draw( )
    }

    draw( ) {
        MAP_FOREGROUND_CTX.drawImage(
            this.image,
            0, 0,
            this.width * 2, this.height * 2,
            this.x, this.y -  ((this.dataObject.height_blocks - 1) * TILE_SIZE),
            this.width, this.height
        )
    }
}