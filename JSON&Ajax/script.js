var btn = document.getElementById('btn');
var con = document.getElementById('info');
var count = 1;
btn.addEventListener('click',function(){
    var request = new XMLHttpRequest();
request.open('GET','https://learnwebcode.github.io/json-example/animals-'+count+'.json')
request.onload = function(){
    let reqData = JSON.parse(request.responseText);
    AddHtml(reqData);
};
request.send();
count++; 
if(count>=4){
    // btn.classList.add("hide-me");
    btn.style.visibility = 'hidden';
}
});

function AddHtml(data){
    let text = '';
    for(i=0;i<data.length;i++){
        text += "<p>" + data[i].name + " is a " + data[i].species+".</p>"
    }
    con.insertAdjacentHTML('beforeend',text);
}