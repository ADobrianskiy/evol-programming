const BitArray = require('node-bitarray');

export function getPopulationCount(n){
    if(n < 4) return 500;
    return 5000;
}

export function writeExcel(){
    const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
    var buffer = xlsx.build([{name: "mySheetName", data: data}]); // Returns a buffer

    fs.writeFileSync("a.xlsx", buffer);
}



export function generateRandomPerson(){
    return Math.round(Math.random() * Number.MAX_SAFE_INTEGER) / 1000;
}

export function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

export function getGG(data, constants){
    let GG = Math.round(data.population.length * constants.GG);
    if(GG % 2 !== 0) {
        GG++;
    }
    return GG;
}

export function getByteArrays(num1, num2){
    let arr1 = BitArray.parse(num1);
    let arr2 = BitArray.parse(num2);
    return normilizeByteArrays(arr1, arr2);
}

export function getNumberFromBytes(arr){
    return BitArray.toNumber(arr);
}

export function gemmingDistance(num1, num2){
    const [arr1, arr2] = getByteArrays(num1, num2);

    let distance = 0;

    for(let i = 0; i < arr1.length; i++){
        if(arr1[i] !== arr2[i]){
            distance++;
        }
    }
    return distance;
}

export function normilizeByteArrays(arr1, arr2) {
    const length = Math.max(arr1.length, arr2.length);
    while(arr1.length < length){
        arr1.unshift(0);
    }

    while(arr2.length < length){
        arr2.unshift(0);
    }

    return [arr1, arr2];
}


