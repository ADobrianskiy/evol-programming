
const plotly = require('plotly')('adobrianskiy','Shtl8Awk08ka5360eLZH');
const fs = require('fs');


export function drawBrowserChart(funct, min, max, statistic, container){
    const figure = computeChartData(funct, min, max, statistic);
    Plotly.plot( container, figure);
}

export function drawChart(funct, min, max, statistic, name){
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
    });
}

export function computeChartData(funct, min, max, statistic){
    const step = 0.001;
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


export function draw3dChart(funct, min, max, statistic, name){
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
    });
}
export function draw3dBrowserChart(funct, min, max, statistic, container){
    const figure = compute3dChartData(funct, min, max, statistic);
    Plotly.plot( container, figure);
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
        localPicks.y.push(funct(seed[1]))
        localPicks.z.push(funct(seed))
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