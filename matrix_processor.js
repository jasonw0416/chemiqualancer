var matrix = [[ 1, 0, -2, 0, 0 ], [ 1, 4, -4, -1, 0 ], [ 1, 2, 0, -2, 0 ], [ 0, 1, -1, 0, 0 ]];


console.log(process_matrix_to_coefficients(4, 5));




function rref(rows, columns) {
    var pivot = 0;
    for (r = 0; r < rows; ++r) {

        var i = r;
        while (matrix[i][pivot] === 0) {
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
            matrix[r][j] /= val;
        }

        for (i = 0; i < rows; ++i) {
            if (i !== r) {
                val = matrix[i][pivot];
                for (j = 0; j < columns; ++j){
                    matrix[i][j] -= val * matrix[r][j];
                }
            }
        }
        pivot++;
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

    const precision = 1000000000; // Accuracy.

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
        free_variable_list.push(0);
    }
    for (i = 0; i < rows; ++i){
        for(j = 0; j < columns; ++j){
            if(matrix[i][j] !== 0){
                break;
            }
            if(j === columns - 1){
                free_variable_list[i] = 1;
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
            list_of_numbers.push(decimal_to_fraction(matrix[i][j])); //converts to a pair (first = numerator, second = denominator)
        }
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

function process_matrix_to_coefficients(rows, columns) {//converts the matrix to a list of coefficients corresponding with the order of compounds as they appear.
    var coefficients = [];
    for (j = 0; j < matrix[0].length - 1; ++j){
        coefficients[j] = -1;
    }

    var free_variables = [];
    rref(rows, columns);
    reformat_matrix(rows, columns);
    convert_matrix_to_integers(rows, columns);
    free_variables = find_free_variables(rows, columns);
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