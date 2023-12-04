
// set width of input with placeholder
let input = document.querySelectorAll('input');
for (i = 0; i < input.length; i++) {
    input[i].setAttribute('size', input[i].getAttribute('placeholder').length);
}

let text = document.querySelector('p');

// let text = document.getElementsByClassName('text1');

let textFontSize = 16;

increaseBtn = document.getElementById('increase'),
    decreaseBtn = document.getElementById('decrease');
increaseBtn.addEventListener('click', () => {
    textFontSize += 1
    text.style.fontSize = `${textFontSize}px`
})
decreaseBtn.addEventListener('click', () => {
    textFontSize -= 1
    text.style.fontSize = `${textFontSize}px`
})