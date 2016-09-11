/* DEBUG */
const fs = require('fs');

// generates hash from array
var crypto = require("crypto");

const CHILDISINOPENANDCLOSED  = 0;

const CHILDISINOPEN           = 1;

const CHILDISINCLOSED         = 2;

const CHILDISNOTONOPENORCLOSED  = 3;


// hints: prototyped methods are faster than object methods because
// just a single function is ever created

// copying arrays inside other arrays is performed with slice(),
// on the other way, just a reference of the first array is copied
// and any modification is performed in all references

// TODO: Mocha's script to test all Puzzle's methods

// constructor
function Puzzle (order, state, goal){

   if (order === undefined || state === undefined){
      throw "You must explicitly defined prder and state parameters";
   }

   // TODO: convert global variables in private (var keyword)
   this.order = order;
   this.state = state;

   // We will use the pow as empty cell to avoid problems in sort
   // methods
   this.emptyCell = Math.pow(this.order,2);

   // Puzzle's final state
   if(goal != undefined) {
      this.goal = goal;
   }
   // add empty square in the puzzle
   else {
      this.goal  = [];
      for(var i=1; i <= this.emptyCell; i++) {
         this.goal.push(i);
      }
   }
};

// print Puzzle state
// blank == order^2 do puzzle
// blank is replaced by " " in dump
Puzzle.prototype.dump = function(who){

   if(who === undefined) {
      who = this.state;
   }

   var order = Math.sqrt(who.length);
   var elem, blank;
   blank = Math.pow(order,2);

   for(var i=0; i < order; i++){
      var string = "|\t";
      for(var j=0; j < order; j++){
         elem = who[i*order+j];
         if (elem === blank)
            elem = " ";
         string += ("\t"+elem+"\t");
      }
      console.log(string+"\t|");
   }
};

// tests if current state (CS) is equals the puzzle's goal
Puzzle.prototype.testEndState = function (CS){
   // this takes another context inside anonymous functions!
   if(CS == undefined) {
      console.log(CS);
      throw 'Undefined in testEndstate';
   }  

   if(this.goal.length !== CS.length) {
      throw "Impossible to compare arrays of different length";
   }

   for (var i = 0; i < CS.length; i++){
      // console.log(CS[i]+" "+this.goal[i])
      if(this.goal[i] != CS[i])
         return false;
   }
   return true;
}

// tests if current state (CS) is the goal
Puzzle.prototype.finalState = function (CS){
   var self = this;
   CS.forEach(function(value,idx){
      if(idx != value)
         return false;
   });
   return true;
}


// return true is element is the empty space of Puzzle
function emptyElem(element, index, array){
   return element === "";
}

Puzzle.prototype.swap = function(array,i,j) {
   var aux  = array[i];
   array[i] = array[j];
   array[j] = aux;
}

// generate all movements possibilities from a Puzzle's node 
Puzzle.prototype.generateChildren = function(CS){
   var children = [];
   var emptyIdx = CS.indexOf(this.emptyCell);
   // console.log(emptyIdx);
   
   if(emptyIdx == -1){
      //console.log(CS);
      throw "Puzzle without \"\" element";
   }
   
   // accesses left neighbor
   //if(CS[emptyIdx-1]){
   if(parseInt(emptyIdx)%parseInt(this.order) != 0){
      var temp = CS.slice();
      this.swap(temp,emptyIdx,emptyIdx-1);
      children.push(temp);
      /*console.log("left");
      console.log(temp);*/
   }

   // accesses upper neighbor
   if(CS[parseInt(emptyIdx)-parseInt(this.order)] != undefined){
      var temp = CS.slice();
      this.swap(temp,emptyIdx,emptyIdx-this.order);
      children.push(temp);
      /*console.log("upper");
      console.log(temp);*/
   }

   // accesses right neighbor
   // if(CS[emptyIdx+1]){
   if(parseInt(emptyIdx)%parseInt(this.order) != (parseInt(this.order)-1)){
      var temp = CS.slice();
      this.swap(temp,emptyIdx,emptyIdx+1);
      children.push(temp);
      /*console.log("right");
      console.log(temp);*/
   }

   // accesses lower neighbor
   if(CS[parseInt(emptyIdx)+parseInt(this.order)] != undefined){
      var temp = CS.slice();
      this.swap(temp,emptyIdx,emptyIdx+this.order);
      children.push(temp);
      /*console.log("lower");
      console.log(temp);*/
   }

   return children;
}

