function dragstart_handler(ev) {
    console.log(ev)
    console.log(ev.target.src)
    console.log("dragStart");
    // Set the drag's format and data. Use the event target's id for the data
    ev.dataTransfer.setData("text/plain", ev.target.id);
    // Create an image and use it for the drag image
    // NOTE: change "example.gif" to an existing image or the image will not
    // be created and the default drag image will be used.
    var img = new Image();
    img.src = ev.srcElement.image.currentSrc;
    ev.dataTransfer.setDragImage(img, 10, img.height);
   }
   
   function dragover_handler(ev) {
    console.log("dragOver");
    ev.preventDefault();
   }
   
   function drop_handler(ev) {
    console.log("Drop");
    ev.preventDefault();
    // Get the data, which is the id of the drop target
    captureForegroundClick(ev)
   }