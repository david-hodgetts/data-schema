const {Map, Record, Repeat} = require('immutable');

const indentSize = 2;
const space = ' '

const repeatString = (string, count) => Repeat(string, count).toJS().join(''); 

const prettyPrint = (schemaEntity, indentCount) => {
  let result = "";
  const headerStringForCollection = (collEntity, delimiterSigns) => {
    const maybeDescriptiveName = collEntity.get('type') === 'Record' ? ` (${collEntity.get('descriptiveName')})` : '';

    return `${schemaEntity.get('type')}${maybeDescriptiveName} ${delimiterSigns.get('start')}`
  }
  if(schemaEntity.has('items')){
    const collectionDelimiterSigns = schemaEntity.get('type') === 'List' ? Map({start: '[', end: ']'}) : 
                                                                          Map({start: '{', end: '}'});
    if(schemaEntity.get('items').size == 0){
      // return one liner for empty collection
      return `${headerStringForCollection(schemaEntity, collectionDelimiterSigns)} ${collectionDelimiterSigns.get('end')}`;
    }
    result = `${headerStringForCollection(schemaEntity, collectionDelimiterSigns)}\n`;
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

module.exports = {
  prettyPrint: function(schemaEntity){
    return prettyPrint(schemaEntity, 0);
  }
}
