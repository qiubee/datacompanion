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
        <img src="${detail.cover}" alt="Kaft van het boek ${detail.title} van ${detail.authors[0].full}">
        <h3>${detail.title.split(":")[0].split("&")[0]}</h3>
        <p>Van ${detail.authors[0].full !== undefined ? detail.authors[0].full : "uitgeverij " + detail.publisher[0]}</p>
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
    <svg height="512pt" viewBox="-48 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m260.078125 68.617188h-15.191406v-19.238282c0-18.851562-15.335938-34.1875-34.183594-34.1875h-5.457031c-18.847656 0-34.183594 15.335938-34.183594 34.1875v19.238282h-15.191406v-19.238282c0-27.230468 22.152344-49.378906 49.375-49.378906h5.457031c27.226563 0 49.375 22.148438 49.375 49.378906zm0 0" fill="#b9acac"/><path d="m316.605469 512h-218.308594c-14.59375 0-26.640625-11.410156-27.433594-25.980469l-19.925781-365.996093h314.074219l-20.980469 366.074218c-.832031 14.539063-12.863281 25.902344-27.425781 25.902344zm0 0" fill="#b9acac"/><path d="m273.953125 120.023438-9.378906 341.074218c-.410157 14.804688-12.527344 26.59375-27.339844 26.59375h-166.222656c1.585937 13.761719 13.257812 24.308594 27.285156 24.308594h218.308594c14.5625 0 26.59375-11.363281 27.425781-25.902344l20.980469-366.074218zm0 0" fill="#9e9797"/><path d="m301.3125 50.136719h-187.351562c-34.808594 0-63.023438 28.214843-63.023438 63.023437v1.800782h313.394531v-1.800782c0-34.808594-28.214843-63.023437-63.019531-63.023437zm0 0" fill="#e1d3ce"/><path d="m300.5 50.136719h-66.953125c35.25 0 63.832031 28.578125 63.832031 63.832031v.992188h66.953125v-.992188c0-35.253906-28.578125-63.832031-63.832031-63.832031zm0 0" fill="#cdbfba"/><path d="m392.996094 88.625h-370.042969c-12.675781 0-22.953125 10.277344-22.953125 22.953125v.683594c0 12.675781 10.277344 22.953125 22.953125 22.953125h370.042969c12.675781 0 22.953125-10.277344 22.953125-22.953125v-.683594c0-12.675781-10.277344-22.953125-22.953125-22.953125zm0 0" fill="#b9acac"/><path d="m392.652344 88.625h-48.277344c0 12.867188-10.429688 23.296875-23.296875 23.296875h-321.078125c0 12.863281 10.429688 23.296875 23.296875 23.296875h369.359375c12.863281 0 23.292969-10.433594 23.292969-23.296875 0-12.867187-10.429688-23.296875-23.296875-23.296875zm0 0" fill="#9e9797"/><g fill="#766e6e"><path d="m207.765625 182.277344h.417969c7.808594 0 14.140625 6.332031 14.140625 14.136718v222.394532c0 7.808594-6.332031 14.140625-14.140625 14.140625h-.417969c-7.808594 0-14.136719-6.332031-14.136719-14.140625v-222.394532c0-7.804687 6.328125-14.136718 14.136719-14.136718zm0 0"/><path d="m296.023438 182.277344c8.078124 0 14.566406 6.671875 14.335937 14.746094l-6.28125 221.988281c-.21875 7.757812-6.570313 13.933593-14.335937 13.933593-8.078126 0-14.5625-6.667968-14.335938-14.746093l6.28125-221.984375c.21875-7.761719 6.574219-13.9375 14.335938-13.9375zm0 0"/><path d="m119.925781 182.277344c-8.078125 0-14.5625 6.671875-14.335937 14.746094l6.28125 221.988281c.21875 7.757812 6.570312 13.933593 14.335937 13.933593 8.078125 0 14.5625-6.667968 14.335938-14.746093l-6.28125-221.984375c-.21875-7.761719-6.570313-13.9375-14.335938-13.9375zm0 0"/></g><path d="m207.980469 182.277344h-.011719c-.175781 0-.347656.019531-.519531.027344.75 1.742187 1.171875 3.660156 1.171875 5.679687v221.984375c0 7.746094-6.140625 14.039062-13.820313 14.316406 2.203125 5.097656 7.265625 8.664063 13.167969 8.664063h.011719c7.921875 0 14.34375-6.421875 14.34375-14.34375v-221.984375c0-7.921875-6.421875-14.34375-14.34375-14.34375zm0 0" fill="#5b5555"/><path d="m296.023438 182.277344c-.183594 0-.363282.019531-.542969.027344.804687 1.863281 1.238281 3.917968 1.179687 6.085937l-6.28125 221.984375c-.214844 7.578125-6.28125 13.628906-13.792968 13.910156 2.199218 5.082032 7.246093 8.660156 13.15625 8.660156 7.765624 0 14.117187-6.175781 14.335937-13.933593l6.28125-221.988281c.230469-8.074219-6.257813-14.746094-14.335937-14.746094zm0 0" fill="#5b5555"/><path d="m134.261719 196.214844c-.21875-7.761719-6.570313-13.9375-14.335938-13.9375-.179687 0-.355469.023437-.535156.027344.703125 1.625 1.117187 3.402343 1.171875 5.273437l6.277344 221.984375c.222656 7.898438-5.972656 14.429688-13.800782 14.722656 2.203126 5.105469 7.277344 8.664063 13.164063 8.664063 8.082031 0 14.566406-6.671875 14.335937-14.75zm0 0" fill="#5b5555"/></svg>
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