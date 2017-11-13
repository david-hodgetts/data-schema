# data-schema generator

This project aims to provide its users with a means to generate a schema from an Immutable.JS data structure.

The schema is represented with Schema Entity Records (Immutable JS record types).  
All entities have a *type* property.   
Entities representing collections (Map, List, Record for now) have an extra *items* property. This property contains the schema of the collection's children.  
In the case of a List, only the first element is represented.  
Entities representing Records have an extra *descriptiveName* property which contains the Record's descriptive Name.

## usage

To build a schema use the buildSchema function:

```javascript
const { buildSchema, prettyPrint } = require('data-schema');
const { Map, List, Record } = require('immutable');

/////
// define some data structures to traverse
const map = Map({aa:42});
const record = Record({aa:1}, 'MyRecordType')();
const list = List([0, 1, 2, 3]);
const scalar = 42;

/////
// build schemas
let s1 = buildSchema(map);
// MapType { type: "Map", items: Map { "aa": NumberType { type: "Number" } } }

let s2 = buildSchema(record);
// RecordType { type: "Record", items: Map { "aa": NumberType { type: "Number" } }, descriptiveName: "MyRecordType" }

let s3 = buildSchema(list);
// ListType { type: "List", items: Map { "0": NumberType { type: "Number" } } }

let s4 = buildSchema(scalar);
// NumberType { type: "Number"
```

A simple pretty print function is provided to represent the schema in a human readable format.

```javascript
console.log(prettyPrint(s1));
/*
Map {
  "aa": NumberType
}
*/

console.log(prettyPrint(s2));
/*
Record (MyRecordType) {
   "aa": NumberType
}
*/

console.log(prettyPrint(s3));
/*
List [
  "0": NumberType
]
*/

console.log(prettyPrint(s4));
/*
NumberType
*/
```