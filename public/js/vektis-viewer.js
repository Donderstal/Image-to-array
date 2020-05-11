let V_Standaarden = {};
let V_Codelijsten = {};
let V_Gegevenselementen = {};

let V_Selected_Standard_Regels = {

}

let V_Selected_Standard_Regel = {

}

const getJsonFiles = ( ) => {
    fetch("../../vektis-json/standaarden.json")
        .then((response) => {
            return response.json()
        })
        .then((data) => displayStandaarden(data))

    fetch("../../vektis-json/gegevens_elementen.json")
        .then((response) => {
            return response.json()
        })
        .then((data) => displayGegevenselementen(data))
}

const displayStandaarden = (data) => {
    data.forEach( (e) => {
        let newDiv = document.createElement("div")
        newDiv.className = "border-bottom text-center p-1"

        let button = document.createElement("button")
        button.innerText = e["ID"] + " v" + e["Versie"]
        button.className = "btn btn-primary standaard-button"

        let id = e["ID"] + e["Versie"]
        button.id = id

        newDiv.appendChild(button)
        document.getElementById("standaarden-div").appendChild(newDiv)

        V_Standaarden[id] = e
    })
}

const displayGegevenselementen = (data) => {
    data.forEach( (e) => {
        let newDiv = document.createElement("div")
        newDiv.className = "border-bottom text-center p-1"

        let button = document.createElement("button")
        button.innerText = e["ID"]
        button.className = "btn btn-info gegevenselement-button"

        let id = e["ID"]
        button.id = id

        newDiv.appendChild(button)
        document.getElementById("gegevenselementen-div").appendChild(newDiv)

        V_Gegevenselementen[id] = e
    })
}

const showStandaardInfo = ( event ) => {
    let standaard = V_Standaarden[event.target.id]
    document.getElementById("standaarden-div").style.display = 'none';

    let infoDiv = document.createElement("div")
    infoDiv.className = 'list-container'
    infoDiv.id = "standaard-info"

    let headerDiv = makeStandaardHeader( standaard )
    infoDiv.appendChild(headerDiv)  

    let regelInfo = getRegels( standaard )
    infoDiv.appendChild(regelInfo)  

    document.getElementById("standaarden-wrapper").appendChild(infoDiv)
    document.getElementById("close-standaard-info").addEventListener( 'click', closeInfoDiv )
}

const showGegelementInfo = ( event, isEvent = true ) => {
    let GegEl;

    if ( isEvent ) {
        GegEl = V_Gegevenselementen[event.target.id]
    }
    else {
        GegEl = V_Gegevenselementen[event]
    }

    document.getElementById("gegevenselementen-div").style.display = 'none';

    let infoDiv = document.createElement("div")
    infoDiv.className = 'list-container'
    infoDiv.id = "gegevenselement-info"

    headerDiv = document.createElement("div")
    headerDiv.className = "bg-info text-white text-center"
    header = document.createElement("h4")
    header.innerText = GegEl.ID
    close = document.createElement("span")
    close.innerText = "X"
    close.id = "close-gegevenselement-info"
    close.style = "float: right"
    header.appendChild(close)
    headerDiv.appendChild(header)

    infoDiv.appendChild(headerDiv)  

    let GegElInfo = getGegevenselementInfo( GegEl )
    infoDiv.appendChild(GegElInfo)  

    document.getElementById("gegevenselementen-wrapper").appendChild(infoDiv)
    document.getElementById("close-gegevenselement-info").addEventListener( 'click', closeGegInfoDiv )
}

const showRegelInfo = ( event ) => {
    let activeRegel = V_Selected_Standard_Regel[event.target.id]
    document.getElementById("regelinformatie-div").style.display = 'none';

    console.log(V_Gegevenselementen[activeRegel["ID gegevens"]])

    showGegelementInfo(activeRegel["ID gegevens"], false)

    let infoDiv = document.createElement("div")
    infoDiv.className = 'list-container'
    infoDiv.id = "regelinformatie-info"

    headerDiv = document.createElement("div")
    headerDiv.className = "bg-info text-white text-center"
    header = document.createElement("h4")
    header.innerText = activeRegel.Volgnummer
    close = document.createElement("span")
    close.innerText = "X"
    close.id = "close-regelinformatie-info"
    close.style = "float: right"
    header.appendChild(close)
    headerDiv.appendChild(header)

    infoDiv.appendChild(headerDiv)

    let subinfoDiv = document.createElement("div")
    subinfoDiv.className = "container"

    for (const [key, value] of Object.entries(activeRegel)) {
        let rowDiv = document.createElement("div")
        rowDiv.className = "row"

        let keyDiv = document.createElement("div")
        keyDiv.className = "col-sm-4"
        keyDiv.innerText = key

        let valueDiv = document.createElement("div")
        valueDiv.className = "col-sm-8"
        valueDiv.innerText = value
        
        rowDiv.appendChild(keyDiv)
        rowDiv.appendChild(valueDiv)
        subinfoDiv.appendChild(rowDiv)
     }


    infoDiv.appendChild(subinfoDiv)
    document.getElementById("regelinformatie-wrapper").appendChild(infoDiv)
    document.getElementById("close-regelinformatie-info").addEventListener( 'click', closeRegelInfoDiv )
}

getJsonFiles()
setTimeout( ( ) => {
    Array.from(document.getElementsByClassName('standaard-button')).forEach( (e) => {
        e.addEventListener( 'click', showStandaardInfo )
    } )

    Array.from(document.getElementsByClassName('gegevenselement-button')).forEach( (e) => {
        e.addEventListener( 'click', showGegelementInfo )
    } )
}, 500)

