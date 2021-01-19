var equation = "NaOH + H2SO4 -> Na2SO4 + H2O";

var list = [];
var reactant_check = true;
var reactant = [];
var product = [];
var atoms = [];
var matrix = [];

balance();

function balance(){ // balance; basically main()
    //equation = document.getElementById("balancer").value;
    init();
    createLists();
    createMatrix();

    console.log(matrix);

    rows = matrix.length;
    columns = matrix[0].length;
    balanced = process_matrix_to_coefficients(rows, columns);
    console.log(balanced);
    //document.getElementById("balancer").value = balanced;

}

function init(){ // set initial values before running
    reactant_check = true;
    reactant = [];
    product = [];
    atoms = [];
    matrix = [];
    list = equation.split(" ");

}

function createLists(){ // create lists of reactant and product

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


function createMatrix(){ // create matrix used for calculating coefficients
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

function splitElements(myList, reactant){ // split elements for easier reading
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

function validateInt(char) { // validate if the character is int or not
    let regx = new RegExp(/^[0-9]{1}$/g);
    return regx.test(char);
}


function rref(rows, colummns) {
    var pivot = 0;
    for (r = 0; r < rows; ++r) {
        if (columns <= pivot) {
            console.log("Matrix is not solvable");
            return 0;
        }

        var i = r;
        while (matrix[i][pivot] === 0) {
            ++i;
            if (rows === i) {
                i = r;
                ++pivot;
                if (colummns === pivot) {
                    console.log("Matrix is not solvable");
                    return 0;
                }
            }
            //swapping rows
            if (i !== r) {
                for (j = 0; j < colummns; ++j) {
                    swap(i, j, r);//swaps rows
                }
            }

            var val = matrix[r][pivot];
            for (j = 0; j < colummns; ++j)
                matrix[r][j] /= val;

            for (i = 0; i < rows; ++i) {
                if (i !== r) {
                    val = matrix[i][pivot];
                    for (j = 0; j < colummns; ++j)
                        matrix[i][j] -= val * matrix[r][j];
                }
            }
            pivot++;
        }
    }
}

function ref(rows, columns) {
    for (i = 0; i < rows; ++i) {

        if ((matrix[i][i]) !== 1) {
            var temp = matrix[i][i];

            if (temp === 0) {
                continue; // Avoid division by zero
            }

            for (j = 0; j < columns; ++j) {
                matrix[i][j] = ((matrix[i][j]) / temp);
            }
        }

        for (k = i + 1; k < rows; ++k) {
            var val = matrix[k][i];
            for (l = i; l < columns; ++l) {
                matrix[k][l] = matrix[k][l] - (matrix[i][l] * val);
            }

        }
    }
}

function swap(i, j, r) {
    var temp = matrix[i][j];
    matrix[i][j] = matrix[r][j];
    matrix[r][j] = temp;
}

function reformat_matrix(rows, columns){ //formats -0 to 0
    for (i = 0; i < rows; ++i){
        for(j = 0; j < columns; j++){
            if(matrix[i][j] === -0){
                matrix[i][j] = 0;
            }
        }
    }

}

function gcd(a, b){ //finds gcd via Euclidean Algorithm
    if (a === 0){
        return b;
    }
    else if (b === 0){
        return a;
    }

    if (a < b){
        return gcd(a, b % a);
    }
    else{
        return gcd(b, a % b);
    }
}

function decimal_to_fraction(decimal){
    var integral_part = Math.floor(decimal);
    var fractional_part = decimal - integral_part;

    const precision = 1000000000; // Accuracy.

    var big_gcd = gcd(Math.round(fractional_part * precision), precision);

    var denominator = precision / gcd_;
    var numerator = (Math.round(fractional_part * precision) / big_gcd) + (integral_part * denominator);
    return [numerator, denominator];
}

function lcm(a, b) {//a * b = lcm(a, b) * gcd (a, b)
    return (a * b)/gcd(a, b);
}

function find_free_variables(rows, columns){//creates a boolean list that states if a variable is a free variable 0 is false 1 is true
    var free_variable_list = [];
    var is_all_zero = 1;
    for (i = 0; i < rows; ++i){
        for(j = 0; j < columns; ++j){
            if(matrix[i][j] !== 0){
                is_all_zero = 0;
                break;
            }
            if(is_all_zero === 1 && j === columns - 1){
                free_variable_list.push(1);
            }
            else if(is_all_zero === 0 && j === columns - 1){
                free_variable_list.push(0);
            }

        }
    }
    return free_variable_list;
}


function find_convient_lcm_for_free_variables(rows, columns){
    var list_of_numbers = [];
    for (i = 0; i < rows; ++i){
        for (j = 0; j < columns; ++j){
            list_of_numbers.push(decimal_to_fraction(matrix[i][j])); //converts to a pair (first = numerator, second = denominator)
        }
    }
    var least_common_denomiator = 1;
    for (k = 0; k < list_of_numbers.length; ++l){
        least_common_denomiator= lcm(list_of_numbers[k][1], least_common_denomiator); //finds lcm of all numbers in list
    }
    return least_common_denomiator;
}

function convert_matrix_to_integers(rows, columns){
    var list_of_numbers = [];
    for (i = 0; i < rows; ++i){
        for (j = 0; j < columns; ++j){
            list_of_numbers.push(decimal_to_fraction(matrix[i][j])); //converts to a pair (first = numerator, second = denominator)
        }
    }

    var least_common_denomiator = find_convient_lcm_for_free_variables(rows, columns);

    for(l = 0; l < list_of_numbers.length; ++l){
        list_of_numbers[l] = (least_common_denomiator / list_of_numbers[l][1]) * list_of_numbers[l][0]; //converts all numbers in list to integers using lcm
    }
    for (i = 0; i < rows; ++i){
        for (j = 0; j < columns; ++j){
            matrix[i][j] = list_of_numbers[i * columns + j]; //sets matrix to one of all integers
        }
    }


}

function process_matrix_to_coefficients(rows, columns) {//converts the matrix to a list of coefficients corresponding with the order of compounds as they appear.
    var coefficients = [];
    for (j = 0; j < matrix[0].length - 1; ++j){
        coefficients[j] = -1;
    }

    var free_variables = [];
    ref(rows, columns);
    reformat_matrix(rows, columns);
    free_variables = find_free_variables(rows, columns);
    console.log(matrix);
    console.log(free_variables);
    for (i = 0; i < free_variables.length; ++i){
        if(free_variables[i]){
            coefficients[i] = find_convient_lcm_for_free_variables(rows, columns);
        }
        else{
            coefficients[i] = matrix[i][columns-2];
        }
    }
    return coefficients;
}
