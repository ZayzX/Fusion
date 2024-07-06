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

            localStorage.setItem(file.name, base64Compressed);
            displayFile(file.name);
        };
        reader.readAsArrayBuffer(file);
    }
}

function loadFiles() {
    for (let i = 0; i < localStorage.length; i++) {
        const fileName = localStorage.key(i);
        displayFile(fileName);
    }
}

function displayFile(fileName) {
    const fileList = document.getElementById('fileList');

    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.textContent = fileName;

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.onclick = () => downloadFile(fileName);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteFile(fileName, fileItem);

    fileItem.appendChild(downloadButton);
    fileItem.appendChild(deleteButton);
    fileList.appendChild(fileItem);
}

function downloadFile(fileName) {
    const base64Compressed = localStorage.getItem(fileName);
    const compressed = Uint8Array.from(atob(base64Compressed), c => c.charCodeAt(0));
    const decompressed = pako.inflate(compressed);

    const blob = new Blob([decompressed]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function deleteFile(fileName, fileItem) {
    localStorage.removeItem(fileName);
    fileItem.remove();
}
