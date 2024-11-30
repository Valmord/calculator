const clearBtn = document.querySelector('.clear');
const topDisplay = document.querySelector('.display-top')
const btmDisplay = document.querySelector('.display-bottom')
const numBtns = document.querySelectorAll('button.num');
const opBtns = document.querySelectorAll('.op');

const NUM_OF_DP = 2;

function splitEquation(text){
  for (let i = 1; i < text.length; i++){
    if (isNaN(text[i]) && text[i] !== '.') {
      return [text.slice(0,i),text[i],text.slice(i+1)];
    }
  }
  return ['','','']
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
    return;
  } else {
    // Deal with Operators
    if (bText[bTextLen-1] === '.') updateBottomDisplay('',bText.slice(0,-1));
    if (input === '=') {
      if (lastTDChar === '=') return;
        const [firstOperand,operator] = [tText.slice(0,-1),tText[tText.length-1]]; 
        updateTopDisplay('', tText + bText + input);
        updateBottomDisplay('',calculate(firstOperand,operator,bText));
    } else if (input === '←') {
      updateBottomDisplay('',bTextLen <= 1 ? '0' : bText.slice(0,-1));
      if (lastTDChar === '=') clearTopDisplay();
      top
      return;
    } else if (lastTDChar && isNaN(lastTDChar))  {
      if (lastTDChar === '=') {
        const calculation = calculate(...splitEquation(tText.slice(0,-1)));
        updateTopDisplay('', calculation+input);
      } else {
        const [firstOperand,operator] = [tText.slice(0,-1),tText[tText.length-1]]; 
        updateTopDisplay('', calculate(firstOperand,operator,bText) + input );
      }
    } else {
      updateTopDisplay(input, btmDisplay.textContent);
    }
  }
  lastInput = input;
  btmDisplay.classList.add('fade');
  return;
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

function clearDisplays(){
  topDisplay.textContent = '';
  btmDisplay.textContent = 0;
}

function clearTopDisplay(){
  topDisplay.textContent = '';
}


numBtns.forEach( btn => {
  btn.addEventListener('click', () => {
    updateDisplays(btn.textContent);
  })
})

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
  if (Math.ceil(result) === result) return String(result);
  return result.toFixed(NUM_OF_DP);
}