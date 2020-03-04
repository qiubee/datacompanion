import { checkCompanion } from "./data.js";
import { overview, chooseCompanion } from "./render.js";

export async function route() {
    checkCompanion() ? goToPage("overview") : chooseCompanion();
    routie({
        "overview": function() {
            overview();
        }
    });
}

export function goToPage(name) {
    window.location.hash = name;
}