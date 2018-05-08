import {draw3dChart, draw3dChart2, draw3dChart3, drawChart} from "./src/charts";

require("source-map-support").install();
import {execute} from "./src/executor";
import {
    generateData, generateRandomPerson, getByteArray, getNumberFromBytes, getPopulationCount,
    writeExcel
} from "./src/helpers";
import {
    d6, d6Denorm, d6Extender,
    d6XNorm,
    deba1, deba1Extender, deba2, deba2Extender, deba3, deba3Extender, deba4, deba4Extender, debaHealth, f24,
    f24Extender, f24Health, f28, f28Extender, f31,
    f31Denorm,
    f31Extender,
    f31Health, f31XNorm, f42, f42Extender, f42Health, f43,
    f43Extender, f45, f45Extender, f45Health, f46,
    f46Extender, f46Health, f46X1Denorm, f46X1Norm, f46X2Denorm, f46X2Norm, generalHealth,
    numberHealth, rastrigin, rastriginDenorm, rastriginExtender, rastriginMod, rastriginModExtender, rastriginXNorm,
    sheckels,
    sheckelsExtender,
    sheckelsHealth,
    sheckelsPicks,
    sheckelsXDenorm, sheckelsXNorm, xDenormConst, xNormConst
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


const progons = 10;
const max = 1e3;

const configs = [
    {
        deba: d6,
        extender: d6Extender,
        p: closestFromTheWorst1,
        health: generalHealth.bind(null, d6XNorm.bind(null, max)),
        xMin: 0,
        xMax: 30,
        xNorm: d6XNorm.bind(null, max),
        xDenorm: d6Denorm.bind(null, max),
        dimensions: [1]
    },
    {
        deba: d6,
        extender: d6Extender,
        p: closestFromRandoms,
        health: generalHealth.bind(null, d6XNorm.bind(null, max)),
        xMin: 0,
        xMax: 30,
        xNorm: d6XNorm.bind(null, max),
        xDenorm: d6Denorm.bind(null, max),
        dimensions: [1]
    },

    {
        deba: sheckels,
        extender: sheckelsExtender,
        p: closestFromTheWorst1,
        health: sheckelsHealth,
        x1Min: -65.536,
        x2Min: -65.536,
        x1Max: 65.536,
        x2Max: 65.536,
        x1Norm: sheckelsXNorm,
        x2Norm: sheckelsXNorm,
        x1Denorm: sheckelsXDenorm,
        x2Denorm: sheckelsXDenorm,
        dimensions: [2],
        step: 1,
        additionalPicks: sheckelsPicks()
    },


    {
        deba: rastrigin,
        extender: rastriginExtender,
        p: closestFromTheWorst1,
        health: generalHealth.bind(null, rastriginXNorm),
        xMin: -5.12,
        xMax: 5.12,
        xNorm: rastriginXNorm,
        xDenorm: rastriginDenorm,
        dimensions: [1,2,3]
    },

    {
        deba: f42,
        extender: f42Extender,
        p: closestFromTheWorst1,
        health: f42Health,
        x1Min: -2.5,
        x2Min: -2,
        x1Max: 3,
        x2Max: 2,
        x1Norm: xNormConst(-2.5, 3),
        x2Norm: xNormConst(-2, 2),
        x1Denorm: xDenormConst(-2.5, 3),
        x2Denorm: xDenormConst(-2, 2),
        dimensions: [2],
        step: 0.2
    },


    {
        deba: f45,
        extender: f45Extender,
        p: closestFromTheWorst1,
        health: f45Health,
        x1Min: -6,
        x2Min: -6,
        x1Max: 6,
        x2Max: 6,
        x1Norm: xNormConst(-6, 6),
        x2Norm: xNormConst(-6, 6),
        x1Denorm: xDenormConst(-6, 6),
        x2Denorm: xDenormConst(-6, 6),
        dimensions: [2],
        step: 0.2
    },


    {
        deba: f24,
        extender: f24Extender,
        p: closestFromTheWorst1,
        health: f24Health,
        x1Min: -10,
        x2Min: -10,
        x1Max: 10,
        x2Max: 10,
        x1Norm: xNormConst(-10, 10),
        x2Norm: xNormConst(-10, 10),
        x1Denorm: xDenormConst(-10, 10),
        x2Denorm: xDenormConst(-10, 10),
        dimensions: [2],
        step: 0.2
    },
    {
        deba: f24,
        extender: f24Extender,
        p: closestFromRandoms,
        health: f24Health,
        x1Min: -10,
        x2Min: -10,
        x1Max: 10,
        x2Max: 10,
        x1Norm: xNormConst(-10, 10),
        x2Norm: xNormConst(-10, 10),
        x1Denorm: xDenormConst(-10, 10),
        x2Denorm: xDenormConst(-10, 10),
        dimensions: [2],
        step: 0.2
    },


    {
        deba: f28,
        extender: f28Extender,
        p: closestFromTheWorst1,
        health: generalHealth.bind(null,  xNormConst(0.25,10)),
        xMin: 0.25,
        xMax: 10,
        xNorm: xNormConst(0.25,10),
        xDenorm: xDenormConst(0.25,10),
        dimensions: [1,2,3]
    },
    {
        deba: f28,
        extender: f28Extender,
        p: closestFromRandoms,
        health: generalHealth.bind(null,  xNormConst(0.25,10)),
        xMin: 0.25,
        xMax: 10,
        xNorm: xNormConst(0.25,10),
        xDenorm: xDenormConst(0.25,10),
        dimensions: [1,2,3]
    },


    {
        deba: rastriginMod,
        extender: rastriginModExtender,
        p: closestFromTheWorst1,
        health: generalHealth.bind(null,  xNormConst(0,1)),
        xMin: 0,
        xMax: 1,
        xNorm: xNormConst(0,1),
        xDenorm: xDenormConst(0,1),
        dimensions: [2]
    },
    {
        deba: rastriginMod,
        extender: rastriginModExtender,
        p: closestFromRandoms,
        health: generalHealth.bind(null,  xNormConst(0,1)),
        xMin: 0,
        xMax: 1,
        xNorm: xNormConst(0,1),
        xDenorm: xDenormConst(0,1),
        dimensions: [2]
    },


// ----------------------------------------------


    {
        deba: d6,
        extender: d6Extender,
        p: closestFromTheWorst2,
        health: generalHealth.bind(null, d6XNorm.bind(null, max)),
        xMin: 0,
        xMax: 30,
        xNorm: d6XNorm.bind(null, max),
        xDenorm: d6Denorm.bind(null, max),
        dimensions: [1]
    },
    {
        deba: sheckels,
        extender: sheckelsExtender,
        p: closestFromTheWorst2,
        health: sheckelsHealth,
        x1Min: -65.536,
        x2Min: -65.536,
        x1Max: 65.536,
        x2Max: 65.536,
        x1Norm: sheckelsXNorm,
        x2Norm: sheckelsXNorm,
        x1Denorm: sheckelsXDenorm,
        x2Denorm: sheckelsXDenorm,
        dimensions: [2],
        step: 1,
        additionalPicks: sheckelsPicks()
    },
    {
        deba: rastrigin,
        extender: rastriginExtender,
        p: closestFromTheWorst2,
        health: generalHealth.bind(null, rastriginXNorm),
        xMin: -5.12,
        xMax: 5.12,
        xNorm: rastriginXNorm,
        xDenorm: rastriginDenorm,
        dimensions: [1,2,3]
    },

    {
        deba: f42,
        extender: f42Extender,
        p: closestFromTheWorst2,
        health: f42Health,
        x1Min: -2.5,
        x2Min: -2,
        x1Max: 3,
        x2Max: 2,
        x1Norm: xNormConst(-2.5, 3),
        x2Norm: xNormConst(-2, 2),
        x1Denorm: xDenormConst(-2.5, 3),
        x2Denorm: xDenormConst(-2, 2),
        dimensions: [2],
        step: 0.2
    },
    {
        deba: f45,
        extender: f45Extender,
        p: closestFromTheWorst2,
        health: f45Health,
        x1Min: -6,
        x2Min: -6,
        x1Max: 6,
        x2Max: 6,
        x1Norm: xNormConst(-6, 6),
        x2Norm: xNormConst(-6, 6),
        x1Denorm: xDenormConst(-6, 6),
        x2Denorm: xDenormConst(-6, 6),
        dimensions: [2],
        step: 0.2
    },
    {
        deba: f24,
        extender: f24Extender,
        p: closestFromTheWorst2,
        health: f24Health,
        x1Min: -10,
        x2Min: -10,
        x1Max: 10,
        x2Max: 10,
        x1Norm: xNormConst(-10, 10),
        x2Norm: xNormConst(-10, 10),
        x1Denorm: xDenormConst(-10, 10),
        x2Denorm: xDenormConst(-10, 10),
        dimensions: [2],
        step: 0.2
    },
    {
        deba: f28,
        extender: f28Extender,
        p: closestFromTheWorst2,
        health: generalHealth.bind(null,  xNormConst(0.25,10)),
        xMin: 0.25,
        xMax: 10,
        xNorm: xNormConst(0.25,10),
        xDenorm: xDenormConst(0.25,10),
        dimensions: [1,2,3]
    },
    {
        deba: rastriginMod,
        extender: rastriginModExtender,
        p: closestFromTheWorst2,
        health: generalHealth.bind(null,  xNormConst(0,1)),
        xMin: 0,
        xMax: 1,
        xNorm: xNormConst(0,1),
        xDenorm: xDenormConst(0,1),
        dimensions: [2]
    },{
        deba: rastrigin,
        extender: rastriginExtender,
        p: closestFromRandoms,
        health: generalHealth.bind(null, rastriginXNorm),
        xMin: -5.12,
        xMax: 5.12,
        xNorm: rastriginXNorm,
        xDenorm: rastriginDenorm,
        dimensions: [1,2,3]
    },
    {
        deba: sheckels,
        extender: sheckelsExtender,
        p: closestFromRandoms,
        health: sheckelsHealth,
        x1Min: -65.536,
        x2Min: -65.536,
        x1Max: 65.536,
        x2Max: 65.536,
        x1Norm: sheckelsXNorm,
        x2Norm: sheckelsXNorm,
        x1Denorm: sheckelsXDenorm,
        x2Denorm: sheckelsXDenorm,
        dimensions: [2],
        step: 1,
        additionalPicks: sheckelsPicks()
    },
    {
        deba: d6,
        extender: d6Extender,
        p: closestFromRandoms,
        health: generalHealth.bind(null, d6XNorm.bind(null, max)),
        xMin: 0,
        xMax: 30,
        xNorm: d6XNorm.bind(null, max),
        xDenorm: d6Denorm.bind(null, max),
        dimensions: [1]
    },
    {
        deba: f42,
        extender: f42Extender,
        p: closestFromRandoms,
        health: f42Health,
        x1Min: -2.5,
        x2Min: -2,
        x1Max: 3,
        x2Max: 2,
        x1Norm: xNormConst(-2.5, 3),
        x2Norm: xNormConst(-2, 2),
        x1Denorm: xDenormConst(-2.5, 3),
        x2Denorm: xDenormConst(-2, 2),
        dimensions: [2],
        step: 0.2
    },{
        deba: f45,
        extender: f45Extender,
        p: closestFromRandoms,
        health: f45Health,
        x1Min: -6,
        x2Min: -6,
        x1Max: 6,
        x2Max: 6,
        x1Norm: xNormConst(-6, 6),
        x2Norm: xNormConst(-6, 6),
        x1Denorm: xDenormConst(-6, 6),
        x2Denorm: xDenormConst(-6, 6),
        dimensions: [2],
        step: 0.2
    }
];
(async function main() {
    for (var dimension = 1; dimension <= 3; dimension++) {
        const stat = {};
        for (var configI = 0; configI < configs.length; configI++) {
            var config = configs[configI];
            if(config && (
                (config.dimensions && config.dimensions.indexOf(dimension) === -1) || config.broken)){
                continue;
            }

            const statistic = [];
            for (let i = 0; i < progons; i++) {
                if(config.broken){
                    continue;
                }

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
                        let xMin = 0;
                        let xMax = 1;
                        if (typeof config.xMin !== "undefined") {
                            xMin = config.xMin
                        }
                        if (typeof config.xMax !== "undefined") {
                            xMax = config.xMax
                        }
                        await drawChart(config.deba, xMin, xMax, res, file + ".png");
                    } else if (dimension === 2) {
                        if (config.x1Min && config.x2Min && config.x1Max && config.x2Max) {
                            await draw3dChart2(config.deba, res, file + ".png", config.x1Min, config.x2Min, config.x1Max, config.x2Max, config.step, config.additionalPicks);
                        } else {
                            await draw3dChart3(config.deba, res, file + ".png", config.xMin, config.xMax);
                        }
                    }
                }

                statistic.push(res);
                if(res.reason === "time"){
                    config. broken = true;
                }
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