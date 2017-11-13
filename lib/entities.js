const { Map, List, Record } = require('immutable');

const prettyPrint = require('./prettyPrint').prettyPrint;

const BaseEntities = {
  MapType: Record({
    type: "Map",
    items: Map()
  }, "MapType"),
  RecordType: Record({
    type: "Record",
    items: Map(),
    descriptiveName: void 0
  }, "RecordType"),
  ListType: Record({
    type: "List",
    items: Map()
  }, 'ListType'),
  NumberType: Record({
    type: "Number"
  }, "NumberType"),
  StringType: Record({
    type: "String"
  }, "StringType"),
  NullType: Record({
    type: "Null"
  }, "NullType"),
  UndefinedType: Record({
    type: "Undefined"
  }, "UndefinedType")
};

const ScalarEntities = {
  GeoPointType: Record({
    type: "GeoPoint",
    items: Map({
      latitude: new BaseEntities.NumberType(),
      longitude: new BaseEntities.NumberType()
    })
  }, 'GeoPointType')
};

let listOfEntity = (entity) => {
  let result = new BaseEntities.ListType();
  return result.set('items', Map({"0": entity}));
};

let p = listOfEntity(new ScalarEntities.GeoPointType());

console.log(p);

console.log(prettyPrint(p));