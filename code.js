


function calculate(a,op,b){
  [a,b] = [+a,+b];
  const operations = {
    '+': (a,b) => a+b,
    '-': (a,b) => a-b,
    '×': (a,b) => a*b,
    '÷': (a,b) => a/b,
  }

  return operations[op](a,b);
}


console.log(calculate(5,'+','7'));