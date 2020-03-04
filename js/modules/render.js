import { getCompanion } from "./data.js";
import { goToPage } from "./router.js";
import { deleteElement} from "../utils/element.js";

export function overview() {
    
}

export function chooseCompanion() {
    const companions = document.querySelectorAll("label[data-companion=\"companion\"] input");
    Array.from(companions).map(function (label) {
        label.addEventListener("click", async function () {
            const selected = this.parentNode;
            // getCompanion(this);
            await viewCompanion(selected);
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