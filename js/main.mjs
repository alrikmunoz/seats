import Seats from './seats.mjs'

let seats = new Seats();

// e.g.
seats.setPercentage("S", 40)
seats.setPercentage("M", 30)
seats.setPercentage("SD", 30)
 
console.log(seats.getAllocation())