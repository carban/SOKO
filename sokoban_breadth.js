// SOKOBAN

class node {
  constructor(data, pointer) {
    this.data = data;
    this.pointer = pointer;
  }
}

class statements {
  constructor(agent, boxes, map, rule) {
    this.agent = agent;
    this.boxes = boxes;
    this.map = map;
    this.rule = rule;
  }
}

var solution = null;

//CALCULA LA PERCEPCION DEL AGENTE EN ALGUN ESTADO EN PARTICULAR
function perception(data){

  let pos = data.agent;
  let map = data.map;
  var feeling = [];

  if (pos[0]-1 >= 0 && map[pos[0]-1][pos[1]]!="W") {
    if (map[pos[0]-1][pos[1]]=="B" && (map[pos[0]-2][pos[1]]=="0" || map[pos[0]-2][pos[1]]=="X")) {
      feeling.push("PUSH-UP");
    }else if(map[pos[0]-1][pos[1]]=="0" || map[pos[0]-1][pos[1]]=="X"){
      feeling.push("UP");
    }
  }
  if (pos[0]+1 <= map.length-1 && map[pos[0]+1][pos[1]]!="W") {
    if (map[pos[0]+1][pos[1]]=="B" && (map[pos[0]+2][pos[1]]=="0" || map[pos[0]+2][pos[1]]=="X")) {
      feeling.push("PUSH-DOWN");
    }else if(map[pos[0]+1][pos[1]]=="0" || map[pos[0]+1][pos[1]]=="X"){
      feeling.push("DOWN");
    }
  }
  if (pos[1]-1 >= 0 && map[pos[0]][pos[1]-1]!="W") {
    if (map[pos[0]][pos[1]-1]=="B" && (map[pos[0]][pos[1]-2]=="0" || map[pos[0]][pos[1]-2]=="X")) {
      feeling.push("PUSH-LEFT");
    }else if(map[pos[0]][pos[1]-1]=="0" || map[pos[0]][pos[1]-1]=="X"){
      feeling.push("LEFT");
    }
  }
  if(pos[1]+1 <= map[0].length-1 && map[pos[0]][pos[1]+1]!="W") {
    if (map[pos[0]][pos[1]+1]=="B" && (map[pos[0]][pos[1]+2]=="0" || map[pos[0]][pos[1]+2]=="X")) {
      feeling.push("PUSH-RIGHT");
    }else if(map[pos[0]][pos[1]+1]=="0" || map[pos[0]][pos[1]+1]=="X"){
      feeling.push("RIGHT");
    }
  }

  return feeling;
}

//REALIZA LA ACTUALIZACION DEL ESTADO DADA UNA PERCEPCION
function update(rule, data){

  // copias para que no modifique por referencia
  var mapi = data.map;
  let map = mapi.map(arr => {return arr.slice()});

  let pos = [data.agent[0], data.agent[1]];
  let boxpos = data.boxes.map(arr => {return arr.slice()});

  if (rule=="UP") {
    pos[0]--;
    return new statements(pos, boxpos, map, "UP");
  }
  else if (rule=="RIGHT") {
    pos[1]++;
    return new statements(pos, boxpos, map, "RIGHT");
  }
  else if (rule=="DOWN") {
    pos[0]++;
    return new statements(pos, boxpos, map, "DOWN");
  }
  else if (rule=="LEFT") {
    pos[1]--;
    return new statements(pos, boxpos, map, "LEFT");
  }
  else if (rule=="PUSH-UP") {

    let i = 0;
    for (i = 0; i < boxpos.length; i++) {
      if (boxpos[i][0]==pos[0]-1 && boxpos[i][1]==pos[1]) {
        break;
      }
    }

    pos[0]--;
    map[boxpos[i][0]][boxpos[i][1]] = "0";
    boxpos[i][0]--;
    map[boxpos[i][0]][boxpos[i][1]] = "B";

    return new statements(pos, boxpos, map, "PUSH-UP");

  }else if (rule=="PUSH-RIGHT") {

    let i = 0;
    for (i = 0; i < boxpos.length; i++) {
      if (boxpos[i][1]==pos[1]+1 && boxpos[i][0]==pos[0]) {
        break;
      }
    }

    pos[1]++;
    map[boxpos[i][0]][boxpos[i][1]] = "0";
    boxpos[i][1]++;
    map[boxpos[i][0]][boxpos[i][1]] = "B";

    return new statements(pos, boxpos, map, "PUSH-RIGHT");

  }else if (rule=="PUSH-DOWN") {

    let i = 0;
    for (i = 0; i < boxpos.length; i++) {
      if (boxpos[i][0]==pos[0]+1 && boxpos[i][1]==pos[1]) {
        break;
      }
    }

    pos[0]++;
    map[boxpos[i][0]][boxpos[i][1]] = "0";
    boxpos[i][0]++;
    map[boxpos[i][0]][boxpos[i][1]] = "B";

    return new statements(pos, boxpos, map, "PUSH-DOWN");

  }else if (rule=="PUSH-LEFT") {

    let i = 0;
    for (i = 0; i < boxpos.length; i++) {
      if (boxpos[i][1]==pos[1]-1 && boxpos[i][0]==pos[0]) {
        break;
      }
    }

    pos[1]--;
    map[boxpos[i][0]][boxpos[i][1]] = "0";
    boxpos[i][1]--;
    map[boxpos[i][0]][boxpos[i][1]] = "B";

    return new statements(pos, boxpos, map, "PUSH-LEFT");

  }
  else {
    return new statements(pos, boxpos, map, "FINAL");
  }
}

