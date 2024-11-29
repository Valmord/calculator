const clearBtn = document.querySelector('.clear');
const topDisplay = document.querySelector('.display-top')
const btmDisplay = document.querySelector('.display-bottom')
const numBtns = document.querySelectorAll('button.num');
const opBtns = document.querySelectorAll('.op');

const NUM_OF_DP = 2;


numBtns.forEach( btn => {
  btn.addEventListener('click', () => {
    updateDisplays(btn.textContent);
  })
})


function splitEquation(text){
  for (let i = 1; i < text.length; i++){
    if (isNaN(text[i]) && text[i] !== '.') {
      return [text.slice(0,i),text[i],text.slice(i+1)];
    }
  }
  return ['','','']
}

function checkValidInput(input){
  const bText = btmDisplay.textContent + input;
  let count = 0;
  for (let i = 0; i < bText.length; i++){
    if (bText[i] === '.') count++;
    if (isNaN(bText[i]) && bText[i]!=='.') count = 0;
  }
  return count <= 1;
}

let lastInput = '';

function updateDisplays(input){
  const bText = btmDisplay.textContent;
  const bTextLen = bText.length;  
  const tText = topDisplay.textContent;
  const lastTDChar = tText[tText.length-1];

  btmDisplay.classList.remove('fade');

  


  if (!isNaN(input)) {
    if (lastTDChar === '=') {
      clearDisplays();
    } else if (isNaN(lastInput) && lastInput !== '.') updateBottomDisplay('','0');
    lastInput = input;
    if (bTextLen > 23) return;
    updateBottomDisplay(input);
    return;
  }
  if (input === '.') {
    if (bTextLen > 23 || bText.includes('.')) return;
    updateBottomDisplay('.');
  } else {

    if (input === '=') {
      if (lastTDChar === '=') return;
        const [firstOperand,operator] = [tText.slice(0,-1),tText[tText.length-1]]; 
        updateTopDisplay('', tText + bText + input);
        updateBottomDisplay('',calculate(firstOperand,operator,bText));
    } else if (lastTDChar && isNaN(lastTDChar))  {
      if (lastTDChar === '=') {
        updateTopDisplay('', calculate(...splitEquation(tText.slice(0,-1)))+input);
      } else {
        const [firstOperand,operator] = [tText.slice(0,-1),tText[tText.length-1]]; 
        updateTopDisplay('', calculate(firstOperand,operator,bText) + input );
      }
    } else {
      updateTopDisplay(input, bText);
    }
  }
  lastInput = input;
  btmDisplay.classList.add('fade');
  return;




  if (input === '←') {
    if (btmDisplay.classList.contains('display-previous') || bTextLen <= 1) updateBottomDisplay('','0');
    else updateBottomDisplay('',bText.slice(0,-1));
    btmDisplay.classList.remove('display-previous');
    btmDisplay.classList.remove('display-result');
    return;
  }

  if (input !== '.' && isNaN(input)){
    if (tText[tText.length-1] === '=') {
      updateTopDisplay(input, bText);
      btmDisplay.classList.add('display-previous');
    }
  }



  if (input !== '.' && isNaN(input)){
    if (!tText) {
      updateTopDisplay(input, bText);
      btmDisplay.classList.add('display-previous');
    } else if (input === '=') {
      btmDisplay.classList.add('display-result');
    }
    else {
      const [firstOperand,operator] = [tText.slice(0,-1),tText[tText.length-1]];
      updateTopDisplay('',calculate(firstOperand,bText,operator) + input);
      // updateBottomDisplay('',calculate(firstOperand,bText,operator));
    }
    return;
  }

  if (btmDisplay.classList.contains('display-result')) {
    clearDisplays();
    btmDisplay.classList.remove('display-result');
  }

  updateBottomDisplay(input); 
}

function updateTopDisplay(input, newText = ''){
  if (newText) topDisplay.textContent = newText + input;
  else topDisplay.textContent += input;
}

function updateBottomDisplay(input, newText=''){
  if (newText) {
    btmDisplay.textContent = newText;
    return;
  }
  if (btmDisplay.textContent === '0' && !isNaN(input)) btmDisplay.textContent = '';
  btmDisplay.textContent += input;
}


// 1: If a number is typed, it goes on bottom display. If number is 0, it overwrites.
// 2: When an operator is used, top display becomes bottom + operator. Bottom display fades slightly
// 3: When equal is used, top display shows calculator, bottom shows result (faded slightly)
// 4: If result is shown on bottom, then typing a number overwrites and clears top display. 
// 5: If result is shown on bottom, typing an operator does step 2.
// 6: If clear button is used, top should be set to nothing, bottom to 0
// 7: if backspace/← is used, bottom line should go back one space. If no characters remain, bottom should be set to 0.
//
//
//
//
//







function clearDisplays(){
  topDisplay.textContent = '';
  btmDisplay.textContent = 0;
  btmDisplay.classList.remove('display-previous');
}

clearBtn.addEventListener('click', () => {
  clearDisplays();
})


opBtns.forEach(btn => {
  if (btn.textContent.includes('mod')){
    btn.addEventListener('click', () => {
      updateDisplays('%');
  })} else {
    btn.addEventListener('click', () => {
      updateDisplays(btn.textContent);
    })
  }
})

document.addEventListener('keydown', event => {
  document.querySelector('h1').focus();
  if (event.key === 'Backspace') {
    updateDisplays('←');
  } else if (event.key === 'Enter') {
    updateDisplays('=');
  } else if (event.key === '*') {
    updateDisplays('×');
  } else if (event.key === '/') {
    updateDisplays('÷');
  } else if (event.key === 'c' || event.key === 'C') {
    clearDisplays();
  } else if ('1234567890.+_-=*^%/'.includes(event.key)) {
    updateDisplays(event.key);
  }
})


function calculate(a,op,b){
  const operations = {
    '+': (a,b) => a+b,
    '-': (a,b) => a-b,
    '×': (a,b) => a*b,
    '÷': (a,b) => a/b,
    '%': (a,b) => a%b,
    '^': (a,b) => a**b,
  }

  const result = operations[op](+a,+b);
  if (Math.ceil(result) === result) return result;
  return result.toFixed(NUM_OF_DP);
}