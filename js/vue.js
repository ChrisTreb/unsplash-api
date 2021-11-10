const accessKey = "?client_id=DRxbYNkvoVgaup7RK18bYF1BllSdFHCWzIyP-favtr4";
const urlParameters = "&orientation=landscape&query=";
const unsplashApiUrl = "https://api.unsplash.com/photos/";
const randomPicture = "random/";
const loadingContainer = document.getElementById("loader");
const imageContainer = document.getElementById("right");
const menuContainer = document.getElementById("left");
const hiddenImageSrc = document.getElementById("hidden-image");
const message = document.getElementById("message");

const colorThief = new ColorThief();
const image = new Image();
var color;
var count = 0;

// Set first image
window.addEventListener('load', function() {
    setFirstImage();
});

// Convert RGB to HEX
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('');

// Function No image


// First image
function setFirstImage() {
    unfade(loadingContainer);
    let urlImgTheme = "landscape";
    // Get new picture from Unsplash API
    let url = unsplashApiUrl + randomPicture + accessKey + urlParameters + urlImgTheme;
    let response = httpGet(url);
    try {
        if (response != null || response != undefined) {
            let json = JSON.parse(response);
            // Get & set image 
            let img = json.urls.regular;
            setBgImage(img);
            fade(loadingContainer);
        }
    } catch (e) {
        console.log(e);
        message.innerHTML = "An error has occured !<br>Rate limit excedeed or picture not found...<br>Try again.";
    }
}

// Change image theme
function changeTheme(theme, event) {
    unfade(loadingContainer);
    event.preventDefault();
    if (theme == "" || theme == null) {
        theme = "random";
    }
    console.log("THEME = " + theme);
    url = unsplashApiUrl + randomPicture + accessKey + urlParameters + theme;
    let response = httpGet(url);
    try {
        if (response != null || response != undefined) {
            let json = JSON.parse(response);
            // Get & set image 
            let img = json.urls.regular;
            setBgImage(img);
            fade(loadingContainer);

            image.src = hiddenImageSrc.getAttribute('src');
            image.onload = function() {
                var color = colorThief.getColor(hiddenImageSrc);
                console.log("Test colors = " + "'rgb(" + color + ")'");
                let arr = Array.from(color);
                menuContainer.style.backgroundColor = rgbToHex(arr[0], arr[1], arr[2]);
            };
        }
    } catch (e) {
        console.log(e);
        message.innerHTML = "An error has occured !<br>Rate limit excedeed or picture not found...<br>Try again.";
    }

}

// Function get Response from URL
function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

// Set image to hidden container

// Set this image to bg-img in right Column
function setBgImage(img) {
    // Set hidden image src
    hiddenImageSrc.src = img;
    // Set bg Image
    imageContainer.style.backgroundImage = "url('" + img + "')";
    count++;
    console.log("Nb de chargement => " + count);
}

// Fade function 
function fade(element) {
    var op = 1; // initial opacity
    var timer = setInterval(function() {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

// Unfade function
function unfade(element) {
    var op = 0.1; // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function() {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

// Vue JS
Vue.component('nav-item', {
    props: ['nav'],
    template: '<a :href=nav.link class="btn">{{ nav.text }}</a>'
})

Vue.component('theme-item', {
    props: ['theme'],
    template: '<button class="btn btn-light m-2 theme-image" onclick="changeTheme(this.value, event)" :value=theme.text >{{ theme.text }}</button>'
})

var appNav = new Vue({
    el: '#nav',
    data: {
        buttonList: []
    }
});

var appTheme = new Vue({
    el: '#img-themes',
    data: {
        themeList: [
            { id: 0, text: 'Landscape' },
            { id: 1, text: 'Cats' },
            { id: 2, text: 'Cloud' },
            { id: 3, text: 'Beach' },
            { id: 4, text: 'Dark' },
            { id: 5, text: 'Building' },
            { id: 6, text: 'Boat' },
            { id: 7, text: 'Fire' },
            { id: 8, text: 'Space' },
            { id: 9, text: 'Sport' }
        ]
    }
});