Puzzle.prototype.testEqualState = function(arr1, arr2){
   for(var i=0; i < arr1.length; i++){
      if(arr2[i] != arr1[i])
         return false;
   }
   return true;
}

// deletes the value received as parameter
// used mainly to remove undefined values from an array
Array.prototype.clean = function(deleteValue) {
   for(var i=0; i < this.length; i++){
      if(this[i] === deleteValue){
         this.splice(i,1);
         i--;
      }
   }
   return this;
}

// Copies content from src to the front of dst
Puzzle.prototype.unshiftArrays = function (dst, src) {
   for (var i = 0; i < src.length; i++) {
      if(src[i] == undefined) {
         console.log(src);
         throw "Error, null in children object";
      }

      dst.unshift (src[i].slice());
   }
}

// Copies content from src to the front of dst.
// You must use call new X over src array elements
Puzzle.prototype.unshiftXArrays = function (dst, src, father) {
   for (var i = 0; i < src.length; i++) {
      if(src[i] == undefined) {
         console.log(src);
         throw "Error, null in children object";
      }

      var Xc = new X(src[i]);
      Xc.setG(father.getG() + 1);
      Xc.setParent(father);
      dst.unshift (Xc);
   }
}

// Copies content from src to the end of dst.
// You must use call new X over src array elements
Puzzle.prototype.pushXArrays = function (dst, src, father) {
   for (var i = 0; i < src.length; i++) {
      if(src[i] == undefined) {
         console.log(src);
         throw "Error, null in children object";
      }

      var Xc = new X(src[i]);
      Xc.setG(father.getG() + 1);
      Xc.setParent(father);
      dst.push (Xc);
   }
}

// TODO
// remove from src the arrays that are already present in dst
Puzzle.prototype.removeChildren = function(src, dst) {
  
   var comp1, comp2;
   //var aux = [];
   for(var i=0; i < src.length; i++){
      comp1 = src[i];
      for(var j=0; j < dst.length; j++){
         comp2 = dst[j];
         if( comp1 != undefined && comp2 != undefined){
            // se for removido, idx nao incrementa para compensar
            // elemento removido
            if(this.testEqualState(comp1,comp2)){
               delete src[i];
               //console.log(comp1);
            } /*else {
               aux.push(src[i]);
            } */
         }
      }
   }
   
   // removes 'undefined' of array
   src.clean(undefined);
};

// remove from arr the arrays that are already present in arrObj
// You must call getState() method for each element from arrObj
Puzzle.prototype.removeXChildren = function(arr, arrObj) {

   //console.log(arr);
   //console.log(arrObj);

   var comp1, comp2;
   for(var i=0; i < arr.length; i++){
      comp1 = arr[i];
      for(var j=0; j < arrObj.length; j++){
         comp2 = arrObj[j];
         
         // erro em comparacao, sempre undefined
         /*if(arr[i] === undefined || arrObj[j] === undefined){
            console.log(arr.length);
            console.log(arr);
            console.log(arrObj[j].getState().length);
            console.log(arrObj[j]);
            console.log("Must be != undefined"); 
         }*/

         //if( comp1 != undefined && comp2 != undefined){
            if(this.testEqualState(comp1,comp2.getState())){
               /*console.log("Sao iguais");
               console.log(comp1);
               console.log(comp2.getState());
               console.log("");*/
               delete arr[i];
            } 
         //}
      }
   }
   
   // removes 'undefined' of array
   //console.log(arr);
   arr.clean(undefined);
   //console.log("Depois");
   //console.log("");
   // console.log(arr);
};



/* Tests solvability */

Puzzle.prototype.taxicab = function () {
   var rowsNum = this.ordem - (idx % this.ordem + 1);
   var colNum  = this.ordem - (idx / this.ordem + 1);

   return parseInt(rowsNum + colNum);
}

/* Calculates the number of inversions to classify a given state
 * as solvable or not. An inversion is a pair of tiles (a,b) such
 * that 'a' appears before 'b' but a > b
 * */
