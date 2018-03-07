import {chunk, flatten} from "lodash";
import {build} from "node-xlsx";
import {writeFileSync} from "fs";


const BitArray = require('node-bitarray');

export const countOfBits = 10;

export function getPopulationCount(n){
    if(n < 4) return 500;
    return 5000;
}

export function writeExcel(){
    const data = [
        ["№ конфігурації", "Прогін 1",  "Прогін 2",  "Прогін 2",  "Прогін 2"],
        [true, false, null, 'sheetjs'],
        ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'],
        ['baz', null, 'qux']
    ];

    var buffer = build([{name: "mySheetName", data: data}]); // Returns a buffer
    writeFileSync("a.xlsx", buffer);
}



export function generateRandomPerson(){
    return Math.round(Math.random() * 1e3);
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

export function getByteArray(parent1){
    var parts = parent1
        .map((num1) => {
            return normilizeByteArray(BitArray.parse(num1));
        });
    return flatten(parts);
}

export function getNumberFromBytes(arr){
    return chunk(arr, countOfBits)
        .map(arr => BitArray.toNumber(arr) / 1e3);
}

export function gemmingDistance(person1, preson2){
    const arr1 = getByteArray(person1);
    const arr2 = getByteArray(preson2);

    let distance = 0;

    for(let i = 0; i < arr1.length; i++){
        if(arr1[i] !== arr2[i]){
            distance++;
        }
    }
    return distance;
}

export function normilizeByteArray(arr1) {
    while(arr1.length < countOfBits){
        arr1.unshift(0);
    }

    return arr1;
}


