/**
 * 
 * seats - by alrik
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - 
 * 
 * Example usage:
 * 
 * let seats = new Seats()
 * let allocation = seats.allocate(Seats.election2018)
 * console.log(allocation)
 * 
 * - - - - - - - - - - - - - - - - - - - - - - - 
 * 
 */


class Constants {
    static threshold = 4;
    static startDivisor = 1.2;
    static seats = 349;
}

class Party {
    constructor(name, percentage) {
        this.name = name;
        this.seats = 0;
        this.score = 0;
        this.percentage = percentage;
        this.divisor = Constants.startDivisor;
        this.updateScore();
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


export default class Seats {
    static election2018 = { "S":28.26, "M":19.84, "SD":17.53, "C":8.61, "V":8.00, "KD":6.32, "L":5.49, "MP":4.41 }

    /**
     * Given an object of partyname:voteshare key-value pairs, returns an object with partyname:seats key-value pairs
     * in accordance with the Modified Sainte-Laguë method (sv: jämkade uddatalsmetoden)
     * @param {Object.<string, number} votes object of votes to parties, with (partyname : voteshare) key-value pairs
     * @returns {Object.<string, number} object of seats allocated to parties, with (partyname : seats) key value pairs
     */
    allocate(votes) {

        let parties = Object.keys(votes).map(partyname => new Party(partyname, votes[partyname])); // array of parties
        
        // disregard parties below threshold when allocating seats
        let validParties = parties.filter(party => party.percentage >= Constants.threshold);
        
        if (validParties.length !== 0) {
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

        return this._getAllocation(parties)
    }

    /**
     * Returns true if percentages of parties add up to 100.0 %  (floating point 32-bit precision)
     * @param {Object.<string, number>} votes an object made up of key-value pairs of partyname : voteshare
     * @returns {boolean} whether parties add up to 100 %
     */
    checkPartySizes(votes) {
        return this.summarizeValues(votes) == 100;
    }

    /**
     * Returns the sum of an object's values, where the object is made up of key-value pairs of key : number.
     * @param {Object.<*,number>} object object whose values shall be summarized
     * @returns {number} the sum
     */
    summarizeValues(object) {
        return Math.fround(Object.keys(object).reduce((sum, key) => sum + object[key], 0));
    }
    /**
     * Given an array of {@link Party} objects, returns the current allocation of seats among them as an object on the form of
     * { partyname : seats, [...] }
     * 
     * @param {Party[]} parties the array of parties
     * @returns {Object.<string, number>} a list of objects with the keys name and seats
     */
    _getAllocation(parties) {
        return parties.reduce((allocation, party) => (allocation[party.name] = party.seats, allocation), {});
    }
}