Puzzle.prototype.inversions = function(state){
   var len = state.length;
   var totalInv = 0;
   for(var i=0; i < len - 1; i++) {
      var cur = state[i];
      // Nao pode ser o elemento vazio (16)
      if(cur == this.emptyCell)
         continue;
      var inv = 0;
      for(var j=i+1; j < len; j++) {
         if(cur > state[j] && state[j] != this.emptyCell) {
            inv++;   
         }
      }
      totalInv += (inv);
   }

   return totalInv;
}

Puzzle.prototype.getIdxEmpty = function (state) {
   /*return state.forEach(function (value, idx) {
      if(value === this.emptyCell)
         return idx;
   });*/
   for(var i = 0; i < state.length; i++) {
      if(state[i] === this.emptyCell)
         return i;
   }
   return undefined;
}

/* Gets the index of elem on state
 * */
Puzzle.prototype.getIdx = function (elem, state) {
   /*return state.forEach(function (value, idx) {
      if(value === this.emptyCell)
         return idx;
   });*/
   for(var i = 0; i < state.length; i++) {
      if(state[i] === elem)
         return i;
   }
   return undefined;
}

// Determines if current state is a valid state based on the principle
// of invariant defined by Johnson & Story (1879).
// Any valid movement (state) respects the invariant principle
Puzzle.prototype.invariant = function( state ) {
   // var parityPermut = parity();
   // var taxicabDist = taxicab();

   var inversions = this.inversions(state);    

   console.log("Inversions: "+inversions);

   var isGridWidthEven = this.order % 2 === 0;

   var isInversionsEven = inversions % 2 === 0;

   if( !isGridWidthEven ){
      return isGridWidthEven;
   } else {
      var idxZero = this.getIdxEmpty(state);
      var distRowFromBottomIsEven = 
         (this.order - (idxZero / this.order)) % 2 === 0;

      //if( isGridWidthEven && distRowFromBottomIsEven )
      if( distRowFromBottomIsEven )
         return !isInversionsEven;
      else if( isGridWidthEven && !distRowFromBottomIsEven )   
         return isInversionsEven;     
      else
         return false;
   }
}

// Removes the first element of a array
Puzzle.prototype.removesFirst = function (array) {

   // removes CS from SL
   // array.clean(undefined);
   array.splice(0,1);
   // array.clean(undefined);

}

/* Solvers */

// depth-first method
// SL : state list (current path being tried)
// NSL: new state list (nodes awaiting evaluation)
// DE : dead ends, state whose descendants have failed to contain a
// goal node
// CS : current state
Puzzle.prototype.depth1 = function( MAX_ITER ) {

   console.time('depth1');

   if (MAX_ITER == undefined ) 
      throw "MAX_ITER must be defined";

   var numConfig = 0;

   var SL   = [];
   var NSL  = [];
   var DE   = [];
   var CS   = new X(this.state);

   SL.push(CS);
   NSL.push(CS);

   while ( NSL.length > 0 && numConfig < MAX_ITER ){
      if(this.testEndState(CS.getState())) {
         console.timeEnd('depth1');
         console.log("Numero configuracoes: "+numConfig);
         console.log("Numero movimentos: "+CS.getG());
         console.log("Caminho:");
         CS.dump();
         CS.getParent().path();
         return CS.getState();
      }
      
      // tests if current state is solvable to avoid
      // expansion of lost nodes

      var children = this.generateChildren(CS.getState());

      // removes states previously explored
      this.removeXChildren(children,DE);
      this.removeXChildren(children,SL);
      this.removeXChildren(children,NSL);

      // if no children
      if(children.length == 0){
         // empties SL and NSL
         while(SL.length > 0 && this.testEqualState(CS.getState(),
               SL[0].getState())){
            // adds CS to DE
            DE.push(CS);
            
            // removes CS from SL
            this.removesFirst(SL);
            
            // removes CS from NSL
            this.removesFirst(NSL);

            // ERROR: slice of undefined
            /*if(NSL[0] == undefined) {
               console.log(NSL);
               console.log(SL);
               console.log(CS);
            }*/
            // clean undefined
            CS = NSL[0];
         }
         // adds CS to SL
         if(CS != undefined)
            SL.unshift(CS);

      } else {
         for (var i = 0; i < children.length; i++){
            var Xc = new X(children[i]);
            Xc.setParent(CS);

            // add one level to the path
            Xc.setG(CS.getG() + 1);
            NSL.unshift(Xc); 

            // new puzzle's configuration generated
            numConfig++;
         }
         // NSL.unshift(children.slice());
         CS = NSL[0];
         SL.unshift(CS);
      }
   }
   // no solution :(
   return undefined;
};