//VERIFICA QUE LAS POSICIONES DE LAS CAJAS SEAN IGUALES A LA DE LOS OBJETIVOS
function isEqual(boxes, goals){

  let l = boxes.length;
  let c = 0;

  for (var i = 0; i < l; i++) {
    for (var j = 0; j < l; j++) {
      if (boxes[i][0]==goals[j][0] && boxes[i][1]==goals[j][1]) {
        c++;
      }
    }
  }

  if (c==l) {
    return true;
  }else{
    return false;
  }

}

//RETORNA LAS INSTRUCCIONES DE LA RAMA SOLUCION
function getInstructions(){

  var sol = solution;
  var instructions = [];
  while (sol!=null) {
    instructions.unshift(sol.data.rule);
    sol = sol.pointer;
  }
  return instructions;
}

//VERIFICA SI LA POSICION DEL AGENTE Y DE LAS CAJAS YA SE ENCUENTRAN REPETIDOS, SI LO ESTAN RETORNA TRUE
function isRepeat(data, repeats){

  let l = data.boxes.length;
  let c = 0;

  for (var i = 0; i < repeats.length; i++) {
    if (data.agent[0]==repeats[i].agent[0] && data.agent[1]==repeats[i].agent[1]) {
      for (var j = 0; j < l; j++) {
        if (data.boxes[j][0]==repeats[i].boxes[j][0] && data.boxes[j][1]==repeats[i].boxes[j][1]) {
          c++;
        }
      }
      if (c == l) {
        return true;
      }
      c = 0;
    }
  }
  return false;
}

//FUNCION PRINCIPAL
function solver(queue, repeats, goals){

  let present = null;
  let count = 0;

  while (queue.length!=0) {

    present = queue[0]; //primer elemento de la cola
    //console.log(present.data);
    if (isEqual(present.data.boxes, goals)) {
      //console.log("---- SOLVED ----");
      solution = new node(update("TAKE", present.data), present); //Guarda la "rama" solucion
      return count; //Termina el programa porque encontro solucion
    }
     // else if (count==6000) { //Condicion de parada extra
     //   queue.shift();
     //   // count--;
     //  // break;
     // }
    else if (isRepeat(present.data, repeats)) {
      queue.shift();
    }
    else{
      repeats.push(present.data);
      var sense = perception(present.data);
      // console.log(sense);

      // ***************** ORDEN POR AMPLITUD ***************** //
      
      for (var k = 0; k < sense.length; k++) { //Recorre toda las percepciones recibidas
        let value = update(sense[k], present.data); //Actualiza cada posible percepcion
        //Crea un nodo con el valor actualizado y el valor presente como el padre. Lo inserta en la cola
        queue.push(new node(value, present));
      }

      queue.shift(); //Se saca el primer elemento de la cola

      count++;
    }
  }
  //No hubo solucion
  solution = new node(null, null, null, null);
  return count;
}


function main(){

   //**************************
   // PROCESANDO EL ARCHIVO
   const fs = require("fs");

   var input = process.argv; //Recibe los inputs que le lleguen por consola

   var allfile = fs.readFileSync(input[2], 'utf8'); //el input en la posicion 2 corresponde al nombre del archivo
   var splitter = allfile.split("\n");
   var map = [];
   var fileboxes = [];
   splitter.pop();

   for(var i = 0; i < splitter.length; i++){
      if(splitter[i].length!=3){
         map.push(splitter[i].split("")); //Se guardan las filas de la matriz
      }else{
         fileboxes.push(splitter[i].split(",")); //Se guardan las posiciones que vienen despues de la matriz
      }
   }

   var goals = [];

   for(var i = 0; i < map.length; i++){
      for(var j = 0; j < map.length; j++){
         if(map[i][j]=="X"){
            goals.push([i, j]); //Se guardan los objetivos
         }
      }
   }

   for(var i = 0; i < fileboxes.length; i++){
      for(var j = 0; j <= 1; j++){
      fileboxes[i][j] = parseInt(fileboxes[i][j]); //Se parsean de string a entero los valores
      }
   }

   var marvin = fileboxes[0]; //El primero corresponde al del agente
   fileboxes.shift();

   var boxes = fileboxes;

   for(var i = 0; i < boxes.length; i++){
      var x = boxes[i][0];
      var y = boxes[i][1];
      map[x][y] = "B"; //Asigno cada caja en el mapa
   }

   //**************************

   let first_state = new statements(marvin, boxes, map, "FIRST"); //Estado inicial
   let queue = [new node(first_state, null)]; //Primer elemento en la cola
   let repeats = []; //Arreglo del elementos repetidos vacio

   /*console.log("*** SOKOBAN ***");
   console.log("---- INITAL MAP ----");
   console.log(map);
   console.log("Initial posicion: ", marvin);
   console.log("boxes: ", boxes);
   console.log("goals: ", goals);
   console.log("Number of expantions: ",solver(queue, repeats, goals));*/
   solver(queue, repeats, goals);

   var sol = "";   

   if (solution.data==null) {
     console.log("---- NO SOLUTION ----");
   }else{
     let finalRules = getInstructions();
     for (var i = 1; i < finalRules.length; i++) {
       if(finalRules[i]=="UP" || finalRules[i]=="PUSH-UP"){
            sol += "U";
        }else if(finalRules[i]=="DOWN" || finalRules[i]=="PUSH-DOWN"){
            sol += "D";
        }else if(finalRules[i]=="LEFT" || finalRules[i]=="PUSH-LEFT"){
            sol += "L";
        }else if(finalRules[i]=="RIGHT" || finalRules[i]=="PUSH-RIGHT"){
            sol += "R";
        }
     }
   }
   console.log(sol);
}

main();
