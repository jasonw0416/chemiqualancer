var matrix = [[2, 0, -1, 0, 0], [0, 2, -2, -1, 0], [6, 0, 0, -2, 0], [0, 0, 0, 0, 0]];

console.log(process_matrix_to_coefficients(4, 5));
//console.log(fractioniseMatrix());

function createFraction(numerator, denominator){
    return [numerator, denominator];
}

function reduceFraction(frac){
    return [frac[0] / gcd(frac[0], frac[1]), frac[1] / gcd(frac[0], frac[1])]
}
function fractionAdd(num1, num2){
    return reduceFraction([(num1[0] * lcm(num1[1], num2[1])/num1[1]) + (num2[0] * lcm(num1[1], num2[1])/num2[1]), lcm(num1[1], num2[1])]);
}
function fractionSubtract(num1, num2){
    return reduceFraction([(num1[0] * lcm(num1[1], num2[1])/num1[1]) - (num2[0] * lcm(num1[1], num2[1])/num2[1]), lcm(num1[1], num2[1])]);
}
function fractionMultiply(num1, num2) {
    return reduceFraction([num1[0] * num2[0], num1[1] * num2[1]]);
}
function fractionInverse(num1) {
    return [num1[1], num1[0]];
}
function fractionDivide(num1, num2) {
    return fractionMultiply(num1, fractionInverse(num2));

}

function rref(rows, columns) {
    var pivot = 0;
    for (r = 0; r < rows; ++r) {

        var i = r;
        while (matrix[i][pivot][0] === 0) {
            if (columns <= pivot)
                return;
            ++i;
            if (rows === i) {
                i = r;
                ++pivot;
                if (columns === pivot)
                    return;

            }
        }
        for (k = 0; k < columns; ++k) {
            var temp = matrix[i][k];
            matrix[i][k] = matrix[r][k];
            matrix[r][k] = temp;
        }

        var val = matrix[r][pivot];

        for (j = 0; j < columns; ++j){
            matrix[r][j] = fractionDivide(matrix[r][j], val);
        }

        for (i = 0; i < rows; ++i) {
            if (i !== r) {
                val = matrix[i][pivot];
                for (j = 0; j < columns; ++j){
                    matrix[i][j] = fractionSubtract(matrix[i][j], fractionMultiply(val, matrix[r][j]));
                    //matrix[i][j] -= val * matrix[r][j];
                }
            }
        }
        pivot++;
    }
}


function reformat_matrix(rows, columns){ //formats -0 to 0
    for (i = 0; i < rows; ++i){
        for(j = 0; j < columns; j++){
            if(matrix[i][j][0] === -0){
                matrix[i][j] = createFraction(0, 1);
            }
        }
    }

}

function gcd(a, b){ //finds gcd via Euclidean Algorithm
    if (!b) {
        return a;
    }
    else {
        return gcd(b, a % b);
    }
}

function decimal_to_fraction(decimal){
    var integral_part = Math.floor(decimal);
    var fractional_part = decimal - integral_part;

    const precision = 10000000; // Accuracy.

    var big_gcd = gcd(Math.round(fractional_part * precision), precision);

    var denominator = precision / big_gcd;
    var numerator = (Math.round(fractional_part * precision) / big_gcd) + (integral_part * denominator);
    return [numerator, denominator];
}

function lcm(a, b) {//a * b = lcm(a, b) * gcd (a, b)
    return (a * b)/gcd(a, b);
}

function find_free_variables(rows, columns){//creates a boolean list that states if a variable is a free variable 0 is false 1 is true
    var free_variable_list = [];
    for (j = 0; j < matrix.length; ++j){
        free_variable_list.push(1);
    }
    if(matrix[0][0] === 1){
        free_variable_list[0] = 0;
    }
    for (i = 1; i < columns; ++i){
        for(j = 0; j < rows; ++j){
            if(matrix[j][i] === 1){
                var isPivot = 1;
                for (z = i - 1; z >= 0; z--){
                    if(matrix[j][z] !== 0){
                        isPivot = 0;
                    }
                }
                if(isPivot === 1){
                    free_variable_list[i] = 0;
                    break;
                }
            }
        }
    }
    return free_variable_list;
}