// Iterative depth-first method
// SL : state list (current path being tried)
// NSL: new state list (nodes awaiting evaluation)
// DE : dead ends, state whose descendants have failed to contain a
// goal node
// CS : current state
Puzzle.prototype.idepth = function( MAX_DEEP ) {

   console.time('idepth');

   var numConfig = 0;

   var DEEPEST_THRESHOLD = 1;

   var SL  = [];
   var NSL = [];
   var DE  = [];
   var CS  = new X(this.state);

   NSL.push(CS);

   while( DEEPEST_THRESHOLD < MAX_DEEP ) {

      console.log(DEEPEST_THRESHOLD);

      SL.push(CS);

      while (NSL.length > 0){

         // if end, returns
         if(this.testEndState(CS.getState())) {
            console.timeEnd('idepth');
            console.log("Numero configuracoes: "+numConfig);
            console.log("Numero movimentos: "+CS.getG());
            console.log("Caminho:");
            CS.dump();
            CS.getParent().path();
            return CS.getState();
         }
       
         var children = []; 

         // generates offsprings only if threshold is respected
         children = this.generateChildren(CS.getState());

         // removes states previously explored
         this.removeXChildren(children,DE);
         this.removeXChildren(children,SL);
         this.removeXChildren(children,NSL);

         // if no children or max depth reached
         if(children.length == 0 || 
               CS.getG() >= parseInt(DEEPEST_THRESHOLD)){

            // empties SL and NSL
            while(SL.length > 0 && this.testEqualState(CS.getState(),
                  SL[0].getState())){
               // adds CS to DE
               DE.push(CS);
               
               // removes CS from SL
               this.removesFirst(SL);
               
               // removes CS from NSL
               this.removesFirst(NSL);

               CS = NSL[0];
            }

            // adds CS to SL
            if(CS != undefined)
               SL.unshift(CS);

         } else {
            for (var i = 0; i < children.length; i++){
               var Xc = new X(children[i]);
               Xc.setParent(CS);

               // add one level to the path
               Xc.setG(CS.getG() + 1);
               // console.log(Xc.getG());

               NSL.unshift(Xc); 

               // new puzzle's configuration generated
               numConfig++;
               // console.log(CS.getG()+" "+Xc.getG()+" "+DEEPEST_THRESHOLD);

            }

            CS = NSL[0];

            SL.unshift(CS);
         }
      }

      // copies frontier inside NSL
      DE.sort(compareG);
      //console.log(DE);
      
      //this.printXArray(DE);

      while( DE[0].getG() == DEEPEST_THRESHOLD ){
         // console.log(DE[i]);
         NSL.push(DE[0]);
         DE.splice(0,1);
         // console.log(DE[i].getG());
      }

      /*console.log("DE");
      this.printXArray(DE);
      console.log("NSL");
      this.printXArray(NSL);
      console.log();*/
      CS = NSL[0];

      // increments the threshold to the next iteration
      DEEPEST_THRESHOLD++;

   }

   // no solution :(
   return undefined;
};


// Breadth-first search
// open: list states that have been generated but whose children
// have not been examined
// closed: list states that have already been examined
Puzzle.prototype.breadth = function () {
   var open  = [];
   var closed = [];
   open.push(this.state.slice());
   
   var X;

   while(open.length > 0){
      // sets the first element as current and remove it from open
      X = open[0].slice();
      open.splice(0,1);
      if(this.testEndState(X)){
         return X;
      } else {
         // generates childs of current state
         var children = this.generateChildren(X);
         // closes the current state
         closed.push(X.slice());
         
         // removes from children states already exploted
         this.removeChildren(children,open);
         this.removeChildren(children,closed);

         // open is a LIFO: unshifts children in it
         this.unshiftArrays (open,children);
         // open.push(children.slice());
      }
   }
   return [];
};

