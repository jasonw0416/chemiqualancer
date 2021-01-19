var matrix = [[ 1, 0, -2, 0 ], [ 1, 4, -4, -1 ], [ 1, 2, 0, -2 ], [ 0, 1, -1, 0 ]];

console.log(process_matrix_to_coefficients(4, 4));

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
            if(is_all_zero === 1){
                free_variable_list.push(1);
            }
            else if(is_all_zero === 0){
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
    console.log(matrix);
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
    return coefficients;
}
