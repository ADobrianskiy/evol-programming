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

var shell = require('shelljs');

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

const progons = 2;

const configs = [
    {deba: deba1, extender: deba1Extender, p: closestFromTheWorst1},
    {deba: deba1, extender: deba1Extender, p: closestFromTheWorst2},
    /*{deba: deba1, extender: deba1Extender, p: closestFromRandoms},
    {deba: deba1, extender: deba1Extender, p: worstFromTheClosest},
    
    {deba: deba2, extender: deba2Extender, p: closestFromTheWorst1},
    {deba: deba2, extender: deba2Extender, p: closestFromTheWorst2},
    {deba: deba2, extender: deba2Extender, p: closestFromRandoms},
    {deba: deba2, extender: deba2Extender, p: worstFromTheClosest},
    
    {deba: deba3, extender: deba3Extender, p: closestFromTheWorst1},
    {deba: deba3, extender: deba3Extender, p: closestFromTheWorst2},
    {deba: deba3, extender: deba3Extender, p: closestFromRandoms},
    {deba: deba3, extender: deba3Extender, p: worstFromTheClosest},
    
    {deba: deba4, extender: deba4Extender, p: closestFromTheWorst1},
    {deba: deba4, extender: deba4Extender, p: closestFromTheWorst2},
    {deba: deba4, extender: deba4Extender, p: closestFromRandoms},
    {deba: deba4, extender: deba4Extender, p: worstFromTheClosest},*/
];

(function main() {
    for (var dimension = 1; dimension <= 1; dimension++) {
        const stat = {};
        configs.forEach((config, configI) => {
            const statistic = [];
            for (let i = 0; i < progons; i++) {
                console.log(`Dimensions: ${dimension}, Config: ${configI}, Progon: ${i}`);
                const confDir = `out/dimension_${dimension}/${config.deba.name}/${config.p.name}`;
                shell.mkdir('-p', confDir);
                const file = confDir + `/out_${i}`;

                let res;
                if (existsSync(file + `.json`)) {
                    res = JSON.parse(readFileSync(file + `.json`));
                } else {
                    res = execute(getData(dimension, i), config);
                    if (dimension === 1) {
                        drawChart(config.deba, 0, 1, res, file + ".png");
                    } else if (dimension === 2) {
                        draw3dChart(numberHealth.bind(null, config.deba), 0, 1, res, file + ".png");
                    }
                    writeFileSync(file + `.json`, JSON.stringify(res));
                }


                statistic.push(res);
            }
            if (!stat[config.deba.name]) stat[config.deba.name] = [];
            stat[config.deba.name].push(statistic);
        });

        Object.keys(stat)
            .forEach(key => {
                const data = stat[key].map((a) => {
                    return {statistic: a}
                });
                writeExcel(data, `out/dimension_${dimension}/${key}/stat.xlsx`);
            });

    }
})();
/*
//const data = execute(getData(dimension,0), configs[0]);
//writeFileSync(`out/out_.json`, JSON.stringify(data));
const data = JSON.parse(readFileSync(`out/out_.json`));
if(dimension === 2){
    draw3dChart(numberHealth.bind(null, deba1),0,1, data , "chart1.png");
}*/