import Seats from './seats.mjs'

class Constants {
    static partyInputContainer = document.querySelector("#inputs-container");
    static results = document.querySelector("#results-section");
    static resultsBar = document.querySelector("#result-bar");
    static defaultPartyConfig = [
        { "name" : "V", "color" : "rgb(193, 13, 20)" },
        { "name" : "S", "color" : "rgb(237, 27, 52)" },
        { "name" : "MP", "color" : "rgb(83, 160, 69)" },
        { "name" : "C", "color" : "rgb(4, 106, 56)" },
        { "name" : "L", "color" : "rgb(0, 106, 179)" },
        { "name" : "M", "color" : "rgb(33, 62, 150)" },
        { "name" : "KD", "color" : "rgb(0, 94, 161)" },
        { "name" : "SD", "color" : "rgb(248, 220, 74" },
    ]
}

init();


function init() {
    let seats = new Seats();
    loadParties(seats);

    let addPartyInput = document.querySelector("#add-party-input");
    let addPartyBtn = document.querySelector("#add-party-btn");
    addPartyBtn.addEventListener("click", () => addPartyClick(seats, addPartyInput));
}

function loadParties(seats) {
    let votes = Seats.election2018;
    
    // add inputs for each party
    Object.keys(votes).forEach(partyname => Constants.partyInputContainer.appendChild(createPartyInput(seats, partyname, votes[partyname])));

    let allocation = seats.allocate(Seats.election2018);
    showAllocation(allocation);
}

function showAllocation(allocation) {
    console.log(allocation);
    let widthOfResultsBar = Constants.resultsBar.getBoundingClientRect().width;
    let seatsSum = Object.values(allocation).reduce((sum, seats) => sum + seats, 0);
    let seatWidth = widthOfResultsBar / seatsSum;

    // TODO: implement custom party order, e.g. dragging inputs & color
    while (Constants.resultsBar.firstChild)
        Constants.resultsBar.removeChild(Constants.resultsBar.lastChild); // remove all chunks
    Constants.defaultPartyConfig.forEach(party => {
        if (allocation[party.name] > 0)
            Constants.resultsBar.appendChild(createChunk(allocation[party.name] * seatWidth, party.color)); // add new chunks with width corresponding to seat allocation share
    });

}

function collectInputData() {
    let inputs = Array.from(document.querySelectorAll(".partyinput"), label => label.lastElementChild);
    
    // object of partyname:voteshare kv-pairs
    return inputs.reduce((votes, input) => {
        let vote = Number(input.value);
        if (isNaN(vote) || vote < 0) vote = input.value = 0;
        if (vote > 100) vote = input.value = 100;
        votes[input.name] = vote;
        return votes;
    }, {});
}

function createPartyInput(seats, partyname, vote) {
    let label = document.createElement("label");
    label.classList.add("partyinput");
    
    let partynameText = document.createElement("span");
    partynameText.appendChild(document.createTextNode(partyname));
    
    let input = document.createElement("input");
    input.type = "number";
    input.name = partyname;
    input.min = 0;
    input.max = 100;
    input.step = "any";
    input.value = vote;
    input.addEventListener("input", () => {
        // console.log(seats.summarizeValues(votes));
        // if (!seats.checkPartySizes(votes)) 
        //     console.warn("Voteshare does not add upp to 100 %");

        let votes = collectInputData();
        showAllocation(seats.allocate(votes));
        // update graphical input
    });

    label.appendChild(partynameText);
    label.appendChild(input);
    return label;
}

function addPartyClick(seats, input) {
    let partyname = input.value;
    let votes = collectInputData();
    if (Object.keys(votes).includes(partyname)) return; // disallow duplicate parties
    votes[partyname] = 0; // add new party to current votes
    showAllocation(seats.allocate(votes));

    Constants.partyInputContainer.appendChild(createPartyInput(seats, partyname, 0));
    input.value = "";

}

function createChunk(width, color = null) {
    if (!color) {
        let rndCol = () => Math.random()*255;
        color = `rgb(${rndCol()}, ${rndCol()}, ${rndCol()})`;
    }

    let chunk = document.createElement("div");
    chunk.style.width = width + "px";
    chunk.style.background = color;
    return chunk;
}