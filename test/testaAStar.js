var mod = require('../src/puzzle.js');
var modExp = require('./experiment.js');

// process.exit(1);

if( process.argv.length < 5 )
   throw "You must pass the input and output filenames and num elements as parameter ";

// creates a new experiment
// process.argv[2] = in filename, 
// process.argv[3] = goal filename
// process.argv[4] = number of elements to read from files

var exp = new modExp.experiment(process.argv[2], process.argv[3],
               parseInt(process.argv[4]));

var novo = new mod.Puzzle (
      Math.sqrt(parseInt(process.argv[4])),
      exp.casoInicial,
      exp.casoFinal
   );

// var novo = new mod.Puzzle(3,[8,1,3,4,9,2,7,6,5]);
// var novo = new mod.Puzzle(3,[2,1,4,6,8,9,7,5,3]);
// var novo = new mod.Puzzle(3,[4,6,7,2,9,1,5,8,3]);

console.log("Instancia inicial:");

novo.dump();

var solution = novo.aStar2();

/*var casoInicial = 
   // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 11, 13, 14, 15, 12]; 
   // [10,9,6,13,8,4,3,1,12,15,7,5,16,2,11,14]; 
   // [3,2,1,4,5,16,11,8,9,7,10,12,13,14,6,15];
   // [1,2,16,4,5,6,3,8,9,10,7,12,13,14,15,11];

   [2, 3, 4, 5, 1, 13, 14, 6, 12, 11, 15, 16, 10, 9, 8, 7];*/

// var casoFinal = [1,2,3,4,12,13,14,5,11,16,15,6,10,9,8,7];

