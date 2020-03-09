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

async function createInformationDisplay() {
    const body = document.querySelector("body");
    const div = body.insertAdjacentElement("afterbegin", createElement("div"));
    // add companion to div
    div.setAttribute("data-companion", getFromStorage("companion", localStorage));
    addInformationSection(div);
}

async function createRecommendations() {
    const body = document.querySelector("body");
    const div = body.insertAdjacentElement("afterbegin", createElement("div"));

    // place oba logo
    const logo = addElementWithText(div, "img");
    logo.setAttribute("src", "../img/oba-logo.jpg");
    logo.setAttribute("alt", `De letters "O", "B" en "A" die samen het logo van de Openbare Bibliotheek Amsterdam vormen`);

    // add recommendations page
    const recommendations = addElementWithText(div, "div");
    addElementWithText(recommendations, "h1", "Boeken");
    addPopularBookSection(recommendations);
}

async function addInformationSection(parentElement) {
    const section = addElementWithText(parentElement, "section");
    addElementWithText(section, "h2", "Jouw informatie");
    loading(true, section, "Informatie aan het ophalen...");
    await new Promise (function (res, rej) {
        setTimeout(function () {
            res();
        }, 2500);
    });
    addInformationToDOM(section);
    loading(false, section);
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
    const populardiv = addElementWithText(section, "div");
    addElementWithText(populardiv, "h2", "Populair");
    addElementWithText(populardiv, "p", "Gebaseerd op leengeschiedenis");
    const booksdiv = addElementWithText(section, "div");
    popularBooks.map(function (book) {
        addBookToDOM(booksdiv, book);
    });
}

function addBookToDOM(element, detail) {
    const book = `
    <article>
        <header>
            <img src="${detail.cover}" alt="Kaft van het boek ${detail.title} van ${detail.authors[0].full}">
            <h3>${detail.title.split(":")[0].split("&")[0]}</h3>
        </header>
        <footer>
            <p>${detail.authors[0].full !== undefined ? "Geschreven door " + detail.authors[0].full : "Van uitgeverij " + detail.publisher[0]}</p>
        </footer>
    </article>
    `;
    element.insertAdjacentHTML("beforeend", book);
}

function addInformationToDOM(element) {
    const information = `
    <ul>
        <li><span>Naam</span><span>: </span><span>Peter Bouwer</span></li>
        <li><span>Initialen</span><span>: </span><span>P. B.</span></li>
        <li><span>Geslacht</span><span>: </span><span>Man</span></li>
        <li><span>Geboortedatum</span><span>: </span><span>04/08/1978</span></li>
        <li><span>Adres</span><span>: </span><span>Leeuwenhoekstraat</span></li>
        <li><span>Huisnummer</span><span>: </span><span>15</span></li>
        <li><span>Postcode</span><span>: </span><span>1087AT</span></li>
        <li><span>Woonplaats</span><span>: </span><span>Amsterdam</span></li>
        <li><span>Telefoonnummer</span><span>: </span><span>06-43024509</span></li>
        <li><span>E-mail</span><span>: </span><span>peterb@mail.com</span></li>
        <li><span>Vestiging</span><span>: </span><span>OBA IJburg</span></li>
    </ul>
    `;
    element.insertAdjacentHTML("beforeend", information);
}

function errorHandle(element, data, text) {
    if (data) {
        return loading(false, element);
    } else {
        loading(false, element);
        return addElementWithText(element, "p", text);
    }
}