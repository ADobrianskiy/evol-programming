import {distanceBetweenPoints, getByteArray, getNumberFromBytes} from "./helpers";

export function deba1(x) {
    return Math.pow(Math.sin(5 * Math.PI * x), 6);
}

export function deba1Extender(statistic, data, constants) {
    const globalPicks = [{x: 0.1, y: 1}, {x: 0.3, y: 1}, {x: 0.5, y: 1}, {x: 0.7, y: 1}, {x: 0.9, y: 1}];
    const localPicks = [];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}

export function deba2Extender(statistic, data, constants) {
    const globalPicks = [{x: 0.1, y: 1}];
    const localPicks = [{x: 0.3, y: 0.9172}, {x: 0.5, y: 0.7078}, {x: 0.7, y: 0.4595}, {x: 0.9, y: 0.251}];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}

export function deba3Extender(statistic, data, constants) {
    const globalPicks = [{x: 0.080, y: 1}, {x: 0.247, y: 1}, {x: 0.451, y: 1}, {x: 0.681, y: 1}, {x: 0.934, y: 1}];
    const localPicks = [];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}

export function deba4Extender(statistic, data, constants) {
    const globalPicks = [{x: 0.080, y: 1}];
    const localPicks = [{x: 0.247, y: 0.948}, {x: 0.451, y: 0.77}, {x: 0.681, y: 0.503}, {x: 0.934, y: 0.25}];
    basicExtender(statistic, data, constants, globalPicks, localPicks);
}


