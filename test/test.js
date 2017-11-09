const chai = require('chai');
const chaiImmutable = require('chai-immutable');
const { Map, List, Record, isImmutable} = require('immutable') 

const buildSchema = require('../immutable-buildschema').buildSchema;

chai.use(chaiImmutable);
const expect = chai.expect;

describe('buildschema', function() {
  it('returns a record', function() {
    const schema = buildSchema(42);
    expect(Record.isRecord(schema)).to.be.true;
  });
  it('returns a record with a type field', function(){
    const schema = buildSchema(42);
    expect(schema).to.have.property('type'); 
  });
  it('should handle nested maps', function(){
    const value = Map({aa:42, bb:Map({cc:"a_string"})});
    const schema = buildSchema(value);
    const path = ['items', 'bb', 'items', 'cc', 'type'];
    expect(schema.getIn(path)).to.equal('String');
  });
});