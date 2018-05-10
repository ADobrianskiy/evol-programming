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
    deba1, deba1Extender, deba2, deba2Extender, deba3, deba3Extender, deba4, deba4Extender, debaHealth, f22,
    f22Extender, f23, f23Extender, f24,
    f24Extender, f24Health, f25, f25Extender, f28, f28Extender, f31,
    f31Denorm,
    f31Extender,
    f31Health, f31XNorm, f42, f42Extender, f42Health, f43,
    f43Extender, f45, f45Extender, f45Health, f46,
    f46Extender, f46Health, f46X1Denorm, f46X1Norm, f46X2Denorm, f46X2Norm, f50g, f50gExtender, generalHealth,
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
        deba: f22,
        extender: f22Extender,
        p: closestFromTheWorst1,
        health: generalHealth.bind(null, xNormConst(-600, 600)),
        xMin: -600,
        xMax: 600,
        xNorm: xNormConst(-600, 600),
        xDenorm: xDenormConst(-600, 600),
        dimensions: [1, 2, 3, 4],
        step: 2,
        zCoef: 1
    },

    {
        deba: f22,
        extender: f22Extender,
        p: closestFromTheWorst2,
        health: generalHealth.bind(null, xNormConst(-600, 600)),
        xMin: -600,
        xMax: 600,
        xNorm: xNormConst(-600, 600),
        xDenorm: xDenormConst(-600, 600),
        dimensions: [1, 2, 3, 4],
        step: 2
    },

    {
        deba: f22,
        extender: f22Extender,
        p: closestFromRandoms,
        health: generalHealth.bind(null, xNormConst(-600, 600)),
        xMin: -600,
        xMax: 600,
        xNorm: xNormConst(-600, 600),
        xDenorm: xDenormConst(-600, 600),
        dimensions: [1, 2, 3, 4],
        step: 2
    },

    {
        deba: f22,
        extender: f22Extender,
        p: worstFromTheClosest,
        health: generalHealth.bind(null, xNormConst(-600, 600)),
        xMin: -600,
        xMax: 600,
        xNorm: xNormConst(-600, 600),
        xDenorm: xDenormConst(-600, 600),
        dimensions: [1, 2, 3, 4],
        step: 2
    },

    // -----------------------------

    {
        deba: f23,
        extender: f23Extender,
        p: closestFromTheWorst1,
        health: generalHealth.bind(null, xNormConst(-500, 500)),
        xMin: -500,
        xMax: 500,
        xNorm: xNormConst(-500, 500),
        xDenorm: xDenormConst(-500, 500),
        dimensions: [1, 2, 3, 4],
        step: 2
    },
    {
        deba: f23,
        extender: f23Extender,
        p: closestFromTheWorst2,
        health: generalHealth.bind(null, xNormConst(-500, 500)),
        xMin: -500,
        xMax: 500,
        xNorm: xNormConst(-500, 500),
        xDenorm: xDenormConst(-500, 500),
        dimensions: [1, 2, 3, 4],
        step: 2
    },
    {
        deba: f23,
        extender: f23Extender,
        p: closestFromRandoms,
        health: generalHealth.bind(null, xNormConst(-500, 500)),
        xMin: -500,
        xMax: 500,
        xNorm: xNormConst(-500, 500),
        xDenorm: xDenormConst(-500, 500),
        dimensions: [1, 2, 3, 4],
        step: 2
    },
    {
        deba: f23,
        extender: f23Extender,
        p: worstFromTheClosest,
        health: generalHealth.bind(null, xNormConst(-500, 500)),
        xMin: -500,
        xMax: 500,
        xNorm: xNormConst(-500, 500),
        xDenorm: xDenormConst(-500, 500),
        dimensions: [1, 2, 3, 4],
        step: 2
    },

    // -----------------------------
    {

        deba: f50g,
        extender: f50gExtender,
        p: closestFromTheWorst1,
        health: generalHealth.bind(null, xNormConst(-2 * Math.PI, 2 * Math.PI)),
        xMin: -2 * Math.PI,
        xMax: 2 * Math.PI,
        xNorm: xNormConst(-2 * Math.PI, 2 * Math.PI),
        xDenorm: xDenormConst(-2 * Math.PI, 2 * Math.PI),
        dimensions: [1, 2, 3, 4]
    }, {

        deba: f50g,
        extender: f50gExtender,
        p: closestFromTheWorst2,
        health: generalHealth.bind(null, xNormConst(-2 * Math.PI, 2 * Math.PI)),
        xMin: -2 * Math.PI,
        xMax: 2 * Math.PI,
        xNorm: xNormConst(-2 * Math.PI, 2 * Math.PI),
        xDenorm: xDenormConst(-2 * Math.PI, 2 * Math.PI),
        dimensions: [1, 2, 3, 4]
    }, {

        deba: f50g,
        extender: f50gExtender,
        p: closestFromRandoms,
        health: generalHealth.bind(null, xNormConst(-2 * Math.PI, 2 * Math.PI)),
        xMin: -2 * Math.PI,
        xMax: 2 * Math.PI,
        xNorm: xNormConst(-2 * Math.PI, 2 * Math.PI),
        xDenorm: xDenormConst(-2 * Math.PI, 2 * Math.PI),
        dimensions: [1, 2, 3, 4]
    }, {

        deba: f50g,
        extender: f50gExtender,
        p: worstFromTheClosest,
        health: generalHealth.bind(null, xNormConst(-2 * Math.PI, 2 * Math.PI)),
        xMin: -2 * Math.PI,
        xMax: 2 * Math.PI,
        xNorm: xNormConst(-2 * Math.PI, 2 * Math.PI),
        xDenorm: xDenormConst(-2 * Math.PI, 2 * Math.PI),
        dimensions: [1, 2, 3, 4]
    },

    // -----------------------------
    {
        deba: f25,
        extender: f25Extender,
        p: closestFromTheWorst1,
        health: generalHealth.bind(null, xNormConst(-32.678, 32.678)),
        xMin: -32.678,
        xMax: 32.678,
        xNorm: xNormConst(-32.678, 32.678),
        xDenorm: xDenormConst(-32.678, 32.678),
        dimensions: [1, 2, 3, 4],
        step: 0.1
    }, {
        deba: f25,
        extender: f25Extender,
        p: closestFromTheWorst2,
        health: generalHealth.bind(null, xNormConst(-32.678, 32.678)),
        xMin: -32.678,
        xMax: 32.678,
        xNorm: xNormConst(-32.678, 32.678),
        xDenorm: xDenormConst(-32.678, 32.678),
        dimensions: [1, 2, 3, 4],
        step: 1
    }, {
        deba: f25,
        extender: f25Extender,
        p: closestFromRandoms,
        health: generalHealth.bind(null, xNormConst(-32.678, 32.678)),
        xMin: -32.678,
        xMax: 32.678,
        xNorm: xNormConst(-32.678, 32.678),
        xDenorm: xDenormConst(-32.678, 32.678),
        dimensions: [1, 2, 3, 4],
        step: 1
    }, {
        deba: f25,
        extender: f25Extender,
        p: worstFromTheClosest,
        health: generalHealth.bind(null, xNormConst(-32.678, 32.678)),
        xMin: -32.678,
        xMax: 32.678,
        xNorm: xNormConst(-32.678, 32.678),
        xDenorm: xDenormConst(-32.678, 32.678),
        dimensions: [1, 2, 3, 4],
        step: 1
    },
];
(async function main() {
    for (var dimension = 1; dimension <= 4; dimension++) {
        const stat = {};
        for (var configI = 0; configI < configs.length; configI++) {
            var config = configs[configI];
            if (config && (
                    (config.dimensions && config.dimensions.indexOf(dimension) === -1) || config.broken)) {
                continue;
            }

            const statistic = [];
            for (let i = 0; i < progons; i++) {
                if (config.broken) {
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
                        await drawChart(config.deba, xMin, xMax, res, file + ".png", config.step);
                    } else if (dimension === 2) {
                        if (config.x1Min && config.x2Min && config.x1Max && config.x2Max) {
                            await draw3dChart2(config.deba, res, file + ".png", config.x1Min, config.x2Min, config.x1Max, config.x2Max, config.step, config.additionalPicks, config.zCoef);
                        } else {
                            await draw3dChart3(config.deba, res, file + ".png", config.xMin, config.xMax, config.step, config.zCoef);
                        }
                    }
                }

                statistic.push(res);
                if (res.reason === "time") {
                    config.broken = true;
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