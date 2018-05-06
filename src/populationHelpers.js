import {getByteArray, getGG, getNumberFromBytes, randomInteger} from "./helpers";
import {concat} from "lodash";

export function getParents(data, constants) {
    const population = data.population.map((a) => {
        return {
            person: a,
            health: constants.health(constants.deba, a)
        }
    });
    const totalHealth = population.reduce((a, b) => {
        return a + b.health;
    }, 0);

    let prc = 0;
    population.forEach((a) => {
        prc = a.prc = prc + a.health / totalHealth;
    });
    const GG = getGG(data, constants);
    return Array(GG / 2)
        .fill(0)
        .map(() => {
            const r1 = Math.random();
            let parent1;
            population.some(a => {
                if (r1 <= a.prc) {
                    parent1 = a.person;
                }
                return r1 <= a.prc;
            });
            if (!parent1) {
                console.log("Whaaat?: ", population[population.length - 1].prc, r1)
                parent1 = population[population.length - 1].person;
            }

            const r2 = Math.random();
            let parent2;
            population.some(a => {
                if (a.prc <= r2) {
                    parent2 = a.person;
                }
                return a.prc <= r1;
            });
            if (!parent2) {
                parent2 = population[population.length - 1].person;
            }

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
    if (Math.random() < p) {
        const index = randomInteger(0, arr.length - 1);
        arr[index] = arr[index] === 0 ? 1 : 0;
    }
    return arr;
}

export function getAvgHealth(population, deba, constants) {
    return population
        .map(e => constants.health(deba, e))
        .reduce((a, b) => a + b) / population.length;
}