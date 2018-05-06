import {draw3dChart, draw3dChart2, drawChart} from "./src/charts";

require("source-map-support").install();
import {execute} from "./src/executor";
import {
    generateData, generateRandomPerson, getByteArray, getNumberFromBytes, getPopulationCount,
    writeExcel
} from "./src/helpers";
import {
    deba1, deba1Extender, deba2, deba2Extender, deba3, deba3Extender, deba4, deba4Extender, debaHealth, f43,
    f43Extender, f46,
    f46Extender, f46Health, f46X1Denorm, f46X1Norm, f46X2Denorm, f46X2Norm,
    numberHealth
} from "./src/functions";
import {
    closestFromRandoms, closestFromTheWorst1, closestFromTheWorst2,
    worstFromTheClosest
} from "./src/replaceStrategies";
import {existsSync, readFileSync, writeFileSync} from "fs";

var shell = require('shelljs');

function getData(dimensions, testNumber) {
    const path = `./data/${dimensions}_${testNumber}.json`;
    if (existsSync(path)) {
        return JSON.parse(readFileSync(path));
    } else {
        const data = generateData(dimensions);
        writeFileSync(path, JSON.stringify(data));
        return data;
    }
}

const progons = 3;

const configs = [
    {
        deba: f43,
        extender: f43Extender,
        p: closestFromTheWorst1,
        health: f46Health,
        x1Min: -3,
        x2Min: -3,
        x1Max: 3,
        x2Max: 3,
        x1Norm: f46X1Norm,
        x2Norm: f46X1Norm,
        x1Denorm: f46X1Denorm,
        x2Denorm: f46X1Denorm
    },{
        deba: f43,
        extender: f43Extender,
        p: closestFromTheWorst2,
        health: f46Health,
        x1Min: -3,
        x2Min: -3,
        x1Max: 3,
        x2Max: 3,
        x1Norm: f46X1Norm,
        x2Norm: f46X1Norm,
        x1Denorm: f46X1Denorm,
        x2Denorm: f46X1Denorm
    },
    {
        deba: f43,
        extender: f43Extender,
        p: worstFromTheClosest,
        health: f46Health,
        x1Min: -3,
        x2Min: -3,
        x1Max: 3,
        x2Max: 3,
        x1Norm: f46X1Norm,
        x2Norm: f46X1Norm,
        x1Denorm: f46X1Denorm,
        x2Denorm: f46X1Denorm
    },
    {
        deba: f46,
        extender: f46Extender,
        p: closestFromTheWorst1,
        health: f46Health,
        x1Min: -3,
        x2Min: -2,
        x1Max: 3,
        x2Max: 2,
        x1Norm: f46X1Norm,
        x2Norm: f46X2Norm,
        x1Denorm: f46X1Denorm,
        x2Denorm: f46X2Denorm
    },
    {
        deba: f46,
        extender: f46Extender,
        p: closestFromTheWorst2,
        health: f46Health,
        x1Min: -3,
        x2Min: -2,
        x1Max: 3,
        x2Max: 2,
        x1Norm: f46X1Norm,
        x2Norm: f46X2Norm,
        x1Denorm: f46X1Denorm,
        x2Denorm: f46X2Denorm
    },
    {
        deba: f46,
        extender: f46Extender,
        p: worstFromTheClosest,
        health: f46Health,
        x1Min: -3,
        x2Min: -2,
        x1Max: 3,
        x2Max: 2,
        x1Norm: f46X1Norm,
        x2Norm: f46X2Norm,
        x1Denorm: f46X1Denorm,
        x2Denorm: f46X2Denorm
    },
    {
        deba: f46,
        extender: f46Extender,
        p: closestFromRandoms,
        health: f46Health,
        x1Min: -3,
        x2Min: -2,
        x1Max: 3,
        x2Max: 2,
        x1Norm: f46X1Norm,
        x2Norm: f46X2Norm,
        x1Denorm: f46X1Denorm,
        x2Denorm: f46X2Denorm
    }
    /*{deba: deba1, extender: deba1Extender, p: closestFromTheWorst1},
    {deba: deba1, extender: deba1Extender, p: closestFromTheWorst2},
    {deba: deba1, extender: deba1Extender, p: closestFromRandoms},
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

(async function main() {
    for (var dimension = 2; dimension <= 2; dimension++) {
        const stat = {};
        for (var configI = 0; configI < configs.length; configI++) {
            var config = configs[configI];

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
                    writeFileSync(file + `.json`, JSON.stringify(res));
                }

                if (!existsSync(file + ".png")) {
                    if (dimension === 1) {
                        drawChart(config.deba, 0, 1, res, file + ".png");
                    } else if (dimension === 2) {
                        await draw3dChart2(config.deba, res, file + ".png", config.x1Min, config.x2Min, config.x1Max, config.x2Max);
                    }
                }

                statistic.push(res);
            }
            if (!stat[config.deba.name]) stat[config.deba.name] = [];
            stat[config.deba.name].push(statistic);
        }

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