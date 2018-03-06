import {getByteArrays, getGG, getNumberFromBytes, randomInteger} from "./helpers";
import {concat} from "lodash";

export function getParents(data, constants) {
    const population = data.population.slice();
    const GG = getGG(data, constants);
    return Array(GG / 2)
        .map(() => {
            const index1 = randomInteger(0, population.length);
            const parent1 = population.slice(index1, 1);

            const index2 = randomInteger(0, population.length);
            const parent2 = population.slice(index2, 1);

            return {
                parent1,
                parent2
            };
        });
}

export function getChildrenData(parents, data, constants) {
    return parents.map(({parent1, parent2}) => {
        const [byteParent1, byteParent2] = getByteArrays(parent1, parent2);
        let [child1, child2] = applyCossengover(byteParent1, byteParent2, constants.pc);
        child1 = applyMutation(child1);
        child2 = applyMutation(child2);

        return {
            parents: {parent1, parent2},
            children: {
                child1: getNumberFromBytes(child1),
                child2: getNumberFromBytes(child2)
            }
        };
    })
}

export function applyCossengover(arr1, arr2, p) {
    let child1 = arr1.slice();
    let child2 = arr2.slice();

    if (Math.random() < p) {
        const index = randomInteger(1, arr1.length);
        child1 = concat(arr1.slice(0, index), arr2(index));
        child2 = concat(arr2.slice(0, index), arr1(index));
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

export function getAvgHealth(population, f) {
    return population
        .map(e => f(e))
        .reduce((a, b) => a + b)
}