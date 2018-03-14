import {draw3dChart, drawChart} from "./src/charts";

require("source-map-support").install();
import {execute} from "./src/executor";
import {
    generateData, generateRandomPerson, getByteArray, getNumberFromBytes, getPopulationCount,
    writeExcel
} from "./src/helpers";
import {deba1, deba1Extender, numberHealth} from "./src/functions";
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

const dimension = 2;
const progons = 10;
const filename = "Table__Function_F15__Dim_3.xlsx";

const configs = [
    {deba: deba1, extender: deba1Extender, p: closestFromTheWorst1},
    //{deba: deba1, extender: deba1Extender, p: closestFromTheWorst2},
    //{deba: deba1, extender: deba1Extender, p: closestFromRandoms},
    //{deba: deba1, extender: deba1Extender, p: worstFromTheClosest},
];

function main(){
    const configurations = [];
    configs.forEach((config, configI)=>{
        const statistic = [];

        for(let i = 0; i < progons; i++){
            console.log(`Config: ${configI}, Progon: ${i}`)
            statistic.push(execute(getData(dimension,i), config));
            writeFileSync(`out/out_${configI}_${i}.json`, JSON.stringify(statistic));
        }

        configurations.push({statistic: statistic});
    });
    writeExcel(configurations, filename);
}

//const data = execute(getData(dimension,0), configs[0]);
//writeFileSync(`out/out_.json`, JSON.stringify(data));
const data = JSON.parse(readFileSync(`out/out_.json`));
if(dimension === 2){
    draw3dChart(numberHealth.bind(null, deba1),0,1, data , "chart1.png");
}