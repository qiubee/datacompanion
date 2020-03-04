export function addToStorage(name, content, storageType = sessionStorage) {
    content = JSON.stringify(content);
    storageType.setItem(name, content);
}

export function checkInStorage(name, storageType = sessionStorage) {
    if (storageType.getItem(name)) {
        return true;
    } else { return false; }
}

export function getFromStorage(name, storageType = sessionStorage) {
    if (storageType.getItem(name)) {
        return JSON.parse(storageType.getItem(name));
    }
}