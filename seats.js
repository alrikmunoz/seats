
class Constants {
    static threshold = 4;
    static startDivisor = 1.2;
    static seats = 349;
}

class Party {
    constructor(name, percentage) {
        this.name = name;
        this.percentage = percentage;
        this.seats = 0;
        this.divisor = Constants.startDivisor;
        this.score;
        this.updateScore();
    }

    // calculates the new score and increments to next divisor
    updateScore() {
        this.score = this.percentage / this.divisor;
        this.divisor = Math.floor(this.divisor + 2);
    }
}


class Seats {
    parties = [];
    remainingSeats = Constants.seats;

    
    addParties(...parties) {
        // add parties
        this.parties = [...this.parties, ...parties];
    }
    allocateSeats() {
        console.log((this.checkPartySizes() ? "Adds" : "Does not add") + " up to 100 %");
        
        // reset seats of each party
        this.parties.forEach(party => party.seats = 0);
        
        // disregard parties below threshold when allocating seats
        let validParties = this.parties.filter(party => party.percentage >= Constants.threshold);

        while (this.remainingSeats > 0) {
            // find party with highest score
            let highestScoringParty = validParties.reduce((prev, curr) => curr.score > prev.score ? curr : prev);

            // give 1 seat to party
            highestScoringParty.seats++;
            highestScoringParty.updateScore();

            this.remainingSeats--;
        }
    }


    // return true if parties add up to 100.0 %  (floating point 32-bit precision)
    checkPartySizes(parties) {
        let totalPercentage = Math.fround(this.parties.reduce((sum, party) => sum + party.percentage, 0));
        return totalPercentage == 100;
    }
}


function main() {
    // for testing purposes
    console.log("––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––");

    let seats = new Seats();

    seats.addParties(
    new Party("M", 22.8), 
    new Party("C", 9.7), 
    new Party("L", 4.0), 
    new Party("KD", 5.3), 
    new Party("S", 26.4), 
    new Party("V", 8.1), 
    new Party("MP", 4.0), 
    new Party("SD", 18.7), 
    new Party("ÖVR", 1.0));
    seats.allocateSeats();
    console.log(seats.parties);
}

main();