function find_convient_lcm_for_free_variables(rows, columns){
    var list_of_numbers = [];
    for (i = 0; i < rows; ++i){
        for (j = 0; j < columns; ++j){
            if(matrix[i][j] === 0){
                continue;
            }
            list_of_numbers.push(matrix[i][j]);
        }
    }
    var least_common_denomiator = 1;
    for (k = 0; k < list_of_numbers.length; ++k){
        least_common_denomiator= lcm(list_of_numbers[k], least_common_denomiator); //finds lcm of all numbers in list
    }
    return least_common_denomiator;
}

function convert_matrix_to_integers(rows, columns){
    var list_of_numbers = [];
    for (i = 0; i < rows; ++i){
        for (j = 0; j < columns; ++j){
            list_of_numbers.push(matrix[i][j]);
        }
    }
    var is_all_int = 1;
    for (a = 0; a < list_of_numbers.length; a++){
        if(list_of_numbers[a][1] !== 1){
            is_all_int = 0;
            break;
        }
    }
    if(is_all_int === 1){
        for (i = 0; i < rows; ++i){
            for (j = 0; j < columns; ++j){
                matrix[i][j] = list_of_numbers[i * columns + j][0]; //sets matrix to one of all integers
            }
        }
        return;
    }

    var least_common_denomiator = 1;
    for (k = 0; k < list_of_numbers.length; ++k){
        if(list_of_numbers[k][1] === 0){
            continue;
        }
        least_common_denomiator= lcm(list_of_numbers[k][1], least_common_denomiator); //finds lcm of all numbers in list
    }

    for(l = 0; l < list_of_numbers.length; ++l){
        list_of_numbers[l] = (least_common_denomiator / list_of_numbers[l][1]) * list_of_numbers[l][0]; //converts all numbers in list to integers using lcm
    }
    for (i = 0; i < rows; ++i){
        for (j = 0; j < columns; ++j){
            matrix[i][j] = list_of_numbers[i * columns + j]; //sets matrix to one of all integers
        }
    }


}

function fix_dimension(rows, columns){
    var new_rows = rows;
    while(new_rows !== columns - 1){
        var list = [];
        for (i = 0; i < columns; i++){
            list.push(0);
        }
        matrix.push(list);
        new_rows++;
    }
    return new_rows;
}

function fractioniseMatrix(){
    for (i = 0; i < matrix.length; i++){
        for (j = 0; j < matrix[0].length; j++){
            matrix[i][j] = createFraction(matrix[i][j], 1);
        }
    }
}

function printMatrix(){
    for (i = 0; i < matrix.length; i++){
        for (j = 0; j < matrix[0].length; j++){
            console.log(matrix[i][j] + " ");
        }
        console.log("\n");
    }
}

function assignValuesToFreeVariables(freeVariables, coefficients){

}

function process_matrix_to_coefficients(rows, columns) {//converts the matrix to a list of coefficients corresponding with the order of compounds as they appear.
    var coefficients = [];
    for (j = 0; j < matrix[0].length - 1; ++j){
        coefficients[j] = -1;
    }

    var free_variables = [];
    rows = fix_dimension(rows, columns);
    fractioniseMatrix();
    rref(rows, columns);
    reformat_matrix(rows, columns);
    printMatrix();
    convert_matrix_to_integers(rows, columns);

    free_variables = find_free_variables(rows, columns);
    console.log(free_variables);
    for (i = 0; i < free_variables.length; ++i){
        if(free_variables[i]){
            coefficients[i] = find_convient_lcm_for_free_variables(rows, columns);
        }
        else{
            coefficients[i] = matrix[i][columns - 2];
        }
    }
    for (j = 0; j < coefficients.length; ++j){
        coefficients[j] = Math.abs(coefficients[j]);
    }

    return coefficients;
}