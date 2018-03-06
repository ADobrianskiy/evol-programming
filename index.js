require("source-map-support").install();
import {execute} from "./src/executor";
import {generateRandomPerson, getPopulationCount} from "./src/helpers";
import {deba1} from "./src/functions";
import {closestFromTheWorst1} from "./src/replaceStrategies";

const dataSample = {
    dimensions: 1,
    populationSize: getPopulationCount(1),
    population: Array(500).fill(0).map(() => {
        return generateRandomPerson();
    })
};
execute(dataSample, {f: deba1, p: closestFromTheWorst1});