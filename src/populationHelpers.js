import {getByteArray, getGG, getNumberFromBytes, randomInteger} from "./helpers";
import {health} from "./functions";
import {concat} from "lodash";

export function getParents(data, constants) {
    const population = data.population.slice();
    const GG = getGG(data, constants);
    return Array(GG / 2)
        .fill(0)
        .map(() => {
            const index1 = randomInteger(0, population.length - 1);
            const parent1 = population.splice(index1, 1)[0];

            const index2 = randomInteger(0, population.length - 1);
            const parent2 = population.splice(index2, 1)[0];

            return {
                parent1,
                parent2
            };
        });
}

export function getChildrenData(parents, data, constants) {
    return parents.map(({parent1, parent2}) => {
        let [child1, child2] = applyCossengover(parent1, parent2, constants.pc);

        child1 = applyMutation(child1);
        child2 = applyMutation(child2);

        return {
            parents: {parent1, parent2},
            children: {
                child1: child1,
                child2: child2
            }
        };
    })
}

export function applyCossengover(arr1, arr2, p) {
    arr1 = arr1.slice();
    arr2 = arr2.slice();

    let child1 = arr1;
    let child2 = arr2;

    if (Math.random() < p) {
        const index = randomInteger(1, arr1.length);
        child1 = concat(arr1.slice(0, index), arr2.slice(index));
        child2 = concat(arr2.slice(0, index), arr1.slice(index));
    }

    return [child1, child2]
}

export function applyMutation(arr, p) {
    arr = arr.slice();
    arr.forEach((el, index) => {
        if (Math.random() < p) {
            arr[index] = arr[index] === 0 ? 1 : 0;
        }
    });
    return arr;
}

export function getAvgHealth(population, deba) {
    return population
        .map(e => health(deba, e))
        .reduce((a, b) => a + b)
}