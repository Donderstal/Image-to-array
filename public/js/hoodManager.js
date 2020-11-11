const prepareNeighbourhoodManager = ( ) => {
    const activeHoods = MAP_STORAGE["neighbourhoods"];

    generateNeighbourhoodButtons( );
} 

const generateNeighbourhoodButtons = ( ) => {
    const activeHoods = MAP_STORAGE["neighbourhoods"];

    document.getElementById('manager-controls-column').innerHTML = "";
    Object.keys(activeHoods).forEach(key => {
        let button = document.createElement('button')
        button.id = "manage-"+key+"-button"
        button.className = "mt-5 btn btn-success btn-lg btn-block"
        button.appendChild(document.createTextNode(key))
        document.getElementById('manager-controls-column').append(button)
    })

    let button = document.createElement('button')
    button.id = "add-neighbourhood-button"
    button.className = "mt-5 btn btn-success btn-lg "
    button.appendChild(document.createTextNode("+ Add neighbourhood"))
    document.getElementById('manager-controls-column').append(button)
    
}