// Iterative deepening depth-first method
// SL : state list (current path being tried)
// NSL: new state list (nodes awaiting evaluation)
// DE : dead ends, state whose descendants have failed to contain a
// goal node
// CS : current state
Puzzle.prototype.depth = function() {
   var SL   = [];
   var NSL  = [];
   var DE   = [];
   var CS   = this.state; //.slice();
   SL.push(CS.slice());
   NSL.push(CS.slice());

   while (NSL.length > 0){
      if(this.testEndState(CS))
         return SL;
      
      // tests if current state is solvable to avoid
      // expansion of lost nodes
      //if( !(this.invariant(CS)) ) {
         var children = this.generateChildren(CS);

         // removes states previously explored
         this.removeChildren(children/*CS*/,DE);
         this.removeChildren(children/*CS*/,SL);
         this.removeChildren(children/*CS*/,NSL);

         /* acompanha interacoes */
         // if no children
         if(children.length == 0){
            // empties SL and NSL
            while(SL.length > 0 && this.testEqualState(CS,SL[0])){
               // adds CS to DE
               DE.push(CS.slice());
               // remove CS from SL
               SL.splice(0,1);
               // remove CS from NSL
               NSL.splice(0,1);
               if(NSL[0] == undefined) {
                  console.log(NSL);
               }
               CS = NSL[0].slice();

            }
            // adds CS to SL
            SL.unshift(CS.slice());
         } else {
            this.unshiftArrays (NSL, children);
            // explores one child of CS
            CS = NSL[0].slice();
            SL.unshift(CS.slice());
         }

      /*} else {
         // if state is not solvable, it will be discarded
         DE.push(CS.slice());
         // remove CS from SL
         SL.splice(0,1);
         // remove CS from NSL
         NSL.splice(0,1);

         if(NSL.length == 0) {
            console.log("Impossible to solve");
            return undefined;
         }

         CS = NSL[0].slice();
         SL.unshift(CS.slice());
      }*/
   }
   // no solution :(
   return undefined;
};

/* Returns the idx that elem is present in array
 * otherwise, returns undefined. Implemented for open or closed
 * lists that stores objects of type 'X'
 * */
Puzzle.prototype.elemInArray = function(elem, array) {
   for(var i = 0; i < array.length; i++){
      var flag = 0;
      var obj = array[i].getState();
      // impressao
      //array[i].dump();
      //console.log(elem);
      //console.log();
      // console.log("estado: "+obj+" "+elem)
      for(var j = 0; j < elem.length; j++){
         //console.log(obj[j]+" "+elem[j]);
         if(obj[j] != elem[j]){
            flag++;
            break;
         }
      }
      if(flag == 0)
         return i;
   }
   return undefined;
}

/*
 *
 *
 * */
Puzzle.prototype.openOrClosed = function(X, open, closed) {
   var isXInOpen = 0;   
   var isXInClosed = 0;   
   for(var i = 0; i < open.length; i++) {
      if(this.testEqualState(X,open[i])) {
         isXInOpen++;   
         break;
      }
   }

   for(var j = 0; j < open.length; j++) {
      if(this.testEqualState(X,open[j])) {
         isXInClosed++;   
         break;
      }
   }

   if(isXInOpen && isXInClosed){
      return CHILDISINOPENANDCLOSED;
   } else if(isXInOpen){
      return CHILDISINOPEN;
   } else if(isXInClosed){
      return CHILDISINCLOSED;
   } else {
      return CHILDISNOTONOPENORCLOSED;
   }

}

// constructor
function X (state){

   this.state = state;

   this.h = 0;

   this.g = 0;

   this.f = 0;
   
   // initializies parent
   this.ancestor = undefined;
   
   // hash of this.state
   this.hash = 0;
};

X.prototype.setHash = function () {
   var string = "";
   var i;
   for(i = 0; i < this.state.length-1; i++)
      string += (this.state[i]+"-");
   string += (this.state[i]);

   this.hash = crypto.createHash("sha1").
         update(string).
         digest('base64');
}

X.prototype.getHash = function () {
   return this.hash;
}

/* Stores the reference to the ancestor
 * */
X.prototype.setParent = function (ancestor) {
   /*if(ancestor == undefined) {
      throw "Ancestor is undefined";
   }*/
   this.ancestor = ancestor; //.slice();
}

X.prototype.getParent = function () {
   return this.ancestor;
}

X.prototype.getState = function () {
   if(this.state == undefined){
      throw "Undefined state\n";
   }
   return this.state;
}

X.prototype.getValue = function () {
   return this.value;
}

X.prototype.setG = function (g) {
   this.g = g;
}

X.prototype.getG = function () {
   return this.g;
}

