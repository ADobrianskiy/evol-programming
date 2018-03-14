import {gemmingDistance, randomInteger} from "./helpers";
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

export function getPersonIndex(population, person) {
    return population.findIndex((element) => {
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
        .sort((a, b) => gemmingDistance(a, child) - gemmingDistance(b, child))
        [0];
}

export function closestFromTheWorst2(data, child, constants) {
    return data.population.slice()
        .sort((a, b) => health(constants.deba, a) - health(constants.deba, b))
        .slice(0, Math.round(data.population.length / 3))
        .sort((a, b) => gemmingDistance(a, child) - gemmingDistance(b, child))
        [0];
}

export function closestFromRandoms(data, child, constants) {
    const candidates = [];
    while(candidates.length < constants.cf){
        const index = randomInteger(0, data.population.length - 1);
        candidates.push(data.population[index])
    }
    const res = candidates
        .sort((a, b) => gemmingDistance(a, child) - gemmingDistance(b, child));

    //console.log(gemmingDistance(res[0], child),gemmingDistance(res[res.length-1], child) )
    return res[0];
}

export function worstFromTheClosest(data, child, constants) {
    return data.population.slice()
        .sort((a, b) => gemmingDistance(a, child) - gemmingDistance(b, child))
        .slice(0, constants.cf)
        .sort((a, b) => health(constants.deba, a) - health(constants.deba, b))
        [0];
}