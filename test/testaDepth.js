const fs = require('fs');

var mod = require('../src/puzzle.js');

var casoInicial = 
   //[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 11, 13, 14, 15, 12]; 
   //[10,9,6,13,8,4,3,1,12,15,7,5,16,2,11,14]; 
   [3,7,12,14,4,9,11,2,13,15,8,10,5,6,16,1];

// var novo = new mod.Puzzle(4,casoInicial);
var novo = new mod.Puzzle(3,[7,2,3,1,9,8,5,4,6]);

console.log("Instancia inicial:");
novo.dump();

fs.appendFileSync('saidaDepth',novo.depth1());
