//Crea las casillas, pero sin un label, todo es sin salto de linea,
//por ende no hay texto tachado con las tareas completadas 
//y, a£n no pueden crearse con tareas con texto y borrarse tareas

const input = document.getElementById("txt-title-task");
let i = 1;

function handleClick(event){
    let box = document.getElementById("btn-add-task");
    
    if (box === null) return;
        
    box = document.createElement("input");
    box.id = "box" + i;
    box.type = "checkbox";
    //box.onclick = "handleClick_Double(event)";
    const lbl = document.createElement("label");
    lbl.id = "label" + i;
    lbl.textContent = input.value + "   ";

    const btn_nuevo = document.createElement("button");
    btn_nuevo.id = "btn_nuevo" + i;
    btn_nuevo.textContent = "Remove";

    const salto = document.createElement("br");

    document.body.appendChild(box);
    document.body.appendChild(lbl);
    document.body.appendChild(btn_nuevo);
    document.body.appendChild(salto);

    i++;

}