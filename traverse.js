const util = require('util');

const compose = (f1, f2) => {
  return (value) => f1(f2(value));
}

const typeFactory = {
  "object": () => ({ type:"Object", properties:{} }),
  "array": () => ({ type:"Array", items:{} }),
  "string": () => ({ type:"String" }),
  "number": () => ({ type:"Number" }),
  "null": () => ({ type: "Null" })
}

const makeType = (type) => typeFactory[type]();

const determineTypeOf = (item) => {
  let type = typeof item;
  
  // handle null and [] typed as Object
  if(item === null) type = "null";
  if(Array.isArray(item)) type = "array"
  
  return type;
}

const typify = compose(makeType, determineTypeOf);

const bfTraversal = (element) => {
  let root = typify({});

  let queue = [];
  // [propName, value, parentType]
  queue.push(["root", element, root]);

  while(queue.length > 0){
    let elementTriple = queue.pop();
    console.log("pop", elementTriple);
    let value = elementTriple[1];
    let propName = elementTriple[0];
    let parentType = elementTriple[2];
    console.log(elementTriple, value);
    let elementType = typify(value);
    if(parentType.type === "Object"){
      parentType.properties[propName] = elementType;
    }else if(parentType.type === "Array"){
      parentType.items = elementType;
    }
    
    if(elementType.type === "Object"){
      for(p in elementTriple[1]){
        console.log("push", "prop:", p, "value:", value[p],"parent:", elementType);
        queue.push([p, value[p], elementType]);
      } 
    }

    if(elementType.type == "Array"){
      console.log("array push", "prop:", "0", "value:", value[0], "Parent:", elementType);
      queue.push(["0", value[0], elementType]);
    }
  }

  return root;
}

let test = {
  foobar: {
    abc:48.6,
    dd:[{iam:"happy"}],
    foobar:{"thing":42 }
  },
  pipo:{
    bcd: 38
  }
};

let test2 = [2, 3];

let target = test;

console.log("result", JSON.stringify(bfTraversal(target), null, 2));
console.log("value", JSON.stringify(target, null, 2));