X.prototype.setH = function (h) {
   this.h = h;
}

X.prototype.getH = function () {
   return this.h;
}

X.prototype.setF = function () {
   this.f = this.g + this.h;
}

X.prototype.getF = function () {
   return this.f;
}

// Tiles out of place
X.prototype.heuristicEval1 = function (){
   var value = 0;
   for(var i = 1; i <= this.state.length; i++){
      if(this.state[i-1] != i) {
         value++;
      }
   }
   return value;
}

// Sum of distances out of place
// Manhattan distance
X.prototype.heuristicEval2 = function (goal){
   var sum = 0;
   var order = Math.sqrt(goal.length);
   // compares each element place with its goal place
   for(var i = 0; i < this.state.length; i++){
      // Ignores " " element; " " is represented by length
      // if(this.state[i] == this.state.length) { continue; }
      var j = 0;
      // finds the desired position of the value
      while(goal[j] != this.state[i]) { j++; }
      var row1 = parseInt(i/order);
      var row2 = parseInt(j/order);
      var col1 = parseInt(i%order);
      var col2 = parseInt(j%order);
      // if both in the same line
      /*if((j-i) < order) {
         sum += (j-i);
      } else {
         // sums the horizontal and vertical displacement
         sum += (parseInt(j%order-i)+parseInt(j/order));
      }*/
      sum += (Math.abs(row2-row1) + Math.abs(col2-col1));
   }

   //this.dump();
   // console.log(sum);
   //console.log("fim");

   return sum;
}

/* Returns a new obj with the same type of
 * the caller
 * */
X.prototype.clone = function () {
   var obj = new X(this.getState());
   obj.setG(this.getG());
   obj.setH(this.getH());
   obj.setF();
   // obj.setHash(); 
   obj.setParent(this.getParent());

   return obj;
}

function compare(X1,X2) {
   if(X1.getF() == X2.getF())
      return X2.getG() - X1.getG();
   else
      return X1.getF() - X2.getF();
}

// sorting based on the biggest G value
function compareG(X1,X2) {
   return X2.getG() - X1.getG();
}

// TODO
Puzzle.prototype.distanceFrom = function (X,Y) {
   for (var i = 0; i < X.length; i++){}
}

Puzzle.prototype.aStar = function() {

   var open    = [];
   var closed  = [];

   open.push(new X(this.state));
   open[0].setH(open[0].heuristicEval2(this.goal));
   open[0].setF();
   
   while (open.length > 0) {
      // remove from OPEN the smallest X node
      var Q = open[0].clone();
      open.splice(0,1);
      open.clean(undefined);

      if(this.testEndState(Q.getState()))
         return Q.getState();
      // add Q on closed list
      closed.push(Q);

      var children = this.generateChildren(Q.getState());

      for(var i = 0; i < children.length; i++) {
         // captures the indexes containing the elements on open and
         // closed
         var idxOnOpen   = this.elemInArray(children[i], open);
         var idxOnClosed = this.elemInArray(children[i], closed);
            
         //case CHILDISNOTONOPENORCLOSED:
         /*if( idxOnOpen == undefined && idxOnClosed == undefined ) {
            var Xc = new X(children[i]);
            
            // evaluates X heuristic function: g
            Xc.setG(X.getG()+1);
            Xc.setH(Xc.heuristicEval1());
            Xc.setF();

            Xc.setParent(X);
            open.unshift(Xc);
         // case CHILDISINOPEN:
         } else if( idxOnOpen ) { 
            if(open[idxOnOpen].getValue() > Xc.getValue()){
               open[idxOnOpen].setParent(Xc.getParent());

               open[idxOnOpen].setG(Xc.getG());
               open[idxOnOpen].setH(Xc.getH());
               open[idxOnOpen].setF();
            }
         // case CHILDISONCLOSED:
         } else if( idxOnClosed ) {
            closed[idxOnClosed].splice(idxOnClosed,1);
            closed.clean(undefined);
            open.unshift(Xc);
         }
         closed.push(X);
         // priority-queue
         open.sort(compare);*/

         var Xc = new X(children[i]);
         
         // evaluates X heuristic function: g
         Xc.setG(Q.getG()+1);
         Xc.setH(Xc.heuristicEval2(this.goal));
         Xc.setF();
         // console.log(Xc.getState()+" "+Xc.getF());

         //if(idxOnOpen && !(open[idxOnOpen].getF() < Xc.getF())){
         if(idxOnClosed == undefined){
            if(idxOnOpen == undefined){
               open.push(Xc);
            } else {
               if(open[idxOnOpen].getF() > Xc.getF()) {
                  open[idxOnOpen].setG(Xc.getG());
                  open[idxOnOpen].setH(Xc.getH());
                  open[idxOnOpen].setF();
               }
            }
         }
      }

      // priority-queue
      open.sort(compare);
      // console.log(open[0].getState()+open[1].getState()+open[2].getState());
   }
   // no solution
   return undefined;
}

