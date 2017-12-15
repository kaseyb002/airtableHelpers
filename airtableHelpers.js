'use strict'

var findRecords = function(base, 
                           tableName, 
                           filterFormula, 
                           eachCallback) {
  
  base(tableName).select({
		view: "Grid view",
		filterByFormula: filterFormula
	}).eachPage(function page(records, fetchNextPage) {

		records.forEach(function(record) {
      eachCallback(record));
    });

		fetchNextPage();

	}, function done(err) {
    
		if (err) { 
      console.log('Error in findRecords');
      console.error(err); 
      return;
    }
  });
};

var checkIfExistsWithFormula = function(targetBase, 
                                        targetTableName, 
                                        filterFormula, 
                                        foundCallback, 
                                        notFoundCallback) {

  targetBase(targetTableName).select({
    view: "Grid view",
    maxRecords: 1,
    filterByFormula: filterFormula
  }).firstPage(function(err, records) {

    if (err) { 
      console.log('Error in checkIfExistsWithFormula');
      console.error(err); 
      return; 
    }

    //if not found, need to send it over to the target base
    if (records.length == 0) { notFoundCallback(); return; }
    
    //record found, need to update it as transferred over
    records.forEach(function(foundRecord) {
      console.log(foundRecord.getId() + " exists in the target table.");
      foundCallback(foundRecord);
    });

  });

};

var sendToBase = function(record, 
                          base, 
                          tableName, 
                          newRecordData, 
                          callback) {

  base(tableName).create(newRecordData(record), function(err, newRecord) {
      if (err) { console.error(err); return; }
      console.log("Created " + record.getId() + " in target base.");
      callback(newRecord);
  });

};

var createNewFromJson = function(base, 
                                 tableName, 
                                 json, 
                                 callback) {

  base(tableName).create(json, function(err, newRecord) {
      if (err) { 
        console.log("error in createNewFromJson");
        console.error(err); 
        return; 
      }
      console.log("Created " + newRecord.getId() + " in target base.");
      callback(newRecord);
  });

};

var updateRecordWithJson = function(base, 
                                    tableName, 
                                    record, 
                                    json) {

  targetBase(targetTableName).update(record.getId(), json, function(err, record) {
      if (err) { console.error(err); return; }
      console.log(record.getId() + " has been updated with json data.");
  });

};

var countRecords = function(base, 
                            tableName, 
                            filterFormula, 
                            callback) {
  var count = 0;

  base(tableName).select({
    view: "Grid view",
    filterByFormula: filterFormula
  }).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
      count += 1;
    });

    fetchNextPage();

  }, function done(err) {
      if (err) { console.error(err); return; }
      callback(count);
  });

};

var sumIntField = function(base, 
                           tableName, 
                           filterFormula, 
                           intFieldName, 
                           callback) {
  var count = 0;

  base(tableName).select({
    view: "Grid view",
    filterByFormula: filterFormula
  }).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
      if (parseInt(record.get(intFieldName))) {
        count += parseInt(record.get(fieldName));
      } else {
        console.log(intFieldName + " field name not found.");
      }
    });

    fetchNextPage();

  }, function done(err) {
      if (err) { console.error(err); return; }
      callback(count);
  });

};

module.exports.sumIntField = sumIntField;
module.exports.countRecords =  countRecords;
module.exports.updateRecordWithJson = updateRecordWithJson;
module.exports.findRecords = findRecords;
module.exports.checkIfExistsWithFormula = checkIfExistsWithFormula;
module.exports.sendToBase = sendToBase;
module.exports.createNewFromJson = createNewFromJson;
