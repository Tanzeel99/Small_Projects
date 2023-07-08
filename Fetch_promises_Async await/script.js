start()
async function start() {
    document.getElementById('center').style.display = 'block';
    document.getElementsByClassName('container')[0].style.opacity = 0.2;
    const response = await fetch("https://dog.ceo/api/breeds/list/all")
    const data = await response.json();
    dropdown(data.message);
}
function dropdown(data) {
    document.getElementsByClassName('container')[0].style.opacity = 1;
    document.getElementById('center').style.display = 'none';
    document.getElementById('breed').innerHTML =
        ` <select id="dropDown" onchange="selectdog(this.value)">
            <option>Choose a Dog</option>
            ${Object.keys(data).map(function (breed) {
            return `<option>${breed}</option>`
        }).join('')}
        </select>`
}

async function selectdog(breed) {
    document.getElementById('center').style.display = 'block';
    document.getElementsByClassName('container')[0].style.opacity = 0.2;
    if (breed != "Choose a Dog") {
        const resp = await fetch(`https://dog.ceo/api/breed/${breed}/images`)
        const data = await resp.json()
        displayImage(data.message);
    }
}

function displayImage(data) {
    document.getElementsByClassName('container')[0].style.opacity = 1;
    document.getElementById('center').style.display = 'none';
    document.getElementById('imageSlides').innerHTML = `<div class="slide" style="background-image: url('${data[0]}')"></div>`;
}