# Airtable Helpers

Just a couple handy functions to supplement the Airtable API. 

Helpful for working with records in separate bases.

## How to use
```javascript
//get your airtable base
var Airtable = require('airtable');
var airtableInstance = new Airtable({apiKey: 'YOUR_API_KEY'}).
var base = airtableInstance.base('YOUR_BASE_ID');

var airtableHelper = require('./airtableHelpers.js');

//this will print out all the comments made by males
airtableHelper.findRecords(base, //base to search
				   		   "Comments", //table name
				    	   "Gender = \'Male\'", //filter formula 
				   		   function(record) { //callback for each record found
	console.log("Male comment: " + record.get('Comment'));
});
```



```javascript
//this will transfer all the comments made by males to the male comments base
var maleCommentBase = airtableInstance.base('MALE_COMMENTS_BASE_ID');

var newRecordData = function(record) {
	return {
		"Name": record.get("Name"),
		"Comment": record.get('Comment'),
		"original_id": record.getId()
	};
};


airtableHelper.sendToBase(record,
					   	  maleCommentBase, //base you want to send to
					   	  "Comments", //table you want to send to
						  newRecordData, //callback to create json data from record
						  function(newRecord) { //completion callback once record has transferred 
	console.log(newRecord.getId() + " created in base " + maleCommentBase.getId());
});

```


