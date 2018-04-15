import {health} from "./functions";
import {getNumberFromBytes} from "./helpers";

const seedDiff = 0.01;

export function getSeeds(data, constants) {
    const seeds = [];
    let population = data.population.slice();
    while (population.length) {
        population.sort((a, b) => {
            return health(constants.deba, a) - health(constants.deba, b);
        });

        const seed = population.pop();

        population = population.filter((e) => {
            return distance(seed, e) > seedDiff;
        });

        seeds.push(getNumberFromBytes(seed).map(e => e /  1e3));
    }
    return seeds;
}

export function distance(byte1, byte2) {
    const p1 = getNumberFromBytes(byte1).map(e => e /  1e3),
        p2 = getNumberFromBytes(byte2).map(e => e /  1e3);
    const d = p1.map((e, i) => {
        return Math.pow(e - p2[i], 2)
    });
    const k = d.reduce((a, b) => a + b);
    return Math.sqrt(k);
}