function basicExtender(statistic, data, constants, globalPicks, localPicks) {
    const maxYDiff = 0.01,
        maxXDiff = 0.01;

    let gp = 0;
    let lp = 0;


    statistic.gps = [];
    statistic.lps = [];
    statistic.fps = [];

    statistic.seeds.forEach(seed => {
        const res = seed.reduce((acc, num) => {
            let x = num;
            const gp = globalPicks.find(e => {
                if (Math.abs(num - e.x) < maxXDiff) {
                    x = e.x;
                }
                return Math.abs(num - e.x) < maxXDiff;// && Math.abs(health(constants.deba, getByteArray(seed.map(e => e * 1000))) - e.y) < maxYDiff
            });
            const lp = localPicks.find(e => {
                if (Math.abs(num - e.x) < maxXDiff) {
                    x = e.x;
                }
                return Math.abs(num - e.x) < maxXDiff;
            });// && Math.abs(health(constants.deba, getByteArray(seed.map(e => e * 1000))) - e.y) < maxYDiff);
            if (gp) {
                acc.gp++;
            } else if (lp) {
                acc.lp++;
            }
            acc.x.push(x);
            return acc;
        }, {gp: 0, lp: 0, x: []});

        const xDistOk = distanceBetweenPoints(seed, res.x) < maxXDiff;

        let h1, h2;
        if (constants.xNorm) {
            h1 = constants.health(constants.deba, getByteArray(seed.map(e => constants.xNorm(e))));
            h2 = constants.health(constants.deba, getByteArray(res.x.map(e => constants.xNorm(e))))
        } else {
            h1 = constants.health(constants.deba, getByteArray(seed.map(e => e * 1000)));
            h2 = constants.health(constants.deba, getByteArray(res.x.map(e => e * 1000)))
        }
        ;
        const yDistOk = Math.abs(h1 - h2) < maxYDiff;
        if (res.gp === seed.length && xDistOk && yDistOk) {
            gp++;
            statistic.gps.push(seed);
        } else if (res.gp + res.lp === seed.length && xDistOk && yDistOk) {
            lp++;
            statistic.lps.push(seed);
        } else {
            statistic.fps.push(seed);
        }
    });

    statistic.nseeds = statistic.seeds.length;
    statistic.np = gp + lp;
    statistic.gp = gp;
    statistic.pr = statistic.np / statistic.nseeds;
    statistic.gpr = statistic.gp / globalPicks.length;

    if (localPicks.length) {
        statistic.lp = lp;
        statistic.lpr = statistic.lp / localPicks.length;
    }

    statistic.fpr = (statistic.nseeds - statistic.np) / statistic.nseeds;

    Object.keys(statistic).forEach(key => {
        if (statistic[key] === "undefined" || (isNaN(statistic[key]) && typeof statistic[key] === "number")) {
            delete statistic[key];
        }
    })
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

const cache = {};

export function numberHealth(deba, values) {
    return values.map(x => deba(x))
            .reduce((a, b) => a + b)
        / values.length;
}

export function debaHealth(deba, bytes) {
    const id = deba.name + bytes.join();
    if (cache[id]) {
        return cache[id];
    }

    const xs = getNumberFromBytes(bytes).map(e => e / 1e3);
    const res = numberHealth(deba, xs);

    cache[id] = res;

    return res;
}

export function f46Health(deba, bytes) {
    const id = deba.name + bytes.join();
    if (cache[id]) {
        return cache[id];
    }

    const xs = getNumberFromBytes(bytes);
    const res = deba(f46X1Norm(xs[0]), f46X2Norm(xs[1]));

    cache[id] = res;

    return res;
}

export function sheckelsHealth(deba, bytes) {
    const id = deba.name + bytes.join();
    if (cache[id]) {
        return cache[id];
    }

    const xs = getNumberFromBytes(bytes);
    const res = deba(sheckelsXNorm(xs[0]), sheckelsXNorm(xs[1]));

    cache[id] = res;

    return res;
}

export function f42Health(deba, bytes) {
    const id = deba.name + bytes.join();
    if (cache[id]) {
        return cache[id];
    }

    const xs = getNumberFromBytes(bytes);
    const res = deba(xNormConst(-2.5, 3)(xs[0]), xNormConst(-2, 2)(xs[1]));

    cache[id] = res;

    return res;
}

export function f45Health(deba, bytes) {
    const id = deba.name + bytes.join();
    if (cache[id]) {
        return cache[id];
    }

    const xs = getNumberFromBytes(bytes);
    const res = deba(xNormConst(-6, 6)(xs[0]), xNormConst(-6, 6)(xs[1]));

    cache[id] = res;

    return res;
}

export function f24Health(deba, bytes) {
    const id = deba.name + bytes.join();
    if (cache[id]) {
        return cache[id];
    }

    const xs = getNumberFromBytes(bytes);
    const res = deba(xNormConst(-10, 10)(xs[0]), xNormConst(-10, 10)(xs[1]));

    cache[id] = res;

    return res;
}

export function generalHealth(xNorm, deba, bytes) {
    const xs = getNumberFromBytes(bytes);
    const res = deba(xs.map(e => xNorm(e)));

    return res;
}

export function f31Health(deba, bytes) {
    const id = deba.name + bytes.join();
    if (cache[id]) {
        return cache[id];
    }

    const xs = getNumberFromBytes(bytes);
    const res = deba(xs.map(e => f31XNorm(e)));

    cache[id] = res;

    return res;
}

export function f46X1Norm(x1) {
    return round((x1 - 500) / 500 * 3, 3);
}


export function f46X2Norm(x2) {
    return round((x2 - 500) / 500 * 2, 3);
}

export function round(num, n) {
    return Math.round(num * Math.pow(10, n)) / Math.pow(10, n);
}

export function f46X1Denorm(x1) {
    return Math.round(x1 / 3 * 500 + 500);
}

export function f46X2Denorm(x2) {
    return Math.round(x2 / 2 * 500 + 500);
}


export function sheckelsXNorm(x2) {
    let x = round((x2 - 500) / 500 * 65.536, 3);
    if (x < -65.536) {
        x = -65.536;
    }
    if (x > 65.536) {
        x = 65.536;
    }
    return x;
}

export function sheckelsXDenorm(x1) {
    return Math.round(x1 / 65.536 * 500 + 500);
}

export function f31XNorm(x1) {
    return (x1 - 500) / 500 * 10;
}

export function f31Denorm(x1) {
    return Math.round(x1 / 10 * 500 + 500);
}

export function d6XNorm(max, x1) {
    let x = round(x1 / max * 30, 6);
    if (x > 30) {
        x = 30
    }
    return x;
}

export function d6Denorm(max, x1) {
    return Math.round(x1 / 30 * max);
}


export function rastriginXNorm(x2) {
    let x = round((x2 - 500) / 500 * 5.12, 3);
    if (x < -5.12) {
        x = -5.12;
    }
    if (x > 5.12) {
        x = 5.12;
    }
    return x;
}

export function rastriginDenorm(x1) {
    return Math.round(x1 / 5.12 * 500 + 500);
}



export function xNormConst(min, max) {
    return function(x) {
        const d = max - min;

        let r = (x / 1000) * d + min;
        if(r < min) {
            r= min;
        }
        if(r > max) {
            r= max;
        }
        return r;
    }
}


export function xDenormConst(min, max) {
    return function(x) {
        const d = max - min;

        let r = (x - min)  / d * 1000;

        return Math.round(r);
    }
}

export function f46(x1, x2) {
    return -((4 - 2.1 * x1 * x1 + Math.pow(x1, 4) / 3) + x1 * x1 + x1 * x2 + 4 * (x2 * x2 - 1) * x2 * x2);
}

export function f46Extender(statistic, data, constants) {
    const globalPicks = [{x1: -0.0898, x2: 0.7126, y: 1.031628453}, {x1: 0.0898, x2: -0.7126, y: 1.0316328453}];
    const localPicks = [{x1: -1.7036, x2: 0.7961, y: 0.2155}, {x1: 1.7036, x2: -0.7961, y: 0.2155}
        , {x1: -1.6071, x2: -0.5687, y: -2.1043}, {x1: 1.6071, x2: 0.5687, y: -2.1043}];
    basicBinaryExtender(statistic, data, constants, globalPicks, localPicks, f46X1Denorm, f46X2Denorm);
}

// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

export function f43(x1, x2) {
    return 3 * Math.sin(0.5 * x1 * Math.PI + 0.5 * Math.PI) * (2 - Math.sqrt(x1 * x1 + x2 * x2)) / 4;
}

export function f43Extender(statistic, data, constants) {
    const globalPicks = [{x1: 0, x2: 0, y: 1.5}];
    const localPicks = [{x1: 2, x2: 2, y: 0.62132034}, {x1: 2, x2: -2, y: 0.62132034},
        {x1: -2, x2: 2, y: 0.62132034}, {x1: -2, x2: -2, y: 0.62132034}];
    basicBinaryExtender(statistic, data, constants, globalPicks, localPicks, f46X1Denorm, f46X1Denorm);
}

export function f42(x1, x2) {
    return Math.sin(2.2 * Math.PI * x1 + 0.5 * Math.PI) * (2 - Math.abs(x2)) * (3 - Math.abs(x1))/4 +
        Math.sin(0.5 * Math.PI * x2 * x2 + 0.5 * Math.PI) * (2 - Math.abs(x2)) * (2 - Math.abs(x1))/4;
}

export function f42Extender(statistic, data, constants) {
    const globalPicks = [{x1: 0, x2: 0, y: 2.5}];
    const localPicks = [
        {x1: 0.889286, x2: 0, y: f42(0.889286, 0)},
        {x1: -0.889286, x2: 0, y: f42(-0.889286, 0)},
        {x1: 1.7839142, x2: 0, y: f42(1.7839142, 0)},
        {x1: -1.7839142, x2: 0, y: f42(-1.7839142, 0)}
    ];
    basicBinaryExtender(statistic, data, constants, globalPicks, localPicks, f46X1Denorm, f46X1Denorm);
}

export function f45(x1, x2) {
    return 200 - Math.pow(x1 * x1 + x2 - 11, 2) -  Math.pow(x1 + x2 * x2 - 7, 2);
}

export function f45Extender(statistic, data, constants) {
    const globalPicks = [
        {x1: 3, x2: 2, y: f45(3,2)},
        {x1: 3.58442834, x2: -1.84812653, y: f45(3.58442834, -1.84812653)},
        {x1: -3.77931025, x2: -3.28318599, y: f45(-3.77931025, -3.28318599)},
        {x1: -2.80511809, x2: 3.13131252, y: f45(-2.80511809,3.13131252)},

    ];


    const localPicks = [ ];
    basicBinaryExtender(statistic, data, constants, globalPicks, localPicks, f46X1Denorm, f46X1Denorm);
}


export function f24(x1, x2) {
    const x = [x1, x2];
    const res = - x.reduce((acc, el) => {
        const a = Array(5).fill(0).reduce((acc,e, jj)=>{
            const j = jj +1;
            return acc + j * Math.cos((j + 1) * el + j)
        }, 0);
        return acc * a;
    }, 1);

    return res;
}

export function f24Extender(statistic, data, constants) {
    const globalPicks = [
        {x1: -7.0835, x2: 4.8580, y: f24(-7.0835,4.8580)}, {x1: -7.0835, x2: -7.7084, y: f24(-7.0835, -7.7084)},

        {x1: -1.4251, x2: -7.0835, y: f24(-1.4251, -7.0835)}, {x1: 5.4828, x2: 4.8580, y: f24(5.4828, 4.8580)},

        {x1: -1.4251, x2: -0.8003, y: f24(-1.4251,-0.8003)}, {x1: 4.8580, x2: 5.4828, y: f24(4.8580, 5.4828)},

        {x1: -7.7083, x2: -7.0835, y: f24(-7.7083, -7.0835)}, {x1: -7.0835, x2: -1.4251, y: f24( -7.0835, -1.4251)},

        {x1: -7.7083, x2: -0.8003, y: f24( -7.7083, -0.8003)}, {x1: -7.7083, x2: 5.4828, y: f24(-7.7083, 5.4828)},

        {x1: -0.8003, x2: -7.7083, y: f24(-0.8003, -7.7083)}, {x1: -0.8003, x2: -1.4251, y: f24(-0.8003, -1.4251)},

        {x1: -0.8003, x2: 4.8580, y: f24( -0.8003, 4.8580)}, {x1: -1.4251, x2: 5.4828, y: f24(-1.4251, 5.4828)},

        {x1: 5.4828, x2: -7.7083, y: f24(5.4828,-7.7083)}, {x1: 4.8580, x2: 4.8580, y: f24(4.8580, 4.8580)},

        {x1: 5.4828, x2: -1.4251, y: f24(5.4828, -1.4251)}, {x1: 4.8580, x2: -0.8003, y: f24(4.8580, -0.8003)},

    ];


    const localPicks = [ ];
    basicBinaryExtender(statistic, data, constants, globalPicks, localPicks, f46X1Denorm, f46X1Denorm);
}



export function sheckels(x1, x2) {
    const a = (i) => {
        return 16 * Math.floor(i % 5 - 2);
    };
    const b = (i) => {
        return 16 * Math.floor(i / 5 - 2);
    };

    const hell = 0.002 +
        Array(24).fill(0)
            .reduce((acc, el, index) => {
                const i = index + 1;
                return acc + 1 / (1 + i + Math.pow(x1 - a(i), 6) + Math.pow(x2 - b(i), 6))
            }, 0);

    return 500 - 1 / hell;
}

export function sheckelsPicks() {
    const globalPicks = [{
        x1: -32,
        x2: -32,
        y: sheckels(-32, -32)
    }];

    const lp = [[-32, -16], [-32, 0], [-32, 16], [-32, 32], [-16, -32], [-16, -16], [-16, 0], [-16, 16], [-16, 32], [0, -32], [0, -16], [0, 0], [0, 16], [0, 32], [16, -32], [16, -16], [16, 0], [16, 16], [16, 32], [32, -32], [32, -16], [32, 0], [32, 16], [32, 32]]
    const localPicks = lp.map((e) => {
        return {
            x1: e[0],
            x2: e[1],
            y: sheckels(e[0], e[1])
        }
    });

    localPicks.push(globalPicks[0]);
    return localPicks;
}

export function sheckelsExtender(statistic, data, constants) {

    const globalPicks = [{
        x1: -32,
        x2: -32,
        y: sheckels(-32, -32)
    }];

    const lp = [[-32, -16], [-32, 0], [-32, 16], [-32, 32], [-16, -32], [-16, -16], [-16, 0], [-16, 16], [-16, 32], [0, -32], [0, -16], [0, 0], [0, 16], [0, 32], [16, -32], [16, -16], [16, 0], [16, 16], [16, 32], [32, -32], [32, -16], [32, 0], [32, 16], [32, 32]]
    const localPicks = lp.map((e) => {
        return {
            x1: e[0],
            x2: e[1],
            y: sheckels(e[0], e[1])
        }
    });

    basicBinaryExtender(statistic, data, constants, globalPicks, localPicks, sheckelsXDenorm, f46X1Denorm);
}

export function f31(xs) {
    if (!Array.isArray(xs)) {
        xs = [xs];
    }
    const a = xs.reduce((a, e) => a + Math.abs(e), 0);
    const b = Math.exp(-xs.reduce((a, e) => a + e * e, 0));
    return round(a * b, 6);
}

export function f31Extender(statistic, data, constants) {
    const dim = data.dimensions;
    let globalPicks = [];
    if (dim === 1) {
        const gpv = f31(1 / Math.sqrt(2));
        globalPicks = [{x: 1 / Math.sqrt(2), y: gpv}, {x: 1 / Math.sqrt(2), y: -gpv}];
    } else if (dim === 2) {
        globalPicks = [
            {x: [0.5, 0.5], y: f31([0.5, 0.5])},
            {x: [0.5, -0.5], y: f31([0.5, -0.5])},
            {x: [-0.5, 0.5], y: f31([-0.5, 0.5])},
            {x: [-0.5, -0.5], y: f31([-0.5, -0.5])}
        ];
    }
    const localPicks = [];
    basicExtender2(statistic, data, constants, globalPicks, localPicks, f31Denorm);
}


export function d6(xs) {
    if (!Array.isArray(xs)) {
        xs = [xs];
    }
    const x = xs[0];

    if (x < 2.5) {
        return 80 * (2.5 - x);
    } else if (x < 5) {
        return 64 * (x - 2.5);
    } else if (x < 7.5) {
        return 64 * (7.5 - x);
    } else if (x < 12.5) {
        return 28 * (x - 7.5);
    } else if (x < 17.5) {
        return 28 * (17.5 - x);
    } else if (x < 22.5) {
        return 32 * (x - 17.5);
    } else if (x < 27.5) {
        return 32 * (27.5 - x);
    } else if (x <= 30) {
        return 80 * (x - 27.5);
    }
    if (x > 30) {
        console.log(x);
    }
    return 0;
}

export function d6Extender(statistic, data, constants) {
    let globalPicks = [
        {x: [0], y: 30},
        {x: [30], y: 30}
    ];

    const localPicks = [];
    basicExtender2(statistic, data, constants, globalPicks, localPicks, f31Denorm);
}

export function rastrigin(xs) {
    if (!Array.isArray(xs)) {
        xs = [xs];
    }

    const n = xs.length;
    return xs.reduce((acc, v) => {
        return acc + (10 * Math.cos(2 * Math.PI * v) - v * v)
    }, 0) - 10 * n;
}

export function rastriginExtender(statistic, data, constants) {
    const dim = constants.dimension;

    let globalPicks = [
        {x: Array(dim).fill(0), y: 0}
    ];


    const xs = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
    const localPicks = dim === 1? xs : [[1], [-1], [2], [-2], [3], [-3], [4], [-4], [5], [-5]];

    for(var i = 0; i < dim - 1; i++){
        localPicks.reduce((acc, e) => {
            xs.forEach(i => {
                var t = e.slice();
                t.push(i);
                acc.push(t);

            });
            return acc;
        }, [])
    }

    let lps = localPicks.map(e => {
        if (!Array.isArray(e)) {
            e = [e];
        }
        return {
            x: e,
            y: rastrigin(e)
        }
    });

    basicExtender2(statistic, data, constants, globalPicks, lps, rastriginDenorm);
}

export function f28(xs) {
    if (!Array.isArray(xs)) {
        xs = [xs];
    }

    const n = xs.length;
    return 1 / n * xs.reduce((acc, x) => {
        return acc + Math.sin(10 * Math.log(x))
    }, 0)
}

export function f28Extender(statistic, data, constants) {
    const dim = constants.dimension;

    let globalPicks = [
        {x: Array(dim).fill(0), y: 0}
    ];

    const localPicks = [];

    basicExtender2(statistic, data, constants, globalPicks, localPicks, rastriginDenorm);
}

export function rastriginMod(xs) {
    if (!Array.isArray(xs)) {
        xs = [xs];
    }
    return - 10 - 9 * Math.cos(6 * Math.PI* xs[0]) - 10 - 9 * Math.cos(8 * Math.PI* xs[1])
}

export function rastriginModExtender(statistic, data, constants) {
    const dim = constants.dimension;

    let globalPicks = [
        {x: [1/6, 1/8], y: -2},
        {x: [1/6, 3/8], y: -2},
        {x: [1/6, 5/8], y: -2},
        {x: [1/6, 7/8], y: -2},


        {x: [3/6, 1/8], y: -2},
        {x: [3/6, 3/8], y: -2},
        {x: [3/6, 5/8], y: -2},
        {x: [3/6, 8/8], y: -2},


        {x: [5/6, 1/8], y: -2},
        {x: [5/6, 3/8], y: -2},
        {x: [5/6, 5/8], y: -2},
        {x: [5/6, 7/8], y: -2},
    ];

    const localPicks = [];

    basicExtender2(statistic, data, constants, globalPicks, localPicks, rastriginDenorm);
}

function basicBinaryExtender(statistic, data, constants, globalPicks, localPicks, x1Denorm, x2Denorm) {
    const maxYDiff = 0.01,
        maxXDiff = 0.01;

    let gp = 0;
    let lp = 0;


    statistic.gps = [];
    statistic.lps = [];
    statistic.fps = [];

    statistic.seeds.forEach(seed => {

        const test = (a) => {
            const yDiff = constants.health(constants.deba, getByteArray([x1Denorm(seed[0]), x2Denorm(seed[1])])) -
                constants.health(constants.deba, getByteArray([x1Denorm(a.x1), x2Denorm(a.x2)]));
            return Math.sqrt(Math.pow(Math.abs(a.x1 - seed[0]), 2) + Math.pow(Math.abs(a.x2 - seed[1]), 2)) < maxXDiff
                && Math.abs(yDiff) < maxYDiff;
        };
        const isGlobal = globalPicks.find((a) => {
            return test(a);
        });
        const isLocal = localPicks.find((a) => {
            return test(a);
        });

        if (isGlobal) {
            gp++;
            statistic.gps.push(seed);
        } else if (isLocal) {
            lp++;
            statistic.lps.push(seed);
        } else {
            statistic.fps.push(seed);
        }
    });

    statistic.nseeds = statistic.seeds.length;
    statistic.np = gp + lp;
    statistic.gp = gp;
    statistic.pr = statistic.np / statistic.nseeds;
    statistic.gpr = statistic.gp / globalPicks.length;

    if (localPicks.length) {
        statistic.lp = lp;
        statistic.lpr = statistic.lp / localPicks.length;
    }

    statistic.fpr = (statistic.nseeds - statistic.np) / statistic.nseeds;

    Object.keys(statistic).forEach(key => {
        if (statistic[key] === "undefined" || (isNaN(statistic[key]) && typeof statistic[key] === "number")) {
            delete statistic[key];
        }
    })
}

function basicExtender2(statistic, data, constants, globalPicks, localPicks, xDenorm,) {
    const maxYDiff = 0.01,
        maxXDiff = 0.01;

    let gp = 0;
    let lp = 0;


    statistic.gps = [];
    statistic.lps = [];
    statistic.fps = [];

    statistic.seeds.forEach(seed => {

        const test = (a) => {
            const yDiff = constants.health(constants.deba, getByteArray(seed.map(e => xDenorm(e)))) -
                constants.health(constants.deba, getByteArray(a.x.map(e => xDenorm(e))));
            return distanceBetweenPoints(a.x, seed) < maxXDiff
                && Math.abs(yDiff) < maxYDiff;
        };
        const isGlobal = globalPicks.find((a) => {
            return test(a);
        });
        const isLocal = localPicks.find((a) => {
            return test(a);
        });

        if (isGlobal) {
            gp++;
            statistic.gps.push(seed);
        } else if (isLocal) {
            lp++;
            statistic.lps.push(seed);
        } else {
            statistic.fps.push(seed);
        }
    });

    statistic.nseeds = statistic.seeds.length;
    statistic.np = gp + lp;
    statistic.gp = gp;
    statistic.pr = statistic.np / statistic.nseeds;
    statistic.gpr = statistic.gp / globalPicks.length;

    if (localPicks.length) {
        statistic.lp = lp;
        statistic.lpr = statistic.lp / localPicks.length;
    }

    statistic.fpr = (statistic.nseeds - statistic.np) / statistic.nseeds;

    Object.keys(statistic).forEach(key => {
        if (statistic[key] === "undefined" || (isNaN(statistic[key]) && typeof statistic[key] === "number")) {
            delete statistic[key];
        }
    })
}