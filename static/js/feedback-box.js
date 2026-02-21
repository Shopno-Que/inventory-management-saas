const toggleBtn = document.getElementById('feedbackToggle');
const box = document.getElementById('feedbackBox');
const closeBtn = document.getElementById('feedbackClose');
const form = document.getElementById('feedbackForm');

const dropArea = document.getElementById('dropArea');
const imagesInput = document.getElementById('feedbackImages');
const previewGrid = document.getElementById('previewGrid');
const successMsg = document.getElementById('successMsg');

let selectedFiles = [];


/* Toggle */
toggleBtn.onclick = () => box.classList.toggle('hidden');
closeBtn.onclick = () => box.classList.add('hidden');


/* Add files helper */
function addFiles(files) {
    selectedFiles.push(...files);
    renderPreviews();
}


/* Render thumbnails */
function renderPreviews() {
    previewGrid.innerHTML = "";

    selectedFiles.forEach((file, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = "relative w-16 h-16";

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = "w-16 h-16 object-cover rounded-lg border";

        const removeBtn = document.createElement('button');
        removeBtn.type = "button";
        removeBtn.innerHTML = "✕";
        removeBtn.className =
            "absolute -top-2 -right-2 bg-black/70 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center";

        removeBtn.onclick = () => {
            selectedFiles.splice(index, 1);
            renderPreviews();
        };

        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        previewGrid.appendChild(wrapper);
    });
}


/* Normal file select */
imagesInput.addEventListener('change', e => {
    addFiles([...e.target.files]);
    imagesInput.value = "";
});


/* Drag & drop */
dropArea.addEventListener('dragover', e => {
    e.preventDefault();
    dropArea.classList.add('border-indigo-500', 'bg-indigo-50');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('border-indigo-500', 'bg-indigo-50');
});

dropArea.addEventListener('drop', e => {
    e.preventDefault();
    dropArea.classList.remove('border-indigo-500', 'bg-indigo-50');

    addFiles([...e.dataTransfer.files]);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("message", document.getElementById('feedbackText').value);

    selectedFiles.forEach(file => {
        formData.append("images", file);
    });

    fetch(form.action, {
        method: form.method,
        headers: {
            "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {

            form.reset();
            selectedFiles = [];
            renderPreviews();

            successMsg.classList.remove('hidden');

            setTimeout(() => {
                successMsg.classList.add('hidden');
                box.classList.add('hidden');
            }, 1200);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Something went wrong. Try again.");
    });
});
