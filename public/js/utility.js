const getNodeWithID = ( ID ) => {
    return document.getElementById( ID );
}

const makeHiddenCanvasVisible = ( canvasElement ) => {
    canvasElement.classList.remove('invisible-canvas');
    canvasElement.classList.add('visible-canvas');
}

const hideVisibleCanvas = ( canvasElement ) => {
    canvasElement.classList.remove('visible-canvas');
    canvasElement.classList.add('invisible-canvas');
}

const setValueOfReadOnlyElement = ( elementID, value ) => {
    getNodeWithID(elementID).readOnly = false;
    getNodeWithID(elementID).value = value;
    getNodeWithID(elementID).readOnly = true;
}

const setTextContentOfElements = ( keyValuePairs ) => {
    for ( const key in keyValuePairs ) {
        getNodeWithID( key ).textContent = keyValuePairs[key];
    }
}

const createNodeWithClassOrID = ( element, className = null, id = null ) => {
    let node = document.createElement(element);
    node.className = className;
    node.id = id;

    return node;
}