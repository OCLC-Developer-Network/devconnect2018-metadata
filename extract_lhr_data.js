const fs = require('fs');
const stringify = require('csv-stringify');
const marc4js = require('marc4js');

fs.readFile('sample_csvs/lhrTest.xml', function(err, data) {
    marc4js.parse(data, {fromFormat: 'marcxml'}, function(err, records) {
    	// get out the accession numbers
    	let accessionNumbers = [];
    	
    	records.forEach(function (record){
    		let accession_number = record.controlFields.filter(controlField => controlField.tag === '001')[0].data;
		let oclc_number = record.controlFields.filter(controlField => controlField.tag === '004')[0].data;
		let location = record.dataFields.filter(dataField => dataField.tag === '852')[0];
		let branch = location.findSubfield('b').data;
		let shelfLocation = location.findSubfield('c') ? location.findSubfield('c').data : null
    		
		accessionNumbers.push({
    			accession_number: accession_number,
    			oclc_number: oclc_number,
    			branch: branch,
    			shelfLocation: shelfLocation
    		});
  	  })
    	
    	let columns = {
    			accession_number: "Accession Number",
    			oclc_number: "OCLC Number",
    			branch: "Branch",
    			shelfLocation: "Shelf Location"
    	}

    	// write it back to a file
    	  stringify(accessionNumbers, {header: true, columns: columns}, function(err, output){
    		  fs.writeFile(require('path').resolve(__dirname, './accession_numbers.csv'), output, (error) => {
	    	  if (error) {
	    		  console.log("file write failed")
	    	  } else {
	    		  console.log("file saved")
	    		  }
	    	  })
    	  });
    });
});