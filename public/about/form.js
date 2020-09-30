const imgUrls = {};
const globals = {
    imgSpace : 1,
    uniqueSelection: null,
    availableSelection: ["data-fashion", "data-media", "data-cosmet"]
};
let paymentPortalLoaded = false;


document.addEventListener("DOMContentLoaded", function() {
    // document.querySelector("#application-form").addEventListener("submit", formHandler);
    document.querySelector("#application-form [name='item-image']").addEventListener("change", imageUploadHandler);
    document.querySelectorAll("input[type='radio'][data-degree]").forEach(el => {
        el.addEventListener("change", uniqueSelectionHandler);
    });
});

const displayUploadState = function(statusText, end, status){
    status = status || 200;
    end = end || null;
    const container = document.querySelector("#application-form .gallery .status-bar");
    container.style.display = "block";

    container.innerHTML = statusText;

    if(end && end === true){
        setTimeout(()=>{
            container.style.display = "none";
        }, 5000);
    }

    if(status >= 400){
        container.style.backgroundColor = "rgba(255, 25, 25, 0.85)";
    }else{
        container.style.backgroundColor = "rgba(54, 177, 248, 0.85)";
    }
};

const imageUploadHandler = function(evt){
    const uploadImage = (name, file) => {
        // debugger
        const fd = new FormData();
        fd.append(name, file);

        fetch('/api/upload', {
            method: "POST",
            body: fd
        }).then(async response => {
            let result = await response.json();
            let [data] = result;

            if(data.status === 200){
                document.querySelector(`[name='image-link-holder']`).setAttribute("value", data.version);
                document.querySelector(`#${name}_upload-action`).parentNode.removeChild(document.querySelector(`#${name}_upload-action`));
            }else{
                document.querySelector(`#${name}_upload-action`).classList.toggle("progress", false);
                document.querySelector(`#${name}_upload-action`).classList.toggle("icofont-check", true);
                document.querySelector(`#${name}_upload-action`).classList.toggle("icofont-refresh", false);
                // displayUploadState("Upload Failed!", true, data.status);
            }

        }).catch(error => {
            console.log(error);
        });
    };
    
    const reader = new FileReader();
    const elementId = evt.target.id;
    const file = evt.target.files[0];

    if(file){
        reader.readAsDataURL(file);
    }

    reader.onload = function() {
        const previewElement = document.querySelector(`label[for='${elementId}']`);
        previewElement.innerHTML = "";
        previewElement.style.backgroundImage = `url(${reader.result})`;
        previewElement.style.backgroundColor = `rgb(30, 30, 30)`;


        let divB = createComponent("DIV", null, ["rows"]);
            let uploadB = createComponent("span", null, ["rows", "icofont-check", "img-action"]);
            let deleteB = createComponent("span", null, ["rows", "icofont-close", "img-action"]);

        divB.setAttribute("id", `${elementId}_action-container`);
        uploadB.setAttribute("id", `${elementId}_upload-action`);
        deleteB.setAttribute("id", `${elementId}_delete-action`);

        // uploadB.addEventListener("click", function(evt){
            
        // });

        deleteB.addEventListener("click", function(evt) {
            previewElement.style.backgroundImage = `none`;
            previewElement.innerHTML =`Click to insert passport<br>(JPEG or PNG)`;
            document.querySelector(`#${elementId}`).value = '';
            delete imgUrls[elementId];
            document.querySelector(`#${elementId}`).removeAttribute("disabled");
            previewElement.style.backgroundColor = `#eeeeee`;
        });

        divB = joinComponent(divB, uploadB, deleteB);
        previewElement.appendChild(divB);
        document.querySelector(`#${elementId}`).setAttribute("disabled", true);

        imgUrls[elementId] = file.name;

        // START THE IMAGE UPLOAD AFTER 1 SECOND
        try {
            let uploadButton = document.querySelector(`#preview-image-1_upload-action`);
            setTimeout(() => {
                // debugger
                uploadButton.classList.toggle("progress", true);
                uploadButton.classList.toggle("icofont-check", false);
                uploadButton.classList.toggle("icofont-refresh", true);
                // displayUploadState(`Uploading Image (${Object.keys(imgUrls).indexOf(elementId) + 1}/${Object.keys(imgUrls).length})`);
                uploadImage(elementId, file);
            }, 1000);
        } catch (error) {
            console.log("Could not upload image");
        }
        
    };
};

const formHandler = function(evt) {
    const setState = function(state, label) {
        label = label || "Uploading To Store...";
        const submitBtn = document.querySelector(`#application-form input[type="submit"]`);
        if(state === true){
            submitBtn.value = label;
            submitBtn.classList.toggle("saving", true);
            submitBtn.setAttribute("disabled", true);
        }else{
            submitBtn.value = "Add to Store";
            submitBtn.classList.toggle("saving", false);
            submitBtn.removeAttribute("disabled");
        }
    };

    evt.preventDefault();
    const submitForm = function(){
        let categoryField = [];
        let imageField = [];

        forEach(document.querySelectorAll("[name='categories']:checked"), function(field) {
            categoryField.push(field.value);
        });

        // Get all image field element and set content to version
        document.querySelectorAll("[name='item-image']").forEach(function(field) {
            if(field.value !== ''){
                imageField.push(field.getAttribute("data-version") || '');
            }
        });

        // Rewrite the content of each image field
        for (let i = 1; i <= Object.keys(imgUrls).length; i++) {
            imageField[i-1] = `v${imageField[i-1]}/` + imgUrls[`preview-image-${i}`];
        }

        const bodyValue = {
            "item-image": imageField,
            "item-name": document.querySelector("[name='item-name']").value,
            "short-desc": document.querySelector("[name='item-short-desc']").value,
            "item-desc": preFormatInput(document.querySelector("[name='item-desc']").value),
            categories: categoryField,
            sellerID: document.querySelector("[name='sellerID']").value,
            "item-price": document.querySelector("[name='item-price']").value,
            "item-qty": document.querySelector("[name='item-qty']").value
        };

        fetch(`/api/goods/save`, {
            method: "POST",
            body: JSON.stringify(bodyValue),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(async function(response) {
            try {
                let result = await response.json();
                if(!result[`error`]){
                    alert("Saved to Store!");
                    setState(false);
                    window.location.href = "/myprofile/orders?sectid=3";
                }else{
                    alert("Something unexpected happened. Try again!");
                    setState(false);
                }
                // alert(result);
            } catch (error) {
                console.error(error);
            }
        }).catch(function(error) {
            console.error(error);
        });
    };

    setState(true);
};

const uniqueSelectionHandler = function(ev) {
    let target = ev.currentTarget;
    // console.log(target.checked, globals.uniqueSelection);
    if (target.checked === true){
        if(globals.uniqueSelection !== null && target.hasAttribute(`${globals.uniqueSelection}`) === false) {
            document.querySelectorAll(`input[type='radio'][${globals.uniqueSelection}]`).forEach(el => {
                el.checked = false;
            });
        }
        globals.uniqueSelection = target.getAttribute("data-degree");
    }
};