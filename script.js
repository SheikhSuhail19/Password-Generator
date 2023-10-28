const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;
setIndicator("#ccc");

handleSlider();

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomUpperCase() {
    return String.fromCharCode(generateRandomInteger(65, 91));
}

function generateRandomLowerCase() {
    return String.fromCharCode(generateRandomInteger(97, 123));
}

function generateRandomNumber() {
    return generateRandomInteger(0, 9);
}

function generateRandomSymbol() {
    const index = generateRandomInteger(0, symbols.length)
    return symbols.charAt(index);
}

function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    // Strong - Good - Weak
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //To make span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    // Special Condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((ele) => (str += ele));
    return str;
}

generateBtn.addEventListener('click', () => {
    // None of the checkbox is selected
    if (checkCount == 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Let's start the journey to find new password
    console.log("Starting the Journey");
    // Remove old password
    password = "";

    // Let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateRandomUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateRandomLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateRandomSymbol);

    // Compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    // Remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = generateRandomInteger(0, funcArr.length);
        console.log("randIndex: " + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");

    // Shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    // Show in UI
    passwordDisplay.value = password;
    console.log("Password: ", password);

    // Calculate strength
    calculateStrength();
})