import {generateRandomPerson, getGG, getPopulationCount, randomInteger} from "./helpers";
import {getAvgHealth, getChildrenData, getParents} from "./populationHelpers";
import {processReplace} from "./replaceStrategies";
import {cloneDeep, merge} from "lodash";
import {getSeeds} from "./statisticHelpers";

var dataSample = {
    dimensions: 1,
    populationSize: getPopulationCount(1),
    population: Array(500).map(() => {
        return generateRandomPerson()
    })
};

const constantsBase = {
    GG: 0.2,
    cf: 3,
    pc: 1,
    pm: 0.2,
    maxExecutions: 20000000,
    minHealthDiff: 0.0001,
    maxStatisticStorage: 10
};

/**
 *
 * @param data - see dataSample above
 * @param props {f: function from functions.js, p: function from repalceStrategies.js}
 */
export function execute(data, props) {
    const statistic = [];
    const constants = merge(constantsBase, props);
    let execution = 0;
    data.nfe = 0;
    const deba = constants.deba;
    constants.deba = (x) => {
        data.nfe++;
        return deba(x);
    };

    updateStatistic(statistic, data, constants);

    while (true) {
        step(data, constants, execution);

        execution++;
        console.log(`AVG health for step ${execution}:` ,statistic[statistic.length - 1].avgHealth);

        updateStatistic(statistic, data, constants);

        if (execution > constants.maxExecutions) {
            console.log("stop because of iterations");
            const res = expandStatistic(statistic.pop(), data, constants, execution);
            res.reason = "executions";
            return res;
        } else if (stopBecauseOfStatistic(statistic, constants)) {
            console.log("stop because of statistic");
            const res = expandStatistic(statistic.pop(), data, constants, execution);
            res.reason = "statistic";
            return res;
        }
    }
}

export function updateStatistic(statistic, data, constants) {
    statistic.push(getStatistic(data, constants));
    if (statistic.length > constants.maxStatisticStorage) {
        statistic.shift();
    }
}

export function getStatistic(data, constants) {
    return {
        avgHealth: getAvgHealth(data.population, constants.deba)
    }
}

export function expandStatistic(statistic, data, constants, executions) {
    console.log("expanding statistic")
    statistic.seeds = getSeeds(data, constants);
    statistic.executions = executions;
    statistic.nfe = data.nfe;
    constants.extender(statistic, data, constants)
    return statistic;
}

export function stopBecauseOfStatistic(statistic, constants) {
    if (statistic.length === constants.maxStatisticStorage) {
        return Math.abs(statistic[0].avgHealth - statistic[statistic.length - 1].avgHealth) < constants.minHealthDiff;
    } else {
        return false;
    }
}


export function step(data, constants, execution) {
    if (execution === 0) console.time('getParents');
    const parent = getParents(data, constants);
    if (execution === 0) console.timeEnd('getParents');

    if (execution === 0) console.time('getChildrenData');
    const childrenData = getChildrenData(parent, data, constants);
    if (execution === 0) console.timeEnd('getChildrenData');

    if (execution === 0) console.time('processReplace');
    processReplace(data, childrenData, constants);
    if (execution === 0) console.timeEnd('processReplace');

}


/**
 NFE (number of fitness function evaluations) – кількість обчислень функції пристосованості.
 NSeeds (number of Seeds) – кількість піків (реальних та хибних), знайдених за один прогін алгоритму.
 NP (number of peaks) – кількість реальних (глобальних та локальних) піків, знайдених за один прогін алгоритму.
 GP (number of global peaks) – кількість реальних глобальних піків, знайдених за один прогін алгоритму.
 LP (number of local peaks) – кількість реальних локальних піків, знайдених за один прогін алгоритму.
 Очевидно, що NP=GP+LP.
 PR (peak ratio) – відношення кількості знайдених алгоритмом реальних піків до загальної кількості піків, які необхідно локалізувати.
 GPR (global peak ratio) – відношення кількості знайдених алгоритмом реальних глобальних піків до загальної кількості глобальних піків, які необхідно локалізувати.
 LPR (local peak ratio) – відношення кількості знайдених алгоритмом реальних локальних піків до загальної кількості локальних піків, які необхідно локалізувати.
 Якщо розташування локальних піків функції невідомо, то критерії LP, LPR не обчислюємо взагалі (розглядається задача пошуку всіх глобальних максимумів).
 Оскільки в загальному випадку NSeeds≥NP (алгоритм знаходить хибні піки), введемо також критерій оцінювання кількості хибних піків.
 FPR (fake peak ratio) – частка хибних піків – відношення кількості хибних піків до загальної кількості сформованих алгоритмом ніш:  .
 Очевидно, 0≤PR, FPR≤1; алгоритм кращий за більших значень PR та за менших значень FPR.

 */