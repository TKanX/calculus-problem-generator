document.addEventListener("DOMContentLoaded", async function () {
  const numberInput = document.getElementById("number-input");
  const problemDisplay = document.getElementById("problem-display");

  const basicProblemBank = await fetch("problems.json")
    .then((response) => response.json())
    .then((data) => {
      const problemMap = new Map();
      Object.entries(data).forEach(([index, problem]) => {
        problemMap.set(parseInt(index), problem);
      });
      return problemMap;
    });

  function renderKaTeX(element, texString) {
    katex.render(texString, element, {
      throwOnError: false,
      displayMode: true,
    });
  }

  function randomOperation(n) {
    if (n < 101 || n > 198) {
      throw new Error(
        "Input number must be between 101 and 198 for splitting into two numbers less than 100."
      );
    }

    const lowerBound = n - 99;
    const upperBound = 99;

    const a =
      Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
    const b = n - a;

    return [a, b];
  }

  function generateProblems(num) {
    if (num <= 0) {
      return "Please enter a positive number.";
    } else if (num <= 100) {
      return basicProblemBank.get(num).problem;
    } else if (num <= 198) {
      const [a, b] = randomOperation(num);
      return `${basicProblemBank.get(a).problem} + ${
        basicProblemBank.get(b).problem
      }`;
    } else {
      let a, b;
      const minB = Math.max(1, num - 200);
      const maxB = Math.min(num - 1, 200);
      if (minB <= maxB) {
        b = Math.floor(Math.random() * (maxB - minB + 1)) + minB;
        a = num - b;
      } else {
        b = 200;
        a = num - 200;
      }
      return `(${generateProblems(a)}) + (${generateProblems(b)})`;
    }
  }

  numberInput.addEventListener("input", function () {
    const inputNumber = parseInt(this.value);

    if (isNaN(inputNumber) || inputNumber < 1) {
      problemDisplay.style.display = "none";
      return;
    } else {
      problemDisplay.style.display = "block";
    }

    problemDisplay.innerHTML = "";
    renderKaTeX(problemDisplay, generateProblems(inputNumber));
  });
});
