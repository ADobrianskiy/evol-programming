import {gemmingDistance} from "./helpers";
import {health} from "./functions";

export function processReplace(data, childrenData, constants) {
    childrenData.forEach(({children: {child1, child2}}) => {
        // Replace child 1
        const parentToReplace1 = constants.p(data, child1, constants);
        replaceParent(data, parentToReplace1, child1);

        // Replace child 1
        const parentToReplace2 = constants.p(data, child2, constants);
        replaceParent(data, parentToReplace2, child2);
    });
}

export function getPersonIndex(population, person){
    return population.
        findIndex((element) => {
            return element.join() === person.join()
    });
}

export function replaceParent(data, parent, child) {
    const index = getPersonIndex(data.population, parent);
    data.population[index] = child;
}

export function closestFromTheWorst1(data, child, constants) {
    return data.population.slice()
        .sort((a, b) => health(constants.deba, a) - health(constants.deba, b))
        .slice(0, constants.cf)
        .sort((a, b) => gemmingDistance(b, child) - gemmingDistance(a, child))
        [0];
}