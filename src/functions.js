import {getNumberFromBytes} from "./helpers";

export function deba1(x) {
    return Math.pow(Math.sin(5 * Math.PI * x), 6);
}

export function deba1Extender(statistic, data, constants) {
    const globalPicks = [{x: 0.1, y:1}, {x: 0.3, y:1}, {x: 0.5, y:1}, {x: 0.7, y:1}, {x: 0.9, y:1}];
    const localPicks = [];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}

export function deba2Extender(statistic, data, constants) {
    const globalPicks = [{x: 0.1, y:1}];
    const localPicks = [{x: 0.3, y:0.9172}, {x: 0.5, y:0.7078}, {x: 0.7, y:0.4595}, {x: 0.9, y:0.251}];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}

export function deba3Extender(statistic, data, constants) {
    const globalPicks = [{x: 0.080, y: 1},{x: 0.247, y:1}, {x: 0.451, y:1} ,{x: 0.681, y:1},{x:  0.934, y:1}];
    const localPicks = [];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}

export function deba4Extender(statistic, data, constants) {
    const globalPicks = [{x: 0.080, y: 1}];
    const localPicks = [{x: 0.247, y:0.948}, {x: 0.451, y:0.77} ,{x: 0.681, y:0.503},{x:  0.934, y:0.25}];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}


function basicExtender(statistic, data, constants, globalPicks, localPicks) {
    const maxYDiff = 0.01,
       maxXDiff=0.01;

    let gp = 0;
    let lp = 0;


    statistic.seeds.forEach(seed => {
        const res = seed.reduce((acc, num) => {
            const gp = globalPicks.find(e => Math.abs(num - e.x) < maxXDiff && Math.abs(health(constants.deba, seed) - e.y) < maxYDiff);
            const lp = globalPicks.find(e => Math.abs(num - e.x) < maxXDiff && Math.abs(health(constants.deba, seed) - e.y) < maxYDiff);
            if(gp) acc.gp++;
            if(lp) acc.lp++;
            return acc;
        }, {gp: 0, lp: 0});

        if (res.gp === seed.length) gp++;
        if (res.gp + res.lp === seed.length) lp++;
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

const cache = {

};

export function health(deba, bytes) {
    const id = deba.name + bytes.join();
    if(cache[id]) {
        return cache[id];
    }

    const xs = getNumberFromBytes(bytes).map(e => e /  1e3);
    const res = xs.map(x => deba(x))
            .reduce((a, b) => a + b)
        / xs.length;
    cache[id] = res;

    return res;
}