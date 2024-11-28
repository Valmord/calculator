const clearBtn = document.querySelector('.clear');
const topDisplay = document.querySelector('.display-top')
const btmDisplay = document.querySelector('.display-bottom')
const numBtns = document.querySelectorAll('button.num');
const opBtns = document.querySelectorAll('.op');


const NUM_OF_DP = 2;



// function test(num1,op){
//   this.op = op;
//   this.num1 = num;
//   return function(num2){
//     return calculate(this.num1,this.op,num);
//   }
// }



// console.log(calculate(5,'+','7'));  


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
  console.log(count);
  return count <= 1;
}

function updateDisplays(input){
  const bText = btmDisplay.textContent;
  const bTextLen = bText.length;
  const [a,op,b] = splitEquation(bText);
  const previousInput = bText[bTextLen-1];

  if (input === '=' && !op) {
    updateTopDisplay();
    return;
  }
  if (input === '←') {
    if (bTextLen === 1) updateBtmDisplay("",'0');
    else updateBtmDisplay("",bText.slice(0,-1));
    return;
  }
  if ((input === '.' && previousInput === '.') || !checkValidInput(input)) return;
  if ((previousInput === '.' && isNaN(input)) || (isNaN(previousInput) && input === '.')  ) {
    updateBtmDisplay(input,bText + '0');
    return;
  }

  if (isNaN(input) && previousInput === input && input !== '.') {
    let result = '';
    if (topDisplay.textContent) {
      let [,,newA] = splitEquation(topDisplay.textContent);
      newA = newA.slice(0,-1);
      updateTopDisplay(newA);
      result = calculate(a,newA,op);
    } else {
      result = calculate(a,a,op);
      updateTopDisplay(a);
    }
    updateBtmDisplay(input, result);

    return;
  }

  if (input === '=' || (op && isNaN(input) && input !== '.')) {
    // const [a,op,b] = splitEquation(btmDisplay.textContent);
    const result = calculate(a,b,op);
    updateTopDisplay();
    updateBtmDisplay(input, result);
    return;
  }




  if (isNaN(previousInput) && isNaN(input) && input !== '.'){
    // updateTopDisplay();
    // updateBtmDisplay(input, true);
  } else {
    updateBtmDisplay(input);
  }
    
}

function doesCurrentOpExist(op){
  if (!currentOp) { 
    currentOp = op;
    return false;
  } return true;
}

function updateTopDisplay(firstOperand = ''){
  const td = topDisplay.textContent;
  if (td[td.length-1] === '-') topDisplay.textContent = td.slice(0,-1);
  if (firstOperand) {
    topDisplay.textContent = btmDisplay.textContent + firstOperand + '=';
  } else {
    topDisplay.textContent = btmDisplay.textContent + '=';
  }
}

function updateBtmDisplay(input, result = ''){

  if (result !== '') {
    btmDisplay.textContent = result;
    if (input !== '=') btmDisplay.textContent += input;
    return;
  } 

  const dsp = btmDisplay.textContent;
  console.log(dsp);
  if (dsp.length > 23) return; 
  if (isNaN(dsp[dsp.length-1]) && isNaN(input)) return;
  if (dsp === '0' && !isNaN(input)) {
    btmDisplay.textContent = '';
  }

  btmDisplay.textContent += input
}


clearBtn.addEventListener('click', () => {
  topDisplay.textContent = '';
  btmDisplay.textContent = 0;
  currentOp = '';
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
  console.log(event.key);
  if (event.key === 'Backspace') {
    updateDisplays('←');
  } else if (event.key === 'Enter') {
    updateDisplays('=');
  } else if (event.key === '*') {
    updateDisplays('×');
  } else if (event.key === '/') {
    updateDisplays('÷');
  } else if ('1234567890.+_-=*^%/'.includes(event.key)) {
    updateDisplays(event.key);
  }
})


function calculate(a,b,op){
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