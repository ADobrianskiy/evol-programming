require("source-map-support").install();
import {execute} from "./src/executor";
import {generateRandomPerson, getByteArray, getPopulationCount, writeExcel} from "./src/helpers";
import {deba1, deba1Extender} from "./src/functions";
import {closestFromTheWorst1} from "./src/replaceStrategies";
import {existsSync, readFileSync, writeFileSync} from "fs";


function getData(dimensions, testNumber) {
    const path = `./data/${dimensions}_${testNumber}.json`
    if (existsSync(path)) {
        return JSON.parse(readFileSync(path));
    } else {
        const data = generateData(dimensions);
        writeFileSync(path, JSON.stringify(data))
        return data;
    }
}

function generateData(dimensions) {
    const sizeOfPopulation = getPopulationCount(dimensions);
    return {
        dimensions: dimensions,
        population: Array(sizeOfPopulation)
            .fill(0)
            .map(() => {
                const person = [];
                for (var i = 0; i < dimensions; i++) {
                    person.push(generateRandomPerson())
                }
                return getByteArray(person);
            })
    }
}

const dimension = 1;
const testNumber = 1;
const data = {deba: deba1, p: closestFromTheWorst1, extender: deba1Extender};


var statistic = execute(getData(dimension,testNumber), data);

writeExcel([statistic]);
