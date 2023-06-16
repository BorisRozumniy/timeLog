import { writeTimeToParent } from './getSpedingTime/computingSpendTime'
// import { createTimeComputedText } from './getSpedingTime/computingSpendTime'

const fs = require('fs');

const pathToFile = process.argv[2]

function readWriteAsync() {
  fs.readFile(pathToFile, 'utf-8', function(err, data){
    if (err) throw err;
			
    // const newValue = createTimeComputedText(data);
    const newValue = writeTimeToParent(data);
    fs.writeFile(pathToFile, newValue, 'utf-8', function (err) {
      if (err) throw err;
      console.log('filelistAsync complete');
    });
  });
}

readWriteAsync();
