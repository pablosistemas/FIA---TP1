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

var MAX_DEEP = 1000;
var solution = novo.idepth( MAX_DEEP );
