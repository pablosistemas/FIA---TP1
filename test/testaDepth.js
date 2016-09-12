var mod = require('../src/puzzle.js');
var modExp = require('./experiment.js');

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

console.log("Instancia inicial:");

novo.dump();

novo.depth2( 40 );
