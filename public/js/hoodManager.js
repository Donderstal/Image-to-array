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
    newHoodInput.id = "add-neighbourhood-input"
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

const selectNeighbourhoodForManager = ( key ) => {
    const allHoods = MAP_STORAGE["neighbourhoods"];

    HOOD_MANAGER_DATA.ACTIVE = key;
    HOOD_MANAGER_DATA.HOODJSON = allHoods[key];

    
    document.getElementById("current-neighbourhood-title").innerText = "Current: " + HOOD_MANAGER_DATA.ACTIVE

    document.getElementsByClassName("edit-neighbourhood-controls-for-manager")[0].classList = "edit-neighbourhood-controls-for-manager";
    document.getElementsByClassName("select-neighbourhood-controls-for-manager")[0].classList = "select-neighbourhood-controls-for-manager window-inactive";    
}

const unsetNeighbourhoodForManager =  ( ) => {
    HOOD_MANAGER_DATA.ACTIVE = null
    HOOD_MANAGER_DATA.HOODJSON = { };

    document.getElementsByClassName("edit-neighbourhood-controls-for-manager")[0].classList = "edit-neighbourhood-controls-for-manager window-inactive";
    document.getElementsByClassName("select-neighbourhood-controls-for-manager")[0].classList = "select-neighbourhood-controls-for-manager";    
}

const handleAddNeighbourhoodButton = ( ) => {
    const newHoodName = document.getElementById("add-neighbourhood-input").value;
    if ( confirm("Create a new neighbourhood named: '" + newHoodName + "'?") ) {
        const allHoods = MAP_STORAGE["neighbourhoods"];
        allHoods[newHoodName] = {};
        generateNeighbourhoodButtons()
    } 

    return newHoodName;
}

const handleSelectNeighbourhoodInManagerClick = ( event ) => {
    const hoodId = event.target.id;
    let key;

    if ( hoodId == "add-neighbourhood-button" ) {
        key = handleAddNeighbourhoodButton( )
    } else {
        key = hoodId.replace("manage-", "")
    }

    selectNeighbourhoodForManager(key)
}