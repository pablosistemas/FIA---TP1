const fs = require('fs');

// class constructor
function experiment (infilename, goalfilename, numElements) {

   this.infilename   = infilename;
   this.goalfilename = goalfilename;
   this.numElements  = numElements;

   var datain = fs.readFileSync( infilename, 'utf-8' );
   var datagoal = fs.readFileSync( goalfilename, 'utf-8' );

   this.casoInicial  = datain.split(" ", numElements);
   this.casoFinal    = datagoal.split(" ", numElements);
   
   var idx = 0;

   for(var i = 0; i < numElements; i++) {
      this.casoInicial[i] = Number(this.casoInicial[i]);
      this.casoFinal[i]   = Number(this.casoFinal[i]);
      // console.log(this.casoInicial[i]+" "+this.casoFinal[i]);
   }
}

module.exports.experiment = experiment;
