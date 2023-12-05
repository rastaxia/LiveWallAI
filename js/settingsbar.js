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

// Convert HTML to PDF
downloadBtn = document.getElementById('download')
downloadBtn.addEventListener('click', getChoicePDF)
function convertToPDF() {
    let pdfFile = document.getElementById('textpdf');    // select text in HTML to convert to PDF
    html2pdf(pdfFile);  // convert html to pdf
  }

// Pop-up window to save PDF
function getChoicePDF(action, message) {
    const response = confirm("Wil je het verhaal opslaan?")
    if (confirm) {
      //If user say 'yes' to confirm the PDF will be downloaded
      convertToPDF();
    } else {
      //If user say 'no' and cancelled the action
    }
};

