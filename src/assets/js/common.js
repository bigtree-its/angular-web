function maxBedrooms(value) {
    document.getElementById('maxBedrooms').innerHTML = value;
}

function minBedrooms(value) {
    document.getElementById('minBedrooms').innerHTML = value;
}

function greet(){
    alert("Hello");
}


var toggle = document.getElementById('my-container');
var toggleContainer = document.getElementById('my-toggle-container');
var toggleNumber;

function clickMyContainer(){
    alert("Hello");
}

toggle.addEventListener("click", function () {
   
    toggleNumber = !toggleNumber;
    if (toggleNumber) {
        toggleContainer.style.clipPath = "inset(0 0 0 50%)";
        toggleContainer.style.backgroundColor = '#D74046';
    } else {
        toggleContainer.style.clipPath = "inset(0 50% 0 0)";
        toggleContainer.style.backgroundColor = "dodgerblue";
    }
    console.log(toggleNumber)
});