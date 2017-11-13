const { Map, List, Record } = require('immutable');
const { buildSchema, prettyPrint } = require('data-schema');

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
// NumberType { type: "Number" }


/////
// pretty print the schemas
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