function handleDragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);

    setTimeout( ( ) => {
        var image = new Image();
        image.src = document.getElementById('selected-sprite-canvas').toDataURL();
        ev.dataTransfer.setDragImage(image, TILE_SIZE, TILE_SIZE);
    }, 250 )
   }
   
   function handleDragOver(ev) {
    ev.preventDefault();
   }
   
   function handleDragEnd(ev) {
    ev.preventDefault();
    captureForegroundClick(ev)
   }