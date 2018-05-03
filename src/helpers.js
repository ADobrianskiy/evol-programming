import {chunk, flatten, deepClone} from "lodash";
import {build} from "node-xlsx";
import {writeFileSync} from "fs";


const BitArray = require('node-bitarray');

export const countOfBits = 10;
export const useGrayCode = true;

export function getPopulationCount(n) {
    if (n < 4) return 500;
    return 5000;
}

/**
 *
 * @param statistic []
 */

const r1 = ["NFE", "NSeeds", "NP", "GP", "LP", "PR", "GPR", "LPR", "FPR"];

export function addStatHeaders(data, header, ranges) {
    const r0 = [header];
    while (r0.length < r1.length) {
        r0.push("");
    }

    const range = {s: {c: data[0].length, r: 0}, e: {c: data[0].length + r0.length - 1, r: 0}}; // A1:A4
    ranges.push(range);
    data[0] = data[0].concat(r0);
    data[1] = data[1].concat(r1);
}

export function addStatistic(data, configIndex, statistic) {
    while (data.length < configIndex + 3) {
        data.push([configIndex + 1]);
    }
    const stats = [statistic.nfe, statistic.nseeds, statistic.np, statistic.gp, statistic.lp,
        statistic.pr, statistic.gpr, statistic.lpr, statistic.fpr];
    data[configIndex + 2] = data[configIndex + 2].concat(stats);
}

export function addAVGStatistic(data, statistic, configIndex) {
    const forStat = statistic.filter(stat => stat.reason === "statistic");

    const getAVGStat = prop => {
        const forCompute = forStat.filter(e => e.hasOwnProperty(prop));
        if (forCompute.length) {
            return forCompute.reduce((s, e) => s + e[prop], 0) / forCompute.length;
        } else {
            return "";
        }
    };
    const avg = {
        nfe: getAVGStat("nfe"),
        nseeds: getAVGStat("nseeds"),
        np: getAVGStat("np"),
        gp: getAVGStat("gp"),
        lp: getAVGStat("lp"),
        pr: getAVGStat("pr"),
        gpr: getAVGStat("gpr"),
        lpr: getAVGStat("lpr"),
        fpr: getAVGStat("fpr"),
    };

    addStatistic(data, configIndex, avg);
}

export function addBestStatistic(data, statistic, configIndex) {
    const forStat = statistic.filter(stat => stat.reason === "statistic");

    const getBestStat = (prop, isMin) => {
        const forCompute = forStat.sort((a, b) => {
            if (isMin) {
                return a[prop] - b[prop];
            }
            return b[prop] - a[prop];
        });
        if (forCompute.length)
            return forCompute[0][prop];
        else
            return "";
    };
    const avg = {
        nfe: getBestStat("nfe", true),
        nseeds: getBestStat("nseeds"),
        np: getBestStat("np"),
        gp: getBestStat("gp"),
        lp: getBestStat("lp"),
        pr: getBestStat("pr"),
        gpr: getBestStat("gpr"),
        lpr: getBestStat("lpr"),
        fpr: getBestStat("fpr", true),
    };

    addStatistic(data, configIndex, avg);
}

export function writeExcel(configurations, filename) {
    const data = [["№ конфігурації"], [""]];
    const ranges = []; // A1:A4

    configurations.forEach((configuration, configIndex) => {
        configuration.statistic.forEach((stat, proginN) => {
            if (configIndex === 0) {
                addStatHeaders(data, "Прогін " + proginN, ranges);
            }
            addStatistic(data, configIndex, stat);
        });
    });

    configurations.forEach((configuration, configIndex) => {
        if (configIndex === 0) {
            addStatHeaders(data, "Середнє по всіх прогонах", ranges);
            addStatHeaders(data, "Найкраще по всіх прогонах", ranges);
            data[0].push("SucRuns, %");
        }

        addAVGStatistic(data, configuration.statistic, configIndex);
        addBestStatistic(data, configuration.statistic, configIndex);

        const statStops = configuration.statistic.filter(e => {
            return e.reason === "statistic"
        }).length;
        const SucRunsPrc = (statStops / configuration.statistic.length) * 100;
        data[configIndex + 2].push(SucRunsPrc);

    });

    const option = {'!merges': ranges};
    const buffer = build([{name: "Statistic", data: data}], option); // Returns a buffer
    writeFileSync(filename, buffer);
}


export function generateRandomPerson() {
    return Math.round(Math.random() * 1e3);
}

export function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

export function getGG(data, constants) {
    let GG = Math.round(data.population.length * constants.GG);
    if (GG % 2 !== 0) {
        GG++;
    }
    return GG;
}

export function getByteArray(parent1) {
    var parts = parent1
        .map((num1) => {
            return normilizeByteArray(BitArray.parse(num1));
        });
    let res = flatten(parts);
    if (useGrayCode) {
        res = encodeGray(res);
    }
    return res;
}

export function encodeGray(arr) {
    const res = Array(arr.length);
    res[0] = arr[0];
    for (let i = 1; i < arr.length; i++) {
        res[i] = arr[i - 1] + arr[i] === 2 ? 0 : arr[i - 1] + arr[i]
    }
    return res;
}

export function decodeGray(arr) {
    const res = Array(arr.length);
    res[0] = arr[0];
    for (let i = 1; i < arr.length; i++) {
        res[i] = res[i - 1] + arr[i] === 2 ? 0 : res[i - 1] + arr[i]
    }
    return res;
}

export function getNumberFromBytes(arr) {
    return chunk(arr, countOfBits)
        .map(arr => {
            if (useGrayCode) {
                arr = decodeGray(arr);
            }
            return BitArray.toNumber(arr.reverse(arr));
        });
}

export function gemmingDistance(person1, preson2) {
    const arr1 = person1.reduce((a,b) => {
        return a.concat(b);
    }, []);
    const arr2 = preson2.reduce((a,b) => {
        return a.concat(b);
    }, []);
    let distance = 0;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            distance++;
        }
    }
    return distance;
}

export function distanceBetweenPoints(point1, point2) {
    point1 = point1.slice();
    return Math.sqrt(
        point1.reduce((a, b, i) => {
            return Math.pow(point1[i] - point2[i], 2) + a;
        }, 0)
    );
}

export function normilizeByteArray(arr1) {
    while (arr1.length < countOfBits) {
        arr1.unshift(0);
    }

    return arr1;
}

export function generateData(dimensions) {
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

