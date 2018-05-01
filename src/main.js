import {execute} from "./executor";
import {
    deba1, deba1Extender, deba2, deba2Extender, deba3, deba3Extender, deba4, deba4Extender,
    numberHealth
} from "./functions";
import {closestFromRandoms, closestFromTheWorst1, closestFromTheWorst2, worstFromTheClosest} from "./replaceStrategies";
import {generateData} from "./helpers";
import {draw3dBrowserChart, drawBrowserChart} from "./charts";

const functions = [deba1, deba2, deba3, deba4];
const extenders = [deba1Extender, deba2Extender, deba3Extender, deba4Extender];
const strategies = [closestFromTheWorst1, closestFromTheWorst2, closestFromRandoms, worstFromTheClosest];

window.execute = function () {
    const funct = parseInt(document.getElementById("select-function").value);
    const strategy = parseInt(document.getElementById("select-strategy").value);
    const iterations = parseInt(document.getElementById("input-iterations").value);
    const dimensions = parseInt(document.getElementById("input-dimensions").value);

    const statistic = [];
    if (!isNaN(funct) && !isNaN(strategy) && !isNaN(iterations) && !isNaN(dimensions)) {
        onExecutionStart();
        setTimeout(() => {
            const config = {
                deba: functions[funct],
                extender: extenders[funct],
                p: strategies[strategy]
            };

            for (let i = 0; i < iterations; i++) {
                const res = execute(generateData(dimensions, i), config);
                statistic.push(res);
                addStatistic(res, dimensions, i, config.deba);
            }
        }, 100);
    }
    window.configurations = [{statistic: statistic}];
    onTestComplete();
};

function onExecutionStart() {
    $(".selectors").hide();
    $(".progress").show();
    $(".statistic").html("");
    $(".statistic").show();
}

function addStatistic(statistic, dimensions, i, funct) {
    const row = $(".statistic-template").clone();
    row.removeClass("statistic-template");

    if (dimensions < 3) {
        row.find(".plot-container").show();
        row.find(".plot-container").attr("id", "plot-" + i);
        if (dimensions === 1) {
            drawBrowserChart(funct, 0, 1, statistic, row.find(".plot-container")[0]);
        }
        if (dimensions === 2) {
            draw3dBrowserChart(numberHealth.bind(null, funct), 0, 1, statistic, row.find(".plot-container")[0]);
        }
    }
    row.find(".statistic-expander").text("Statistic" + i + 1);
    row.find(".statistic-expander").attr("data-target", "#statistic-" + i);
    row.find(".statistic-expand").attr("id", "statistic-" + i);

    row.find(".input-nfe").val(statistic.nfe);
    row.find(".input-nseeds").val(statistic.nseeds);
    row.find(".input-np").val(statistic.np);
    row.find(".input-gp").val(statistic.gp);
    row.find(".input-lp").val(statistic.lp);
    row.find(".input-pr").val(statistic.pr);
    row.find(".input-gpr").val(statistic.gpr);
    row.find(".input-lpr").val(statistic.lpr);
    row.find(".input-fpr").val(statistic.fpr);

    row.find(".input-reason-of-stop").val(statistic.reason);

    $(".statistic").append(row);
}

function onTestComplete() {
    $(".get-excel").show();
}

window.getExcel = function () {
    const body = {configurations: window.configurations};
    fetch("/api/xlsx", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(function (res) {
        res.json().then(function (body) {
            download("statistic.xlsx", window.location + body.url);
        })
    });

};

window.download = function (filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', text);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}