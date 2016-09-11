// testing file using mocha framework
// mocha is in node_modules directory inside this directory
// `pwd`/test/node_modules/mocha/bin/

var mod = require('/home/bob/Documents/pablo/ufmg/sem11/fia/tp1/src/puzzle.js')

// remember thar order^2 is the empty cell
var novo = new mod.Puzzle(3,[1,2,3,4,5,6,7,8,9]);

var assert = require ('assert');
describe ('End state', function() {
   describe ('Puzzle', function() {
      console.log(novo.goal);
      it('should return true', function(){
         assert.equal(true, novo.testEndState([1,2,3,4,5,6,7,8,novo.emptyCell])); 
      })   
   })
});

describe ('Puzzle\'s swapping method', function() {
   var myArray;
   before(function(){
      myArray = [9,1,2,3,4,5,6,7,8];
      // swaping indexes 2 and 3
      novo.swap(myArray,2,3)
   });

   describe ('Puzzle', function() {
      it('should return array with inverted values', function(){ 
         assert.deepEqual(myArray,[9,1,3,2,4,5,6,7,8]);
      })   
   })
});

describe ('Puzzle\'s testEqualStates method', function() {
   var state1, state2, state3;

   before(function(){
      state1 = [9,1,2,3,4,5,6,7,8];
      state2 = [9,1,2,3,4,5,6,7,8];
      state3 = [9,2,2,3,4,5,6,7,10];
   });

   describe ('Puzzle', function() {
      it('should return true for equal arrays', function(){ 
         assert.equal(true, novo.testEqualState(state1,state2));
      });
      it('should return false for different arrays', function(){ 
         assert.equal(false, novo.testEqualState(state1,state3));
      })   
   });

});

describe('Puzzle children creating', function(){
   var children;
   var obj;
   before(function(){
      children = novo.generateChildren([8,4,7,5,2,novo.emptyCell,3,1,6]);   
      console.log(children);
      obj = [
         [8,4,7,5,novo.emptyCell,2,3,1,6],
         [8,4,novo.emptyCell,5,2,7,3,1,6],
         [8,4,7,5,2,6,3,1,novo.emptyCell]
      ];
   });

   describe ('Children', function(){
      it('should return children nodes of the state passed as parameter. The nodes must be all combinations of \"\" element moved 1 position', 
      function(){
         // TODO
         assert.deepEqual(children, obj);
      })
   })
});

describe('Remove duplicated arrays', function(){
   var src, dst;
   before(function(){
      src = [
         [8,4,novo.emptyCell,5,2,7,3,1,6],
         [8,4,7,5,2,6,3,1,novo.emptyCell],
         [8,4,7,5,novo.emptyCell,2,3,1,6]
      ];
      dst = [
         [8,4,novo.emptyCell,5,2,3,7,1,6],
         [8,4,7,5,2,6,3,1,novo.emptyCell],
         [8,4,7,5,novo.emptyCell,2,3,1,6]
      ];
      novo.removeChildren(src,dst);
   });

   describe ('Removing', function(){
      it('It should remove from src array duplicated in dst array of arrays', 
      function(){
         // TODO
         assert.deepEqual(src, [[8,4,novo.emptyCell,5,2,7,3,1,6]]);
      })
   })
});

/*describe('tests inversoins function', function(){
      it('', function(){
         // TODO
         var state = [12,1,10,2,7,11,4,14,5,0,9,15,8,13,6,3];
         assert.deepEqual(true, novo.invariant(state));
      })
});*/

/*describe('tests breadth-first method with order 3', function(){
   var puzzleObj;
   before(function(){
      puzzleObj = new Puzzle (3,[1,2,7,4,5,9,8,6,3]);
      //console.log(puzzleObj.emptyCell);
   });

   it('', function(){
      // TODO
      console.log(puzzleObj.breadth());
      // console.log(puzzleObj.breadth());
   });
});*/

/*describe('tests depth-first method', function(){
   var puzzleObj;
   before(function(){
      puzzleObj = new Puzzle (4,[12,1,10,2,7,11,4,14,5,16,9,15,8,13,6,3]);
   });

   it('', function(){
      // TODO
      console.log(puzzleObj.depth());
   });
});*/

describe('Manhattan', function(){
   var state = [12,1,10,2,7,11,4,14,5,16,9,15,8,13,6,3];
   console.log(state);
   var Q = new mod.X(state);
   var dist;
   before(function(){
      dist=Q.heuristicEval2([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
   });

   it('Manhattan distance is correct', function(){
      // TODO
      assert.equal(39,dist);
   });
});
