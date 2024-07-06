document.addEventListener("DOMContentLoaded", () => {
    loadFiles();
});

function uploadFiles() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const compressed = pako.deflate(data);
            const base64Compressed = btoa(String.fromCharCode(...compressed));

            const fileData = {
                name: file.name,
                type: file.type,
                data: base64Compressed
            };

            localStorage.setItem(file.name, JSON.stringify(fileData));
            displayFile(fileData);
        };
        reader.readAsArrayBuffer(file);
    }
}

function loadFiles() {
    for (let i = 0; i < localStorage.length; i++) {
        const fileData = JSON.parse(localStorage.getItem(localStorage.key(i)));
        displayFile(fileData);
    }
}

function displayFile(fileData) {
    const fileList = document.getElementById('fileList');

    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.textContent = fileData.name;

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.onclick = () => downloadFile(fileData);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteFile(fileData.name, fileItem);

    fileItem.appendChild(downloadButton);
    fileItem.appendChild(deleteButton);
    fileList.appendChild(fileItem);
}

function downloadFile(fileData) {
    const compressed = Uint8Array.from(atob(fileData.data), c => c.charCodeAt(0));
    const decompressed = pako.inflate(compressed);

    const blob = new Blob([decompressed], { type: fileData.type });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function deleteFile(fileName, fileItem) {
    localStorage.removeItem(fileName);
    fileItem.remove();
}
