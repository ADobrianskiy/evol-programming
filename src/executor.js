import {generateRandomPerson, getGG, getPopulationCount, randomInteger} from "./helpers";
import {getAvgHealth, getChildrenData, getParents} from "./populationHelpers";
import {processReplace} from "./replaceStrategies";
import {cloneDeep, merge} from "lodash";

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

    while (true) {
        step(data, constants);

        execution++;

        updateStatistic(statistic, data, constants, execution);

        if (execution > constants.maxExecutions) {
            console.log("stop because of iterations");
            return;
        } else if (stopBecauseOfStatistic(statistic, constants)) {
            console.log("stop because of statistic");
            return;
        }
    }
}

export function updateStatistic(statistic, data, constants, executions) {
    statistic.push(getStatistic(data, constants, executions));
    if (statistic.length > constants.maxStatisticStorage) {
        statistic.shift();
    }
}

export function getStatistic(data, constants, execution) {
    return {
        avgHealth: getAvgHealth(data.population, constants.f)
    }
}

export function stopBecauseOfStatistic(statistic, constants) {
    if (statistic.length === constants.maxStatisticStorage) {
        return Math.abs(statistic[0].avgHealth - statistic[statistic.length - 1].avgHealth) < constants.minHealthDiff;
    } else {
        return false;
    }
}


export function step(data, constants) {
    const parent = getParents(data, constants);
    const childrenData = getChildrenData(parent, data, constants);
    processReplace(data, childrenData, constants);

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