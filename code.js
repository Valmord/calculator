let currentOp = '';
const clearBtn = document.querySelector('.clear');
const topDisplay = document.querySelector('.display-top')
const btmDisplay = document.querySelector('.display-bottom')
const numBtns = document.querySelectorAll('button.num');



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

function updateDisplays(input){
  const [a,op,b] = splitEquation(btmDisplay.textContent);
  const previousInput = btmDisplay.textContent[btmDisplay.textContent.length-1];

  if (isNaN(input) && previousInput === input && input !== '.') {
    if (topDisplay.textContent) {
      const [,,newA] = splitEquation(topDisplay.textContent);
      updateTopDisplay(newA.slice(0,-1));
    } else {
      
      updateTopDisplay(a);
    }
    const result = calculate(a,a,op);
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

  if (result) {
    btmDisplay.textContent = result;
    console.log(input);
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
  topDisplay.textContent = ' ';
  btmDisplay.textContent = 0;
  currentOp = '';
})

const opBtns = document.querySelectorAll('.op');
opBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    updateDisplays(btn.textContent);
  })
})

const equalBtn = document.querySelector('.equals');
equalBtn.addEventListener('click', () => {
  updateDisplays('=');
})




function calculate(a,b,op){
  const operations = {
    '+': (a,b) => a+b,
    '-': (a,b) => a-b,
    '×': (a,b) => a*b,
    '÷': (a,b) => a/b,
  }

  return operations[op](+a,+b);
}