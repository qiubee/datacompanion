async function readFile(path) {
    const reader = new FileReader();
    reader.onload(function (item) {
        console.log(item);
    });
}