X.prototype.dump = function() {
   var who = this.state;

   var order = Math.sqrt(who.length);
   var elem, blank;
   blank = Math.pow(order,2);

   for(var i=0; i < order; i++){
      var string = "|\t";
      for(var j=0; j < order; j++){
         elem = who[i*order+j];
         if (elem === blank)
            elem = " ";
         string += ("\t"+elem+"\t");
      }
      console.log(string+"\t|");
   }
   // line separator
   console.log("");
}

X.prototype.path = function() {
   //console.log(this.getState());
   this.dump();
   if(this.ancestor == undefined){
      return;   
   } else {
      this.ancestor.path();
   }
}

Puzzle.prototype.aStar1 = function() {
   console.time('astar1');

   var open    = [];
   var closed  = [];
   var numConfig = 0;

   open.push(new X(this.state));
   open[0].setH(open[0].heuristicEval2(this.goal));
   open[0].setF();
   
   while (open.length > 0) {
      // remove from OPEN the smallest X node
      var Q = open[0].clone();
      open.splice(0,1);
      open.clean(undefined);

      if(this.testEndState(Q.getState())) {
         console.timeEnd('astar1');
         console.log("Numero configuracoes: "+numConfig);
         console.log("Numero movimentos: "+Q.getG());
         console.log("Caminho:");
         Q.dump();
         Q.getParent().path();
         return Q.getState();
      }

      var children = this.generateChildren(Q.getState());

      for(var i = 0; i < children.length; i++) {
         // captures the indexes containing the elements on open and
         // closed
         var idxOnOpen   = this.elemInArray(children[i], open);
         var idxOnClosed = this.elemInArray(children[i], closed);
            
         var Xc = new X(children[i]);
         
         // evaluates X heuristic function: g
         Xc.setG(Q.getG()+1);
         Xc.setH(Xc.heuristicEval2(this.goal));
         Xc.setF();
         Xc.setParent(Q);

         if(idxOnOpen != undefined) {
            if(open[idxOnOpen].getG() <= Xc.getG()) { continue; }
            else {
               open[idxOnOpen].setG(Xc.getG());
               open[idxOnOpen].setH(Xc.getH());
               open[idxOnOpen].setF();
               open[idxOnOpen].setParent(Xc.getParent());
            }
         } else if(idxOnClosed != undefined) {
            if(closed[idxOnClosed].getG() <= Xc.getG()) { continue; }
            //open.push(Xc);

            //closed.splice(idxOnClosed,1);
            //closed.clean(undefined);
         } else {
            // num of different puzzle's configurations generated
            // It does not includes already open or closed instances
            numConfig++;
            open.push(Xc);
         }
      }
      // add Q on closed list
      closed.push(Q);
      // priority-queue
      open.sort(compare);
   }
   // no solution
   return undefined;
}

Puzzle.prototype.printXArray = function ( array ) {
   for(var i = 0; i < array.length; i++) {
      array[i].dump();
      console.log(array[i].getG()+" "+array[i].getH()+" "+array[i].getF());
   }
   console.log();
}

/* Best-first: Artificial Intelligence George F luger
 * */
