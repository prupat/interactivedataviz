const countUp = document.querySelector('.countUp button');
const ResetZero = document.querySelector('.ResetZero button');
let timeClick = document.querySelector('.Num h3');

countUp. addEventListener('click', Compute);
ResetZero. addEventListener('click', reset);

function Compute(){
    timeClick.innerHTML ++;
}

function reset(){
    timeClick.innerHTML = 0;

}