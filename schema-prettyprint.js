const { Map, List, Record, isImmutable, Repeat} = require('immutable');

const buildSchema = require('./immutable-buildschema').buildSchema;

const indentSize = 2;
const space = ' '

const repeatString = (string, count) => Repeat(string, count).toJS().join(''); 

const prettyPrint = (schemaEntity, indentCount) => {
  let result = "";
  if(schemaEntity.has('items')){
    const collectionDelimiterSigns = schemaEntity.get('type') === 'List' ? Map({start: '[', end: ']'}) : 
                                                                          Map({start: '{', end: '}'});
    if(schemaEntity.get('items').size == 0){
      // return one liner for empty collection
      return `${schemaEntity.get('type')} ${collectionDelimiterSigns.get('start')}${collectionDelimiterSigns.get('end')}`;
    }
    result = `${schemaEntity.get('type')} ${collectionDelimiterSigns.get('start')}\n`;
    indentCount += indentSize;
    let propContent = "";

    for ([propName, type] of schemaEntity.get('items').entries()) {
      propContent += `${repeatString(space, indentCount)}"${propName}": ${prettyPrint(type, indentCount)}\n`;
    }
    result += propContent;
    indentCount -= indentSize
    result += `${repeatString(space, indentCount)}${collectionDelimiterSigns.get('end')}`;
  }else{
    // this is a leaf type
    return Record.getDescriptiveName(schemaEntity);
  }
  return result;
};

let t = List([List()]);
t = Map({foo:42, bar:List([Map({aa:Map({foo:42})}), 2])});

let s = buildSchema(t);
console.log("value", t);
console.log("schema", s);
console.log(prettyPrint(s, 0));
