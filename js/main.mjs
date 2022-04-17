import Seats from './seats.mjs'

let seats = new Seats();

loadParties();

function loadParties() {
    let votes = Seats.election2018;
    
    let partyInputContainer = document.querySelector("#inputs-container");
    // add inputs for each party
    Object.keys(votes).forEach(partyname => partyInputContainer.appendChild(createPartyInput(partyname, votes[partyname])));

    let allocation = seats.allocate(Seats.election2018);
    showAllocation(allocation);
}

function showAllocation(allocation) {
    console.log(allocation);
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

function createPartyInput(partyname, vote) {
    let label = document.createElement("label");
    label.classList.add("partyinput");
    
    let partynameText = document.createTextNode(partyname);
    
    let input = document.createElement("input");
    input.type = "number";
    input.name = partyname;
    input.min = 0;
    input.max = 100;
    input.step = 1;
    input.value = vote;
    input.addEventListener("input", () => {
        let votes = collectInputData();
        // console.log(seats.summarizeValues(votes));
        // if (!seats.checkPartySizes(votes)) 
        //     console.warn("Voteshare does not add upp to 100 %");
        showAllocation(seats.allocate(votes));
    });

    label.appendChild(partynameText);
    label.appendChild(input);
    return label;
}