/**
 * 
 * seats - by alrik
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - 
 * 
 * Example usage:
 * 
 * let seats = new Seats();  // by default loads with the 8 default parties
 * 
 * seats.setPercentage("S", 40)
 * seats.setPercentage("M", 30)
 * seats.setPercentage("SD", 30)
 * 
 * console.log(seats.getAllocation())
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - 
 * 
 */


/**
 * @typedef PartyAllocation
 * @type {object}
 * @property {string} partyname - name of the party.
 * @property {number} seats - number of seats allocated.
 */


class Constants {
    static threshold = 4;
    static startDivisor = 1.2;
    static seats = 349;
    static defaultParties = ["S", "M", "SD", "C", "V", "KD", "L", "MP"]
}

class Party {
    constructor(name) {
        this.name = name;
        this.seats = 0;
        this.score = 0;
        this.percentage = 0;
        this.divisor = Constants.startDivisor;
    }

    /**
     * Calculates the new score and increments to next divisor
     */
    updateScore() {
        this.score = this.percentage / this.divisor;
        if (this.divisor == Constants.startDivisor) this.divisor = Math.floor(this.divisor);
        this.divisor += 2;  // divisor increments:  1.2  3  5  7 ... and so on
    }
}


class Seats {
    parties = [];

    /**
     * Creates a Seats object which is used for all interaction, e.g. let seats = new Seats(); seats.getAllocation();
     * @param {boolean} useDefault 
     */
    constructor(useDefault = true) {
        if (useDefault)
            Constants.defaultParties.forEach(partyname => {
                this.addParty(partyname);
            });
    }

    /**
     * Adds party with partyname as name to current calculation. Initial percentage is 0 %
     * @param {string} partyname
     */
    addParty(partyname) {
        let party = this._getParty(partyname);
        if (party !== undefined) {
            console.error("Error: Cannot add same party twice");
            return;
        }
        
        this.parties.push(new Party(partyname))

        this._allocateSeats();
    }

    /**
     * Sets a new percentage for the given party and optionally reallocates seats to current parties
     * @param {string} partyname the name of the party
     * @param {number} percentage the new percentage of the party
     * @param {boolean} reallocate whether seats shall be reallocated after percentage is set
     */
    setPercentage(partyname, percentage, reallocate = true) {
        let party = this._getParty(partyname);
        if (party === undefined) {
            console.error("Error: Unknown party", partyname);
            return;
        }

        party.percentage = percentage;
        
        if (reallocate)
            this._allocateSeats();
    }

    /**
     * Returns the current allocation of seats to the involved parties as an array of objects on the form of
     * { partyname : seats }
     * @returns {PartyAllocation[]} list of party allocations
     */
    getAllocation() {
        console.log((this._checkPartySizes() ? "Adds up 100 %" : "Does not add up to 100 % "));
        return this.parties.map(party => ({ [party.name] : party.seats }));
    }

    /**
     * Resets allocation data for all parties
     */
    _resetAllocation() {
        this.parties.forEach(party => {
            party.divisor = Constants.startDivisor;
            party.seats = 0;
            party.updateScore();
        })
    }

    /**
     * Gives out seats to the added parties in accordance with the Modified Sainte-Laguë method (sv: jämkade uddatalsmetoden)
     */
    _allocateSeats() {
        this._resetAllocation();

        // disregard parties below threshold when allocating seats
        let validParties = this.parties.filter(party => party.percentage >= Constants.threshold);
        if (validParties.length == 0) return;

        let remainingSeats = Constants.seats;
        while (remainingSeats > 0) {
            // TODO: Consider ties (e.g. draw random)
            // find party with highest score
            let highestScoringParty = validParties.reduce((prev, curr) => curr.score > prev.score ? curr : prev);

            // give 1 seat to party
            highestScoringParty.seats++;
            highestScoringParty.updateScore();

            remainingSeats--;
        }
    }


    /**
     * Returns true if percentages of parties add up to 100.0 %  (floating point 32-bit precision)
     * @returns {boolean} whether parties add up to 100 %
     */
    _checkPartySizes() {
        let totalPercentage = Math.fround(this.parties.reduce((sum, party) => sum + party.percentage, 0));
        return totalPercentage == 100;
    }

    /**
     * Given a party name returns the party with that name, or undefined if no such party is found in current parties
     * @param {string} partyname 
     * @returns {Party|undefined} party with given partyname or undefined if not found in current parties
     */
    _getParty(partyname) {
        return this.parties.find(party => party.name == partyname)
    }
}