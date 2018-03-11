require("source-map-support").install();
import {execute} from "./src/executor";
import {generateRandomPerson, getByteArray, getNumberFromBytes, getPopulationCount, writeExcel} from "./src/helpers";
import {deba1, deba1Extender} from "./src/functions";
import {
    closestFromRandoms, closestFromTheWorst1, closestFromTheWorst2,
    worstFromTheClosest
} from "./src/replaceStrategies";
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
const progons = 10;
const deba = deba1;
const filename = "Table__Function_F15__Dim_1(3).xls";

const configs = [
    //{deba: deba, extender: deba1Extender, p: closestFromTheWorst1},
    //{deba: deba, extender: deba1Extender, p: closestFromTheWorst2},
    //{deba: deba, extender: deba1Extender, p: closestFromRandoms},
    {deba: deba, extender: deba1Extender, p: worstFromTheClosest},
];

const configurations = [];
configs.forEach((config, configI)=>{
    const statistic = [];

    for(let i = 0; i < progons; i++){
        console.log(`Config: ${configI}, Progon: ${i}`)
        statistic.push(execute(getData(dimension,i), config));
        writeFileSync(`out_${configI}_${i}.json`, JSON.stringify(statistic));
    }

    configurations.push({statistic: statistic});
});


//writeFileSync("tmp.json", JSON.stringify(statistic));


//var statistic = JSON.parse(readFileSync("tmp.json"))
//var configuration = {statistic: [statistic]};


writeExcel(configurations, filename);

