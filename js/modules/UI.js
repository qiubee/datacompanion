import { addElementWithText, deleteChildElements } from "../utils/element.js";
export function loading(state, element, loadingMessage = "Aan het laden...") {
    state ? addElementWithText(element, "p", loadingMessage) : deleteChildElements(element, "p", element.lastElementChild);
}