Puzzle.prototype.aStar2 = function() {
   console.time('astar2');

   var open    = [];
   var closed  = [];
   var numConfig = 0;
   var key = 0;
  
   var start = new X(this.state); 
   start.setH(start.heuristicEval2(this.goal));
   start.setF();
   // start.setHash();

   // undefined parent
   open.push(start);
   
   while (open.length > 0) {
      key++;
      console.log(key);
      // remove from OPEN the smallest X node
      var Q = open[0];

      // removes current from open
      open.splice(0,1);
      open.clean(undefined);

      // add Q on closed list
      // console.log("Q: "+Q.getState()+" "+Q.getG()+" "+Q.getF());
      closed.push(Q);

      //console.log(open.length);
      // console.log("antes");
      // this.printXArray(open);
      //console.log(open.length);
      // console.log("depois");
      // this.printXArray(open);
      // console.log("");
      
      //console.time("end");
      var end = this.testEndState(Q.getState());
      //console.timeEnd("end");

      if( end ) {
         console.timeEnd('astar2');
         console.log("Numero configuracoes: "+numConfig);
         console.log("Numero movimentos: "+Q.getG());
         console.log("Caminho:");
         Q.dump();
         Q.getParent().path();
         return Q.getState();
      }

      var children = this.generateChildren(Q.getState());

      for(var i = 0; i < children.length; i++) {
         // captures the indexes containing the elements on open and
         // closed
         // console.time("openOrClosed");
         var idxOnOpen   = this.elemInArray(children[i], open);
         var idxOnClosed = this.elemInArray(children[i], closed);
         // console.timeEnd("openOrClosed");

         var Xc = new X(children[i]);

         /*console.log("pai");
         Q.dump(); 
         console.log("filho");
         Xc.dump();*/

         // evaluates heuristic function: h
         Xc.setG(Q.getG() + 1);
         Xc.setH(Xc.heuristicEval2(this.goal));
         Xc.setF();
         // Xc.setHash();
         Xc.setParent(Q);

         // console.log(idxOnOpen+":"+open.length+" "+idxOnClosed+":"+closed.length);

         /*if(idxOnOpen != undefined && idxOnClosed != undefined) {
            throw "Uai";
         }*/

         if(idxOnOpen == undefined && idxOnClosed == undefined) {

            // num of different puzzle's configurations generated
            // It does not include already open or closed instances
            numConfig++;
            //console.log(numConfig);
            open.push(Xc);
            // console.log("pushing: "+Xc.getG());
         } else if(idxOnOpen != undefined) {
            // console.log("ja estao em open");
            if(open[idxOnOpen].getG() > Xc.getG()) {
               open[idxOnOpen].setG(Xc.getG());
               open[idxOnOpen].setH(Xc.getH());
               open[idxOnOpen].setF();
               // open[idxOnOpen].setHash();
               open[idxOnOpen].setParent(Xc.getParent());
            }
         } // else if(idxOnClosed != undefined) {
            // console.log("ja esta em closed");
            // closed[idxOnClosed].dump();
            // console.log(children[i]);*/
            // if(closed[idxOnClosed].getG() > Xc.getG()) {
            //   open.push(Xc);
            //   closed.splice(idxOnClosed,1);
            //   closed.clean(undefined);
            // }
         // } 
      }

      // priority-queue
      // console.time('sort');
      open.sort(compare);
      //console.log("open sorted");
      // this.printXArray(open);
      // console.log("closed sorted");
      //this.printXArray(closed);
      //console.log("");
      // console.timeEnd('sort');
   }
   // no solution
   return undefined;
}

// Breadth-first search
// open: list states that have been generated but whose children
// have not been examined
// closed: list states that have already been examined
Puzzle.prototype.breadth1 = function () {

   console.time('breadth1');

   var numConfig = 0;
   
   var open    = [];
   var closed  = [];

   var start = new X(this.state);

   open.push(start);

   var Q;

   while(open.length > 0){
      // sets the first element as current and remove it from open
      Q = open[0];
      console.log(Q.getG());

      // removes the first element
      open.splice(0,1);

      if(this.testEndState(Q.getState())){

         console.timeEnd('breadth1');
         console.log("Numero configuracoes: " + numConfig);
         console.log("Numero movimentos: " + Q.getG());
         console.log("Caminho:");
         Q.dump();
         Q.getParent().path();
         return Q.getState();

      } else {
         // generates childs of current state
         var children = this.generateChildren(Q.getState());

         // closes the current state
         closed.push(Q);
         
         // removes from children states already exploted
         this.removeXChildren(children,open);
         this.removeXChildren(children,closed);

         // open is a FIFO: unshifts children in it
         //this.unshiftXArrays (open,children,Q);
         this.pushXArrays (open,children,Q);
         numConfig += children.length;
      }
   }
   return [];
};

module.exports.Puzzle = Puzzle;
module.exports.X = X;
