// fetching required elements
const wrapper = document.getElementById("wrapper");
const imageInput = document.querySelector(".image-input");
const chooseImage = document.querySelector(".choose-img");
const imageSection = document.querySelector(".image-section img");
const edit = document.querySelector(".edit"); 
const resetBtn = document.querySelector(".reset-filters"); 
const saveBtn = document.querySelector(".save-img"); 
const filterOptions = document.querySelectorAll(".filter button");
const rotateOptions = document.querySelectorAll(".rotate button");
const sliderName = document.querySelector(".slider .name");
const sliderValue = document.querySelector(".slider .value");
const sliderInput = document.querySelector(".slider input");



let brightness = 100, saturation = 100, inversion = 0, grayscale = 0, rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilter=()=>{
    imageSection.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    imageSection.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage =()=>{
    let image = imageInput.files[0];
    if(!image) return;  // for nothing selected
    resetFilter();
    imageSection.src = URL.createObjectURL(image);

    // remove disable from edit and buttons
    edit.classList.remove("disable");
    resetBtn.classList.remove("disable");
    saveBtn.classList.remove("disable");
}

const updateFilter = ()=>{
    sliderValue.innerText = `${sliderInput.value}%`;
    const activeFilter = document.querySelector(".filter .active");

    if(activeFilter.id === "brightness"){
        brightness = sliderInput.value;
    }
    else if(activeFilter.id === "saturation"){
       saturation = sliderInput.value;
    }
    else if(activeFilter.id === "inversion"){
        inversion = sliderInput.value;
    }
    else{
        grayscale = sliderInput.value;
    }
    applyFilter();
}

const resetFilter = ()=>{
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0; rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();   
    applyFilter();
};




// add listener to all filter option
filterOptions.forEach((option)=>{
    option.addEventListener("click", ()=>{
        const activeFilter = document.querySelector(".filter .active");
        activeFilter.classList.remove("active");
        option.classList.add("active");
        sliderName.innerText = option.innerText;  // update slider name

        if(option.id === "brightness"){       //update slider value accrodingly
            sliderInput.max = '200';
            sliderInput.value = brightness;
            sliderValue.innerText = `${brightness}%`;
        }
        else if(option.id === "saturation"){
            sliderInput.max = '200';
            sliderInput.value = saturation;
            sliderValue.innerText = `${saturation}%`;
        }
        else if(option.id === "inversion"){
            sliderInput.max = '100';
            sliderInput.value = inversion;
            sliderValue.innerText = `${inversion}%`;
        }
        else{
            sliderInput.max = '100';
            sliderInput.value = grayscale;
            sliderValue.innerText = `${grayscale}%`;
        }
    })
})

// add listener to all rotate btns
rotateOptions.forEach((option)=>{
    option.addEventListener("click", ()=>{
        if(option.id === "left"){
            rotate -= 90;
        }
        else if(option.id === "right"){
            rotate += 90;
        }
        else if(option.id === "horizontal"){
            flipHorizontal = flipHorizontal === 1? -1: 1;
        }
        else if(option.id === "vertical"){
            flipVertical = flipVertical === 1? -1: 1;
        }
        applyFilter();
    })
});

const saveImage = ()=>{
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imageSection.naturalWidth;
    canvas.height = imageSection.naturalHeight;
    
    ctx.filter =  `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(imageSection, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement('a');
    link.download = 'edited_image.jpg';
    link.href = canvas.toDataURL();
    link.click();
}



// active choose Image btn
chooseImage.addEventListener("click", ()=>{
    imageInput.click();
});


// add listener to input file
imageInput.addEventListener("change", loadImage);

sliderInput.addEventListener("input", updateFilter);
resetBtn.addEventListener("click", resetFilter); 
saveBtn.addEventListener("click", saveImage);

