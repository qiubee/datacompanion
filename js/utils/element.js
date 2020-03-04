export function addElementWithText(element, newElement, text) {
    if (text === undefined) {
        return element.appendChild(createElement(newElement));
    } else {
        return element.appendChild(createElement(newElement)).appendChild(addText(text));
    }
}

export function deleteElement(element) {
    return element.parentNode.removeChild(element);
}

export function deleteChildElements(parent, child, itemNumber = undefined) {
    const elements = Array.from(parent.children).filter(function (node) {
        return node.nodeName.toLowerCase() === child;
    });
    if (itemNumber !== undefined && itemNumber > 0) {
        const element = elements[itemNumber -1];
        return parent.removeChild(element);
    } else {
        return elements.map(function (node) {
            return parent.removeChild(node);
        });
    }
}

function createElement(element) {
    return document.createElement(element);
}

function addText(text) {
    return document.createTextNode(text);
}