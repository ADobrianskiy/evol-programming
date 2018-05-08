import {gemmingDistance, randomInteger} from "./helpers";

export function processReplace(data, childrenData, constants) {
    data.population.sort((a, b) => constants.health(constants.deba, a) - constants.health(constants.deba, b));


    childrenData.forEach(({children: {child1, child2}}, i) => {
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

/**
 * Fast execution on big dimensions
 * @param data
 * @param child
 * @param constants
 * @returns {number | *}
 */
export function closestFromTheWorst1(data, child, constants) {
    //console.time("closestFromTheWorst1");
    var a = data.population
        .slice(0, constants.cf)
        .sort((a, b) => gemmingDistance(a, child) - gemmingDistance(b, child));

    //console.timeEnd("closestFromTheWorst1");
    return a[0];
}

export function closestFromTheWorst2(data, child, constants) {
    var a = data.population
        .slice(0, Math.round(data.population.length / 3))
        .sort((a, b) => gemmingDistance(a, child) - gemmingDistance(b, child));

    return a[0];
}

/**
 * Fast processing ~ 1ms
 * @param data
 * @param child
 * @param constants
 * @returns {*}
 */
export function closestFromRandoms(data, child, constants) {
    //console.time("closestFromRandoms");
    const candidates = [];
    while(candidates.length < constants.cf){
        const index = randomInteger(0, data.population.length - 1);
        candidates.push(data.population[index])
    }
    const res = candidates
        .sort((a, b) => gemmingDistance(a, child) - gemmingDistance(b, child));

    let k =  res[0];
    if(constants.health(constants.deba, k) > constants.health(constants.deba, child)){
        k = child;
    }
    return k;
}

export function worstFromTheClosest(data, child, constants) {
    //console.time("worstFromTheClosest");
    const a = data.population
        .sort((a, b) => gemmingDistance(a, child) - gemmingDistance(b, child))
        .slice(0, constants.cf)
        .sort((a, b) => constants.health(constants.deba, a) - constants.health(constants.deba, b));

    //console.timeEnd("worstFromTheClosest");
    return a[0];
}