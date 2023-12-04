// set width of input with placeholder
let input = document.querySelectorAll('input');
for (i = 0; i < input.length; i++) {
    input[i].setAttribute('size', input[i].getAttribute('placeholder').length);
}

// change fontsize in pop up
let text = document.querySelector('p');  // selected paragraph to change fontsize

let textFontSize = 20; // Start number of fontsize. Is the same as p fontsize

increaseBtn = document.getElementById('increasefontSize'),
    decreaseBtn = document.getElementById('decreasefontSize');  // get id of buttons change fontsize
increaseBtn.addEventListener('click', () => {
    textFontSize += 1 // fontsize +1
    text.style.fontSize = `${textFontSize}px`;
    document.getElementsByName('fontSize')[0].placeholder = text.style.fontSize = `${textFontSize}`; // fontsize shown in placeholder
})
decreaseBtn.addEventListener('click', () => {
    textFontSize -= 1 // fontsize -1
    text.style.fontSize = `${textFontSize}px`
    document.getElementsByName('fontSize')[0].placeholder = text.style.fontSize = `${textFontSize}`; // fontsize shown in placeholder
})

// Change line-height
text = document.querySelector('p');  // selected paragraph to change fontsize

let textLineheight = 1.5;

increaseBtn2 = document.getElementById('increaselineHeight'),
    decreaseBtn2 = document.getElementById('decreaselineHeight');  // get id of buttons change lineheight
increaseBtn2.addEventListener('click', () => {
    textLineheight += 0.5 // lineheight +1
    text.style.lineHeight = `${textLineheight}`;
    document.getElementsByName('lineHeight')[0].placeholder = text.style.lineHeight = `${textLineheight}`; // lineheight shown in placeholder
})
decreaseBtn2.addEventListener('click', () => {
    textLineheight -= 0.5 // lineheight -1
    text.style.lineHeight = `${textLineheight}`;
    document.getElementsByName('lineHeight')[0].placeholder = text.style.lineHeight = `${textLineheight}`; // lineheight shown in placeholder
})

// Pop-up window to save PDF


downloadBtn = document.getElementById('download')
downloadBtn.addEventListener('click', doAction)
function doAction(action, message) {
    const response = confirm("Wil je het verhaal opslaan als PDF?")
    if (confirm(message)) {
      //If user say 'yes' to confirm
      console.log(action + ' is confirmed');
      
    
    } else {
      //If user say 'no' and cancelled the action
      console.log(action + ' is cancelled');
    }
};

