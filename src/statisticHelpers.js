import {getNumberFromBytes} from "./helpers";

const seedDiff = 0.01;

export function getSeeds(data, constants) {
    const seeds = [];
    let population = data.population.slice();
    while (population.length) {
        population.sort((a, b) => {
            return constants.health(constants.deba, a) - constants.health(constants.deba, b);
        });

        const seed = population.pop();

        population = population.filter((e) => {
            return distance(seed, e, constants) > seedDiff;
        });

        const a = getNumberFromBytes(seed);
        if (constants.x1Norm && constants.x2Norm) {
            seeds.push([constants.x1Norm(a[0]), constants.x2Norm(a[1])]);
        } else {
            seeds.push(a.map(a => constants.xNorm(a)));
        }
    }
    return seeds;
}

export function distance(byte1, byte2, constants) {
    const pp1 = getNumberFromBytes(byte1),
        pp2 = getNumberFromBytes(byte2);
    let p1, p2;
    if (constants.x1Norm && constants.x2Norm) {
        p1 = [constants.x1Norm(pp1[0]), constants.x2Norm(pp1[1])];
        p2 = [constants.x1Norm(pp2[0]), constants.x2Norm(pp2[1])];
    } else {
        p1 = pp1.map(a => constants.xNorm(a));
        p2 = pp2.map(a => constants.xNorm(a));
    }


    const d = p1.map((e, i) => {
        return Math.pow(e - p2[i], 2)
    });
    const k = d.reduce((a, b) => a + b);
    return Math.sqrt(k);
}