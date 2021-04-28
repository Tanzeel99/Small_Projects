const colors = document.getElementsByClassName('colors');
let i;
for(i = 0;i<colors.length;i++){
    colors[i].addEventListener('click', changecolor)
}
function changecolor(){
    let color = this.getAttribute('data-color');
    document.documentElement.style.setProperty('--color',color);
}
const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const feedInput = document.querySelector('#feed');
const msg = document.querySelector('.msg');
const userList = document.querySelector('#users');
myForm.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  
  if(nameInput.value === '' || emailInput.value === '' || feedInput === '') {
    msg.classList.add('error');
    msg.innerHTML = 'Please enter all fields';
    setTimeout(() => msg.remove(), 2000);
  } else {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`${nameInput.value}: ${emailInput.value}`));
    userList.appendChild(li);
    nameInput.value = '';
    emailInput.value = '';
    feedInput.value = '';
  }
}