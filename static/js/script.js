document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const cameraInput = document.getElementById('cameraInput');
    const galleryInput = document.getElementById('galleryInput');
    const dropArea = document.getElementById('dropArea');
    const previewGrid = document.getElementById('previewGrid');
    const previewContainer = document.getElementById('previewContainer');
    const uploadForm = document.getElementById('uploadForm');

    let selectedFiles = [];
    let croppedFiles = {}; // Store cropped image
    let cropper = null;
    let currentCropIndex = null;

    // Initialize drag and drop (Desktop only)
    if (dropArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropArea.classList.add('border-[#FED255]', 'bg-[#2B3F46]/70');
        }

        function unhighlight() {
            dropArea.classList.remove('border-[#FED255]', 'bg-[#2B3F46]/70');
        }

        dropArea.addEventListener('drop', handleDrop, false);
        dropArea.addEventListener('click', () => fileInput.click());
    }

    fileInput.addEventListener('change', () => handleFileInput(fileInput.files));
    cameraInput.addEventListener('change', () => handleFileInput(cameraInput.files));
    galleryInput.addEventListener('change', () => handleFileInput(galleryInput.files));

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileInput(files);
    }

    function handleFileInput(files) {
        const newFiles = Array.from(files);
        const combinedFiles = [...selectedFiles, ...newFiles];

        if (combinedFiles.length > 3) {
            showAlert("You can only upload up to 3 images.");
            return;
        }

        if (!combinedFiles.every(file => file.type.startsWith("image/"))) {
            showAlert("All files must be image types.");
            return;
        }

        selectedFiles = combinedFiles;
        updatePreview();
    }

    function showAlert(message) {
        alert(message); // TODO: Replace with new alert
    }

    function updatePreview() {
        previewGrid.innerHTML = "";

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                const previewItem = document.createElement('div');
                previewItem.className = 'relative group';

                // Use cropped version if available, otherwise original
                const imgSrc = croppedFiles[index] ? croppedFiles[index] : reader.result;

                const img = document.createElement('img');
                img.src = imgSrc;
                img.className = 'w-full h-full object-cover rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity';
                img.addEventListener('click', () => openCropper(reader.result, index));

                const removeBtn = document.createElement('button');
                removeBtn.className = 'absolute -top-2 -right-2 bg-red-500 text-white md:bg-[#1E2328] md:text-[#FED255] rounded-full p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-500 hover:text-white';
                removeBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                `;
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectedFiles.splice(index, 1);
                    delete croppedFiles[index]; // Remove cropped version if exists
                    updatePreview();
                });

                previewItem.appendChild(img);
                previewItem.appendChild(removeBtn);
                previewGrid.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });

        previewContainer.classList.toggle('hidden', selectedFiles.length === 0);
    }

    function openCropper(imageSrc, index) {
        const modal = document.getElementById('cropperModal');
        const imageToCrop = document.getElementById('imageToCrop');
        const croppedPreview = document.getElementById('croppedPreview');

        currentCropIndex = index;
        imageToCrop.src = imageSrc;
        croppedPreview.src = croppedFiles[index] || imageSrc;

        modal.classList.remove('hidden');

        // Initialize cropper
        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(imageToCrop, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 1,
            responsive: true,
            crop(event) {
                const canvas = cropper.getCroppedCanvas({
                    width: 300,
                    height: 300
                });
                croppedPreview.src = canvas.toDataURL();
            }
        });
    }

    function closeCropper() {
        const modal = document.getElementById('cropperModal');
        modal.classList.add('hidden');
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        currentCropIndex = null;
    }

    document.getElementById('closeCropper').addEventListener('click', closeCropper);

    // Click outside to close
    document.getElementById('cropperModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('cropperModal')) {
            closeCropper();
        }
    });

    document.getElementById('applyCrop').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!cropper) {
            showAlert("No active cropper instance!");
            return;
        }

        const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 300
        });

        if (!canvas) {
            showAlert("Failed to get cropped canvas!");
            return;
        }

        // Store the cropped version as data url
        croppedFiles[currentCropIndex] = canvas.toDataURL();
        updatePreview();
        closeCropper();
    });

    // Submit event listener
    document.querySelector('#tweaks button[type="submit"]').addEventListener('click', async function (e) {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            showAlert("Select at least one image!");
            return;
        }

        try {
            // Prepare files for upload
            const filesToUpload = await Promise.all(selectedFiles.map(async (file, index) => {
                if (croppedFiles[index]) {
                    const blob = await fetch(croppedFiles[index]).then(res => res.blob());
                    return new File([blob], `cropped_${index}.png`, { type: 'image/png' });
                } else {
                    const img = await createCroppedVersion(file);
                    return new File([img], `cropped_${index}.png`, { type: 'image/png' });
                }
            }));

            // Get the tweaks data
            const tweaks = {
                want_border: document.getElementById('want-border').checked,
                want_single_strip: document.getElementById('want-single-strip').checked,
                filter_style: document.getElementById('filter-style').value
            };

            // Create FormData and append files and tweaks
            const formData = new FormData();
            filesToUpload.forEach(file => formData.append('images', file));
            formData.append('tweaks', JSON.stringify(tweaks));

            // Send to the FastAPI backend
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const result = await response.json();
            console.log('Upload result:', result);

            // Display processed images
            displayProcessedImages(result.processed_images, result.is_strip);

            // Reset after upload
            selectedFiles = [];
            croppedFiles = {};
            updatePreview();
            fileInput.value = '';
            galleryInput.value = '';
            cameraInput.value = '';

        } catch (error) {
            console.error('Upload error:', error);
            showAlert("An error occurred during upload. Please try again.");
        }
    });

    function displayProcessedImages(images, isStrip) {
        const previewSection = document.getElementById('preview');
        previewSection.innerHTML = '<h1 class="text-3xl md:text-4xl font-bold mb-4 text-center">Preview</h1>';

        const container = document.createElement('div');
        container.className = 'flex flex-wrap justify-center gap-4';

        if (isStrip) {
            // Display single strip image
            const imgContainer = document.createElement('div');
            imgContainer.className = 'w-full flex justify-center';

            const img = document.createElement('img');
            img.src = `data:image/png;base64,${images[0]}`;
            img.className = 'max-w-full h-auto rounded-lg shadow-lg';
            img.alt = 'Processed photo strip';

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Download';
            downloadBtn.className = 'bg-[#FED255] text-black px-4 py-2 rounded font-semibold hover:bg-[#FED255]/90 transition-colors';
            downloadBtn.onclick = () => downloadImage(images[0], `photo-strip.jpg`);

            imgContainer.appendChild(img);
            container.appendChild(imgContainer);
            container.appendChild(downloadBtn);
        } else {
            // Display individual images with download buttons
            images.forEach((imgData, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 flex flex-col items-center';

                const img = document.createElement('img');
                img.src = `data:image/png;base64,${imgData}`;
                img.className = 'w-full h-auto rounded-lg shadow-lg mb-2';
                img.alt = `Processed image ${index + 1}`;

                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = 'Download';
                downloadBtn.className = 'bg-[#FED255] text-black px-4 py-2 rounded font-semibold hover:bg-[#FED255]/90 transition-colors';
                downloadBtn.onclick = () => downloadImage(imgData, `photo-${index + 1}.jpg`);

                imgContainer.appendChild(img);
                imgContainer.appendChild(downloadBtn);
                container.appendChild(imgContainer);
            });
        }
        previewSection.appendChild(container);
    }

    function downloadImage(base64Data, filename) {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${base64Data}`;
        link.download = filename;
        link.click();
    }

    // Create cropped version from center if image wasn't manually cropped
    // helps with maintaining same height of uploaded images
    async function createCroppedVersion(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const size = Math.min(img.width, img.height);
                    const x = (img.width - size) / 2;
                    const y = (img.height - size) / 2;

                    canvas.width = 300;
                    canvas.height = 300;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, x, y, size, size, 0, 0, 300, 300);

                    canvas.toBlob(blob => {
                        resolve(blob);
                    }, 'image/png');
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
});
