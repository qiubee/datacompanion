import { getOBAData } from "./api.js";
import * as storage from "../utils/storage.js";

async function cleanOBAData() {
    const rawOBAData = await getOBAData();
    if (rawOBAData === undefined) {
        return;
    }
    // console.log("Raw weather data:", rawWeatherData);
    const filteredOBAData = filterOBAData(rawOBAData);
    // console.log("Filtered weather data:", filteredWeatherData);
    const transformedOBAData = transformOBAData(filteredOBAData);
    // console.log("Transformed weather data:", transformedWeatherData);
    return transformedOBAData;
}

function filterOBAData() {
    return;
}

function transformOBAData() {
    return;
}

export async function obaData() {
    const results = await cleanOBAData();
    if (results === undefined) {
        return;
    }
    const key = "search-results";
    if (storage.checkInStorage(key) === false) {
        storage.addToStorage(key, results);
        return results;
        } else if ((storage.checkInStorage(key) === true)) {
            return storage.getFromStorage(key);
        }
}

export function checkCompanion() {
    if (storage.checkInStorage("companion", localStorage)) {
        return true;
    } else {
        return false;
    }
}

export function getCompanion(element) {
        const name = element.value;
        storage.addToStorage("companion", name, localStorage);
}

export function companion() {
    return storage.getFromStorage("companion", localStorage);
}

