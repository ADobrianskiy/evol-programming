import {getNumberFromBytes} from "./helpers";

export function deba1(x) {
    return Math.pow(Math.sin(5 * Math.PI * x), 6);
}

export function deba1Extender(statistic, data, constants) {
    const globalPicks = [0.1, 0.3, 0.5, 0.7, 0.9];
    const localPicks = [];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}

function basicExtender(statistic, data, constants, globalPicks, localPicks) {
    let gp = 0;
    let lp = 0;

    statistic.seeds.forEach(seed => {
        const isGP = seed.every(n => {
            return globalPicks.indexOf(n) !== -1
        });
        if (isGP) gp++;
    });

    statistic.nseeds = gp + lp;
    statistic.np = gp + lp;
    statistic.gp = gp;
    statistic.pr = statistic.np / statistic.nseeds;
    statistic.gpr = statistic.gp / globalPicks.length;

    if (localPicks.length) {
        statistic.lp = lp;
        statistic.lpr = statistic.lp / localPicks.length;
    }

    statistic.fpr = (statistic.nseeds - statistic.np) / statistic.nseeds;
}

export function deba2(x) {
    return Math.exp(-2 * Math.log(2) * Math.pow((x - 0.1) / 0.8, 2)) * deba1(x);

}

export function deba3(x) {
    return Math.pow(Math.sin(5 * Math.PI * (Math.pow(x, 0.75) - 0.05)), 6);
}

export function deba4(x) {
    return Math.exp(-2 * Math.log(2) * Math.pow((x - 0.08) / 0.854, 2)) * deba3(x);
}

export function health(deba, bytes) {
    var xs = getNumberFromBytes(bytes);
    return xs.map(x => deba(x))
            .reduce((a, b) => a + b)
        / xs.length;
}