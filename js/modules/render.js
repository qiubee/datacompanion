import { getCompanion, books } from "./data.js";
import { goToPage } from "./router.js";
import { deleteElement, deleteChildElements, addElementWithText, createElement } from "../utils/element.js";
import { loading } from "./UI.js";
import { getFromStorage } from "../utils/storage.js";

export function overview() {
    const body = document.querySelector("body");
    deleteChildElements(body, "h1");
    deleteChildElements(body, "form");
    body.setAttribute("id", "overview");
    createOverview();
}

export function chooseCompanion() {
    const companions = document.querySelectorAll("label[data-companion=\"companion\"] input");
    Array.from(companions).map(function (label) {
        label.addEventListener("click", async function () {
            const selected = this.parentNode;
            getCompanion(this);
            await viewCompanion(selected, 2500);
            goToPage("overview");
        });
    });
}

async function viewCompanion(selectedCompanion, duration = 5000) {
    const h1 = document.querySelector("h1");
    return new Promise (function (res, rej) {
        selectedCompanion.classList.toggle("selected");
        const unselected = document.querySelector("label[data-companion=\"companion\"]:not(.selected)");
        h1.classList.toggle("reposition");
        unselected.classList.toggle("unselected");
        setTimeout(function () {
            h1.textContent = "Jouw datahulpje";
        }, 500);
        setTimeout(function () {
            deleteElement(unselected.querySelector("span"));
            deleteElement(unselected.querySelector("input"));
        }, 275);
        setTimeout(function () {
            res();
        }, duration);
    });
}

function createOverview() {
    createInformationDisplay();
    createRecommendations();
}

function createInformationDisplay() {
    const body = document.querySelector("body");
    const div = body.insertAdjacentElement("afterbegin", createElement("div"));
    // add companion to div
    div.setAttribute("data-companion", getFromStorage("companion", localStorage));
    addElementWithText(div, "h2", "Jouw informatie");
    const information = `
    `;
}

async function createRecommendations() {
    const body = document.querySelector("body");
    const div = body.insertAdjacentElement("afterbegin", createElement("div"));
    addElementWithText(div, "h1", "Boeken");
    addPopularBookSection(div);
}

async function addPopularBookSection(parentElement) {
    const section = addElementWithText(parentElement, "section");
    loading(true, section);

    // fetching popular books
    const popularBooks = await books("populair");
    errorHandle(section, popularBooks, "Laden van populaire boeken mislukt.");
    if (popularBooks === undefined) {
        return;
    }

    // add popular books if data is fetched
    addElementWithText(section, "h2", "Populair");
    const div = addElementWithText(section, "div");
    popularBooks.map(function (book) {
        addBookToDOM(div, book);
    });
}

function addBookToDOM(element, detail) {
    const book = `
    <article>
        <img src="${detail.cover}" alt="Kaft van het boek ${detail.title} van ${detail.authors[0].full}">
        <h3>${detail.title.split(":")[0]}</h3>
        <p>Van ${detail.authors[0].full !== undefined ? detail.authors[0].full : detail.publisher[0] }</p>
    <article>
    `;
    element.insertAdjacentHTML("beforeend", book);
}

function errorHandle(element, data, text) {
    if (data) {
        return loading(false, element);
    } else {
        loading(false, element);
        return addElementWithText(element, "p", text);
    }
}