const makeStandaardHeader = ( standaard ) => {
    headerDiv = document.createElement("div")
    headerDiv.className = "bg-primary text-white text-center"
    header = document.createElement("h4")
    header.innerText = standaard.ID + " v" + standaard.Versie
    close = document.createElement("span")
    close.innerText = "X"
    close.id = "close-standaard-info"
    close.style = "float: right"
    header.appendChild(close)

    subHeader = document.createElement("h5")
    subHeader.innerText = standaard['Naam bericht']

    headerDiv.appendChild(header)
    headerDiv.appendChild(subHeader)

    return headerDiv
}

const getRegels = ( standaard ) => {
    allRegelsDiv = document.createElement("div")

    standaard.Berichtstructuur.splice(standaard.Berichtstructuur.length - 1, 1);

    standaard.Berichtstructuur.forEach( (regel) => {
        regel.splice( 0, 1 )
        regelDiv = document.createElement("div")

        let newDiv = document.createElement("div")
        newDiv.className = "border-bottom text-center p-1"

        let button = document.createElement("button")
        button.innerText = "Regel: " + regel[1].Volgnummer.substring(0,2)
        button.className = "btn btn-primary standaard-regel-button"
        button.id = regel[1].Volgnummer.substring(0,2)
        button.addEventListener( 'click', showRegelInformatie )
        newDiv.append(button)

        V_Selected_Standard_Regels[regel[1].Volgnummer.substring(0,2)] = regel

        allRegelsDiv.append(newDiv)
    } )

    return allRegelsDiv
}

const showRegelInformatie = ( event ) => {
    document.getElementById("regelinformatie-div").innerHTML = ""
    V_Selected_Standard_Regel = {}

    let regelLijst = V_Selected_Standard_Regels[event.target.id]

    regelLijst.forEach( (e) => {
        let newDiv = document.createElement("div")
        newDiv.className = "border-bottom text-center p-1"

        let button = document.createElement("button")
        button.innerText = e["Volgnummer"]
        button.className = "btn btn-info gegevenselement-button"

        let id = e["Volgnummer"]
        button.id = id
        button.addEventListener( 'click', showRegelInfo )

        newDiv.appendChild(button)
        document.getElementById("regelinformatie-div").appendChild(newDiv)

        V_Selected_Standard_Regel[id] = e
    })
}

const getGegevenselementInfo = ( GegEl ) => {
    let gegElKeyList = [ "ID", "Toelichting", "Beschrijving", "Type", "Lengte", "Patroon", "Codelijst" ]

    let infoDiv = document.createElement("div")
    infoDiv.className = "container"

    gegElKeyList.forEach( (e) => {
        let rowDiv = document.createElement("div")
        rowDiv.className = "row"

        let keyDiv = document.createElement("div")
        keyDiv.className = "col-sm-4"
        keyDiv.innerText = e

        let valueDiv = document.createElement("div")
        valueDiv.className = "col-sm-8"
        valueDiv.innerText = GegEl[e]
        
        rowDiv.appendChild(keyDiv)
        rowDiv.appendChild(valueDiv)
        infoDiv.appendChild(rowDiv)
    })

    return infoDiv
}

const closeInfoDiv = ( ) => {
    V_Selected_Standard_Regels = { }
    V_Selected_Standard_Regel = { }

    document.getElementById("standaarden-wrapper").removeChild(document.getElementById("standaard-info"))
    document.getElementById("regelinformatie-div").innerHTML = ""

    document.getElementById("standaarden-div").style.display = 'block';

}

const closeGegInfoDiv = ( ) => {
    document.getElementById("gegevenselementen-wrapper").removeChild(document.getElementById("gegevenselement-info"))
    document.getElementById("gegevenselementen-div").style.display = 'block';
}

const closeRegelInfoDiv = ( ) => {
    closeGegInfoDiv()
    document.getElementById("regelinformatie-wrapper").removeChild(document.getElementById("regelinformatie-info"))

    document.getElementById("regelinformatie-div").style.display = 'block';
}

const organizeAndPrintRegels = ( ) => {
    let records = {}
    for (const prop in V_Standaarden) { 
        var currStandard = V_Standaarden[prop]
        var currStruct = currStandard.Berichtstructuur
        currStruct.forEach( (record) => {
            record.forEach( (regel) => {
                if ( regel.Volgnummer ) {
                    var gegevensID = regel["ID gegevens"]

                    var recordId = regel.Volgnummer.substring(0, 2)
                    if ( records[recordId] == undefined ) {
                        records[recordId] = {}
                    }

                    var currRecord = records[recordId]
                    var recordRuleID = regel.Volgnummer
                    if ( currRecord[recordRuleID] == undefined ) {
                        currRecord[recordRuleID] = []
                    }

                    var isPresent = false

                    currRecord[recordRuleID].forEach((e) => {
                        isPresent = ( e == gegevensID )
                    })
                    
                    if ( !isPresent ) {
                        currRecord[recordRuleID].push(gegevensID)
                    }
                }
            }) 
        })
    } 
    console.log(records)
    return records
}

const OpenRegelModal = () => {
    var records = organizeAndPrintRegels( )
    Array.from(records).forEach( (e) => {
        console.log('elo')
        RegelDiv = document.createElement("div")
        RegelDiv.innerText = e
        document.getElementsByClassName[0]("modal-body").appendChild(RegelDiv)
    })
}