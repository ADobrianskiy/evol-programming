import {gemmingDistance} from "./helpers";

export function processReplace(data, childrenData, constants) {
    const newPopulation = data.population.slice();
    childrenData.forEach(({children: {child1, child2}}) => {
        // Replace child 1
        const parentToReplace1 = constants.p(data, child1, constants);
        replaceParent(data, newPopulation, parentToReplace1, child1);

        // Replace child 1
        const parentToReplace2 = constants.p(data, child2, constants);
        replaceParent(data, newPopulation, parentToReplace2, child2);
    });
}

export function replaceParent(data, newPopulation, parent, child) {
    newPopulation[newPopulation.indexOf(parent)] = child;
    data.population.slice(data.population.indexOf(parent), 1);
}

export function closestFromTheWorst1(data, child, constants) {
    return data.population.slice()
        .sort((a, b) => constants.f(a) - constants.f(b))
        .slice(0, constants.cf)
        .sort((a, b) => gemmingDistance(b, child) - gemmingDistance(a, child))
    [0];
}