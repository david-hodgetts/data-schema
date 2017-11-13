const { Map, List, Record } = require('immutable');

const SchemaEntities = {
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

const JsTypeDetectors = {
  isNumber : (v) => typeof v === 'number',
  isString : (v) => typeof v === 'string',
  isNull : (v) => v === null,
  isUndefined: (v) => v === void 0
};

const EntityExtractors = {
  MapType: Map.isMap,
  RecordType: Record.isRecord,
  ListType: List.isList,
  NumberType: JsTypeDetectors.isNumber,
  StringType: JsTypeDetectors.isString,
  NullType: JsTypeDetectors.isNull,
  UndefinedType: JsTypeDetectors.isUndefined
};

function valueToSchemaEntity(value){
  let result = null;
  for(let t in EntityExtractors){
    if(EntityExtractors[t](value)){
      result = new SchemaEntities[t]();
      // TODO: this is messy refactor
      if(result.get("type") === "Record"){
        result = result.set('descriptiveName', Record.getDescriptiveName(value));
      }
    }
  }
  return result;
}

// returns a tree of SchemaEntities describing the structure of argument value.
// Maps and Records are fully traversed
// Lists however are only inspected for the first element.
// traversal is breadth first. Cycle detection is not implemented
// traversal assumes that no vanilla js collections are present (objects or arrays)
function buildSchema(value){
  
  let root = new SchemaEntities.MapType();

  const queue = [];
  // [propName, value, path for insertion in root]
  queue.push(["root", value, []]);

  const isMapOrRecordType = (entityType) => entityType.get('type') === 'Map' ||
                                            entityType.get('type') === 'Record';

  while(queue.length > 0){
    let elementTriple = queue.pop();
    [propName, value, path] = elementTriple;
    
    // console.log("val", value, ",propName", propName, ",path", path); 
    let entity = valueToSchemaEntity(value);

    // attach new entity to schema tree
    // update path
    path = path.concat(['items', propName]);
    root = root.setIn(path, entity);
    if(isMapOrRecordType(entity)){
      const entries = entity.get('type') === 'Record' ? Map(value).entries() : value.entries(); 
      for([p, v] of entries){
        // console.log("push", "prop:", p, "value:", v,"path:", path);
        queue.push([p, v, path]);
      } 
    }else if(entity.get('type') === "List" && value.size > 0){
      // console.log("array push", "prop:", "0", "value:", value.first(), "path:", path);
      queue.push(["0", value.first(), path]);
    }
  }

  return root.getIn(['items', 'root']);
}

module.exports = {
  buildSchema: buildSchema
};