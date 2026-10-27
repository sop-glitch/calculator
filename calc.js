const display = document.getElementById("display");
const history = document.getElementById("history");

let current = "0";      
let justCalculated = false;

function updateScreen() {
  display.textContent = current;
}

function addValue(value) {
  const isOperator = "+-*/%".includes(value);

  
  if (justCalculated && !isOperator) current = "0";
  justCalculated = false;

  if (current === "0" && !isOperator && value !== ".") {
    current = value;
  } else {
    const last = current.slice(-1);
    
    if (isOperator && "+-*/%".includes(last)) {
      current = current.slice(0, -1) + value;
    } else {
      current += value;
    }
  }
  updateScreen();
}

function calculate() {
  try {
   
    const expression = current.replace(/(\d+\.?\d*)%/g, "($1/100)");
    const result = Function('"use strict"; return (' + expression + ')')();

    if (!isFinite(result)) throw new Error("Math error");

    history.textContent = current + " =";
    current = String(parseFloat(result.toFixed(10)));
    justCalculated = true;
  } catch (error) {
    current = "Error";
  }
  updateScreen();
}

function clearAll() {
  current = "0";
  history.textContent = "";
  updateScreen();
}

function deleteLast() {
  current = current.length > 1 && current !== "Error" ? current.slice(0, -1) : "0";
  updateScreen();
}


document.querySelector(".buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const { value, action } = btn.dataset;

  if (value) addValue(value);
  else if (action === "equals") calculate();
  else if (action === "clear") clearAll();
  else if (action === "delete") deleteLast();
});


document.addEventListener("keydown", (e) => {
  if ("0123456789.+-*/%".includes(e.key)) addValue(e.key);
  else if (e.key === "Enter") { e.preventDefault(); calculate(); }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
});
