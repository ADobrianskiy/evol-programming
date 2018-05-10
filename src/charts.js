
const plotly = require('plotly')('adobrianskiy','Shtl8Awk08ka5360eLZH');
const fs = require('fs');


export function drawBrowserChart(funct, min, max, statistic, container){
    const figure = computeChartData(funct, min, max, statistic);
    Plotly.plot( container, figure);
}

export function drawChart(funct, min, max, statistic, name){
    return new Promise((resolve) => {
        const figure = computeChartData(funct, min, max, statistic);
        const imgOpts = {
            format: 'png',
            width: 1000,
            height: 500
        };

        plotly.getImage(figure, imgOpts, function (error, imageStream) {
            if (error) return console.log (error);

            var fileStream = fs.createWriteStream(name);
            imageStream.pipe(fileStream);

            setTimeout(resolve, 2000);

        });
    });
}

export function computeChartData(funct, min, max, statistic){
    const step = 0.01;
    const trace = {
        x: [],
        y: [],
        type: "scatter",
        name: "Function",
    };
    let position = min;
    while(position <= max){
        trace.x.push(position);
        trace.y.push(funct(position));
        position += step;
    }

    var globalPicks = {
        x: [],
        y: [],
        mode: "markers",
        type: "scatter",
        name: "Global Picks Seeds",
    };

    statistic.gps.forEach((seed)=>{
        globalPicks.x.push(seed[0]);
        globalPicks.y.push(funct(seed[0]))
    });

    var localPicks = {
        x: [],
        y: [],
        mode: "markers",
        type: "scatter",
        name: "Local Picks Seeds",
    };
    statistic.lps.forEach((seed)=>{
        localPicks.x.push(seed[0]);
        localPicks.y.push(funct(seed[0]))
    });

    var incorrectPicks = {
        x: [],
        y: [],
        mode: "markers",
        marker: {
            color: "rgba(0, 0, 0, 0)",
            size: 12,
            line: {
                color: "black",
                width: 4
            }
        },
        name: "Wrong Pick Seeds",
        type: "scatter"
    };
    statistic.fps.forEach((seed)=>{
        incorrectPicks.x.push(seed[0]);
        incorrectPicks.y.push(funct(seed[0]))
    });

    const figure = { 'data': [trace, globalPicks, localPicks, incorrectPicks] };
    return figure;
}


export function draw3dBrowserChart(funct, min, max, statistic, container){
    const figure = compute3dChartData(funct, min, max, statistic);
    Plotly.plot( container, figure);
}
export function draw3dChart(funct, min, max, statistic, name){
    return new Promise((resolve) => {
        const figure = compute3dChartData(funct, min, max, statistic);
        const imgOpts = {
            format: 'png',
            width: 1000,
            height: 500
        };

        plotly.getImage(figure, imgOpts, function (error, imageStream) {
            if (error) return console.log (error);

            var fileStream = fs.createWriteStream(name);
            imageStream.pipe(fileStream);
            resolve();
        });
    });
}
export function compute3dChartData(funct, min, max, statistic){
    const step = 0.01;
    const trace = {
        x: [],
        y: [],
        z: [],
        type: "surface",
        name: "Function",
        width: 1,
        height: 1,
    };

    for(let y = min; y < max; y = y+step){
        trace.x.push([]);
        trace.y.push([]);
        trace.z.push([]);
        for(let x = min; x < max; x = x+step){
            trace.x[trace.x.length-1].push(x);
            trace.y[trace.y.length-1].push(y);
            trace.z[trace.z.length-1].push(funct([x,y]));
        }
    }

    var globalPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        type: "scatter3d",
        name: "Global Picks Seeds",
    };

    statistic.gps.forEach((seed)=>{
        globalPicks.x.push(seed[0]);
        globalPicks.y.push(seed[1]);
        globalPicks.z.push(funct(seed))
    });

    var localPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        type: 'scatter3d',
        name: "Local Picks Seeds",
    };
    statistic.lps.forEach((seed)=>{
        localPicks.x.push(seed[0]);
        localPicks.y.push(seed[1]);
        localPicks.z.push(funct(seed));
    });

    var incorrectPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        marker: {
            color: "rgba(0, 0, 0, 0)",
            size: 12,
            line: {
                color: "black",
                width: 4
            }
        },
        name: "Wrong Pick Seeds",
        type: "scatter3d"
    };
    statistic.fps.forEach((seed)=>{
        incorrectPicks.x.push(seed[0]);
        incorrectPicks.y.push(seed[1]);
        incorrectPicks.z.push(funct(seed));
    });

    const figure = { 'data': [trace, globalPicks, localPicks, incorrectPicks] };
    return figure;
}








export function draw3dChart2(funct, statistic, name, minX1, minX2, maxX1, maxX2, step, additionalPicks,zCeof,  flag){
    return new Promise((resolve) => {
        const figure = compute3dChartData2(funct, statistic, minX1, minX2, maxX1, maxX2, step, additionalPicks, zCeof);
        const imgOpts = {
            format: 'png'
        };

        plotly.getImage(figure, imgOpts, async function (error, imageStream) {
            if (error && flag && flag <=3) {
                await draw3dChart2(funct, statistic, name, minX1, minX2, maxX1, maxX2, step, additionalPicks, zCeof, flag? flag + 1: 1)
            } else {
                var fileStream = fs.createWriteStream(name);
                imageStream.pipe(fileStream);
            }

            resolve();
        });
    });
}

