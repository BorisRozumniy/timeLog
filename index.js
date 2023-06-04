var fs = require('fs');

const pathToFile = process.argv[2]
console.log('pathToFile:', pathToFile, typeof pathToFile);

function readWriteAsync() {
  fs.readFile(pathToFile, 'utf-8', function(err, data){
    if (err) throw err;
			
		console.log('data', data)

    var newValue = data.replace('<-- [2000-08-12 07:00][2000-08-12 08:00] -->', 'myString');

		console.log('newValue', newValue);
    fs.writeFile(pathToFile, newValue, 'utf-8', function (err) {
      if (err) throw err;
      console.log('filelistAsync complete');
    });
  });
}

// function readWriteSync() {
//   var data = fs.readFileSync('filelist.txt', 'utf-8');

//   var newValue = data.replace(/^\./gim, 'myString');

//   fs.writeFileSync('filelistSync.txt', newValue, 'utf-8');

//   console.log('readFileSync complete');
// }

readWriteAsync();
// readWriteSync();
