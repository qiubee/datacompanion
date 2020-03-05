import { getBooks } from "./api.js";
import { addToStorage, getFromStorage, checkInStorage } from "../utils/storage.js";

function cleanBooksData(rawData) {
    // console.log("Raw book data:", rawData);
    const filteredData = filterBooksData(rawData);
    // console.log("Filtered:", filteredData);
    const transformedData = transformBooksData(filteredData);
    // console.log("Transformed:", transformedData);
    return transformedData;
}

function filterBooksData(rawBookData) {
    return rawBookData.results.map(function (book) {
        // filter object properties by key (source: https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6)transformed
        return Object.keys(book).filter(function (key) {
            return ["year", "description", "languages", "authorsDetailed", "coverimages", "summaries", "publisher", "titles", "subject-topical"].includes(key);
        })
        .reduce(function (obj, key) {
            obj[key] = book[key];
            return obj;
        }, {});
    });
}

function transformBooksData(transformedBookData) {
    return transformedBookData.map(function (book) {
        if (book.coverimages) {
            if (/c1322402$/g.test(book.coverimages[1])) {
                book.coverimages = book.coverimages[1];
            } else {
                const coverLink = /^https:\/\/cover\.biblion\.nl/g.test(book.coverimages[0]) === true ? book.coverimages[0].replace("size=70", "size=500") : book.coverimages[0];
                book.coverimages = coverLink;
            }
        }

        if (book.publisher !== undefined) {
            const publisher = book.publisher[0].split(", ");
            const publisherDetails = publisher.map(function (info) {
                return info.replace(/[\[\]]/g, "");
            });
            const year = publisherDetails.length - 1;
            publisherDetails[year] = Number(publisherDetails[year].replace(/[\[\]\?-]/g, ""));
            if (publisherDetails[year] === null || isNaN(publisherDetails[year])) {
                publisherDetails[year] = "Unknown";
            }
            book.publisher = publisherDetails;
        } else if (book.publisher === undefined) {
            book.publisher = "Uitgever onbekend";
        }

        if (book.description !== undefined) {
            book.description[0] = book.description[0].replace(/[axvgisn']/g, "").replace(/^, /g, "").slice(0, 5) + "agina's";
        }

        if (book.authorsDetailed === undefined) { book.authorsDetailed = "Auteur(s) onbekend"; }
        if (book.description === undefined) { book.description = "Geen beschrijving beschikbaar"; }

        book.summaries === undefined ? book.summaries = "Geen samenvatting beschikbaar" : book.summaries = book.summaries[0];

        book.year === undefined || /[a-zA-Z]/g.test(book.year) ? book.year = "Jaar onbekend" : book.year = Number(book.year);

        book.languages === undefined ? book.languages = "Taal onbekend" : book.languages[0];

        return {
            authors: book.authorsDetailed,
            cover: book.coverimages,
            description: book.description,
            language: book.languages,
            publisher: book.publisher,
            summary: book.summaries,
            title: book.titles[0],
            year: book.year
        };
    });
}

export async function books(topic) {
    if (checkInStorage(topic, localStorage) === true) {
        return getFromStorage(topic, localStorage);
        } else if (checkInStorage(topic, localStorage) === false) {
            const rawData = await getBooks(topic);
            if (rawData === undefined) {
                return;
            }
            const results = cleanBooksData(rawData);
            addToStorage(topic, results, localStorage);
            return results;
        }
}

export function checkCompanion() {
    if (checkInStorage("companion", localStorage)) {
        return true;
    } else {
        return false;
    }
}

export function getCompanion(element) {
        const name = element.value;
        addToStorage("companion", name, localStorage);
}

export function companion() {
    return getFromStorage("companion", localStorage);
}