export function compute3dChartData2(funct, statistic, minX1, minX2, maxX1, maxX2, step2, additionalPicks, zCoef){
    const step = step2 || 0.01;
    zCoef = zCoef || 1;
    const trace = {
        x: [],
        y: [],
        z: [],
        type: "surface",
        name: "Function",
        width: 1,
        height: 1,
    };

    for(let x1 = minX1; x1 <= maxX1; x1 = x1+step){
        trace.x.push([]);
        trace.y.push([]);
        trace.z.push([]);
        for(let x2 = minX2; x2 <= maxX2; x2 = x2+step){
            trace.x[trace.x.length-1].push(x1);
            trace.y[trace.y.length-1].push(x2);
            trace.z[trace.z.length-1].push(funct(x1,x2) * zCoef);
        }
    }
    if(additionalPicks) {
        additionalPicks.forEach((r) => {
            trace.x.push([]);
            trace.y.push([]);
            trace.z.push([]);
            trace.x[trace.x.length - 1].push(r.x1);
            trace.y[trace.y.length - 1].push(r.x2);
            trace.z[trace.z.length - 1].push(r.y * zCoef);
        });
    }

    var globalPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        type: "scatter3d",
        name: "Global Picks Seeds",
    };

    statistic.gps.forEach((seed)=>{
        globalPicks.x.push(seed[0]);
        globalPicks.y.push(seed[1]);
        globalPicks.z.push(funct(seed[0],seed[1]) * zCoef)
    });

    var localPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        type: 'scatter3d',
        name: "Local Picks Seeds",
    };
    statistic.lps.forEach((seed)=>{
        localPicks.x.push(seed[0]);
        localPicks.y.push(seed[1]);
        localPicks.z.push(funct(seed[0],seed[1]) * zCoef);
    });

    var incorrectPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        marker: {
            color: "rgba(0, 0, 0, 0)",
            size: 12,
            line: {
                color: "black",
                width: 4
            }
        },
        name: "Wrong Pick Seeds",
        type: "scatter3d"
    };
    statistic.fps.forEach((seed)=>{
        incorrectPicks.x.push(seed[0]);
        incorrectPicks.y.push(seed[1]);
        incorrectPicks.z.push(funct(seed[0],seed[1]) * zCoef);
    });

    const figure = { 'data': [trace, globalPicks, localPicks, incorrectPicks] };
    return figure;
}



export function compute3dChartData3(funct, statistic, min, max, step, zCoef){
    step = step || 0.1;
    zCoef = zCoef || 1;
    const trace = {
        x: [],
        y: [],
        z: [],
        type: "surface",
        name: "Function",
        width: 1,
        height: 1,
    };

    for(let y = min; y < max; y = y+step){
        trace.x.push([]);
        trace.y.push([]);
        trace.z.push([]);
        for(let x = min; x < max; x = x+step){
            trace.x[trace.x.length-1].push(x);
            trace.y[trace.y.length-1].push(y);
            trace.z[trace.z.length-1].push(funct([x,y]) * zCoef);
        }
    }

    var globalPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        type: "scatter3d",
        name: "Global Picks Seeds",
    };

    statistic.gps.forEach((seed)=>{
        globalPicks.x.push(seed[0]);
        globalPicks.y.push(seed[1]);
        globalPicks.z.push(funct(seed[0],seed[1]) * zCoef)
    });

    var localPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        type: 'scatter3d',
        name: "Local Picks Seeds",
    };
    statistic.lps.forEach((seed)=>{
        localPicks.x.push(seed[0]);
        localPicks.y.push(seed[1]);
        localPicks.z.push(funct(seed[0],seed[1]) * zCoef);
    });

    var incorrectPicks = {
        x: [],
        y:[],
        z:[],
        mode: "markers",
        marker: {
            color: "rgba(0, 0, 0, 0)",
            size: 12,
            line: {
                color: "black",
                width: 4
            }
        },
        name: "Wrong Pick Seeds",
        type: "scatter3d"
    };
    statistic.fps.forEach((seed)=>{
        incorrectPicks.x.push(seed[0]);
        incorrectPicks.y.push(seed[1]);
        incorrectPicks.z.push(funct(seed[0],seed[1]) * zCoef);
    });

    const figure = { 'data': [trace, globalPicks, localPicks, incorrectPicks] };
    return figure;
}

export function draw3dChart3(funct, statistic, name, minX1, minX2, maxX1, maxX2, step, zCoef){
    return new Promise((resolve) => {
        const figure = compute3dChartData3(funct, statistic, minX1, minX2, maxX1, maxX2,step, zCoef);
        const imgOpts = {
            format: 'png',
            width: 1000,
            height: 500
        };

        plotly.getImage(figure, imgOpts, function (error, imageStream) {
            if (error) return console.log (error);

            var fileStream = fs.createWriteStream(name);
            imageStream.pipe(fileStream);
            resolve();
        });
    });
}