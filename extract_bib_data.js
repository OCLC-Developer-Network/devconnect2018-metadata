const fs = require('fs');
const stringify = require('csv-stringify');
const marc4js = require('marc4js');
const S = require('string');

fs.readFile('sample_csvs/sample_bibs.xml', function(err, data) {
    marc4js.parse(data, {fromFormat: 'marcxml'}, function(err, records) {
    	// get out the oclc numbers
    	let oclcNumbers = [];
    	
    	records.forEach(function (record){
    		let oclc_number = record.controlFields.filter(controlField => controlField.tag === '001')[0].data;
    		let title = record.dataFields.filter(dataField => S(dataField.tag).startsWith('24'))[0].findSubfield('a').data;
    		if (record.dataFields.filter(dataField => S(dataField.tag).startsWith('24'))[0].findSubfield('b')){
    			title += record.dataFields.filter(dataField => S(dataField.tag).startsWith('24'))[0].findSubfield('b').data;
    		}
    		title = S(title).chompRight(" /").s;
    		let isbns = [];
    		
    		let isbn_nodes = record.dataFields.filter(dataField => dataField.tag === '020');
    		isbn_nodes.filter(isbn_node => isbn_node.findSubfield('a'));
    		
    		isbn_nodes.forEach(function(isbn_node){
    			isbns.push(isbn_node.findSubfield('a').data)
    		})
    		
		oclcNumbers.push({
    			oclc_number: oclc_number,
    			title: title,
    			isbns: isbns.join()
    		});
  	  })
    	
    	let columns = {
    			oclc_number: "OCLC Number",
    			title: "Title",
    			isbns: "ISBNs"
    	}

    	// write it back to a file
    	  stringify(oclcNumbers, {header: true, columns: columns}, function(err, output){
    		  fs.writeFile(require('path').resolve(__dirname, './oclc_numbers.csv'), output, (error) => {
	    	  if (error) {
	    		  console.log("file write failed")
	    	  } else {
	    		  console.log("file saved")
	    		  }
	    	  })
    	  });
    });
});