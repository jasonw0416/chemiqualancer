var equation = "NaOH + H2SO4 -> Na2SO4 + H2O";

var list = [];
var reactant_check = true;
var reactant = [];
var product = [];
var atoms = [];
var matrix = [];

function balance(){
    equation = document.getElementById("balancer").value;
    init();
    createLists();
    createMatrix();

    console.log(matrix);
    document.getElementById("balancer").value = matrix;

}

function init(){
    reactant_check = true;
    reactant = [];
    product = [];
    atoms = [];
    matrix = [];
    list = equation.split(" ");

}

function createLists(){

    for (i = 0; i < list.length; i++){
        if (list[i] === "->"){
            reactant_check = false;
        }
        else if(list[i] !== "+"){
            if (reactant_check){
                reactant.push(list[i]);
            }
            else{
                product.push(list[i]);
            }
        }
    }

    console.log(reactant);
    console.log(product);

    reactant = splitElements(reactant,true);
    product = splitElements(product,false);

    console.log(reactant);
    console.log(product);

    atoms = [...new Set(atoms)];

    console.log(atoms);

}


function createMatrix(){
    matrix = new Array(atoms.length);
    for (i = 0; i < matrix.length; i++){
        matrix[i] =  new Array(reactant.length+product.length);
    }

    for (i = 0; i < matrix.length; i++){
        for(j = 0; j < reactant.length; j++){
            if (reactant[j].includes(atoms[i] + " ")){
                if (reactant[j].indexOf(atoms[i] + " ") !== 0
                && validateInt(reactant[j].charAt(reactant[j].indexOf(atoms[i] + " ") - 1))){
                    matrix[i][j] = parseInt(reactant[j].charAt(reactant[j].indexOf(atoms[i] + " ") - 1));
                }
                else{
                    matrix[i][j] = 1;
                }
            }
            else{
                matrix[i][j] = 0;
            }
        }
        for (j = 0; j < product.length; j++){
            if (product[j].includes(atoms[i] + " ")){
                if (product[j].indexOf(atoms[i] + " ") !== 0
                    && validateInt(product[j].charAt(product[j].indexOf(atoms[i] + " ") - 1))){
                    matrix[i][j+reactant.length] = -1 * parseInt(product[j].charAt(product[j].indexOf(atoms[i] + " ") - 1));
                }
                else{
                    matrix[i][j+reactant.length] = -1;
                }
            }
            else{
                matrix[i][j+reactant.length] = 0;
            }
        }
    }
}

function splitElements(myList, reactant){
    finalList = [];
    for (i = 0; i < myList.length; i++){
        finalString = "";
        element = myList[i];
        for (j = 0; j < element.length; j++){
            if (element[j] === element[j].toUpperCase()){
                if(j < element.length - 1 && validateInt(element[j+1])){
                    finalString += element[j+1] + element[j] + " ";
                    if (reactant){
                        atoms.push(element[j]);
                    }
                    j++;
                }
                else if (j < element.length - 1 && element[j+1] === element[j+1].toLowerCase()){
                    temp = element[j] + element[j+1];
                    if (reactant){
                        atoms.push(temp);
                    }
                    if (j < element.length - 2 && validateInt(element[j+2])){
                        temp = element[j+2] + temp;
                        j++;
                    }
                    j++;
                    finalString += temp + " ";
                }
                else{
                    finalString += element[j] + " ";
                    if (reactant){
                        atoms.push(element[j]);
                    }
                }
            }
        }
        finalList.push(finalString);
    }
    return finalList;
}

function validateInt(char) {
    let regx = new RegExp(/^[0-9]{1}$/g);
    return regx.test(char);
}
