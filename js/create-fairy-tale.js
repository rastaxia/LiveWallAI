// set width of input with placeholder
let input = document.querySelectorAll('input');
for(i=0; i<input.length; i++){
    input[i].setAttribute('size', input[i].getAttribute('placeholder').length);
}