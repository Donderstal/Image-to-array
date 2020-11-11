const prepareNeighbourhoodManager = ( ) => {
    const activeHoods = MAP_STORAGE["neighbourhoods"];

    generateNeighbourhoodButtons( );
} 

const generateNeighbourhoodButtons = ( ) => {
    const activeHoods = MAP_STORAGE["neighbourhoods"];

    document.getElementById('manager-controls-column').innerHTML = "";
    Object.keys(activeHoods).forEach(key => {
        let button = document.createElement('button')
        button.id = "manage-"+key
        button.className = "neighbourhood-manager-select mt-5 btn btn-success btn-lg btn-block"
        button.appendChild(document.createTextNode(key))
        document.getElementById('manager-controls-column').append(button)
    })

    let newHoodDiv = document.createElement('div')
    newHoodDiv.className = "input-group mt-5 btn btn-success btn-lg btn-block"

    let newHoodInput = document.createElement('input')
    newHoodInput.setAttribute( 'type', 'text' );
    newHoodInput.setAttribute( 'placeholder', 'Create new' );
    newHoodInput.className  = "form-control";

    let innerNewHoodDiv = document.createElement('div')
    innerNewHoodDiv.className = "input-group-append"

    let button = document.createElement('button')
    button.id = "add-neighbourhood-button"
    button.className = "neighbourhood-manager-select btn btn-outline-light"
    button.appendChild(document.createTextNode("Confirm"));

    innerNewHoodDiv.append(button);
    newHoodDiv.append(newHoodInput);
    newHoodDiv.append(innerNewHoodDiv);
    document.getElementById('manager-controls-column').append(newHoodDiv)

    Array.from(document.getElementsByClassName('neighbourhood-manager-select')).forEach( ( element ) => {
        element.addEventListener( 'click', ( e ) => {
            handleSelectNeighbourhoodInManagerClick( e )
        })
    } )
}

const handleSelectNeighbourhoodInManagerClick = ( event ) => {
    const hoodId = event.target.id;
    const allHoods = MAP_STORAGE["neighbourhoods"];
    console.log(event.target)
    if ( hoodId == "add-neighbourhood-button" ) {
        alert('new neighbourhood bruh!')
    } else {
        const key = hoodId.replace("manage-", "")
        HOOD_MANAGER_DATA.ACTIVE = key;
        HOOD_MANAGER_DATA.HOODJSON = allHoods[key];
    }
}