var arrayDisplay = document.getElementById('arrayDisplay');
var listSizeInput = document.getElementById('listSizeInput');
var search_algo = document.getElementById('search_algo');
var searchInput = document.getElementById('searchInput');

var searchResult = document.getElementById('search_result');
var timeTakenElement = document.getElementById('time_taken');

var randomArray = [];
var speed = 0;

function changeSpeed(value) {
    speed = value;
}

function randomizeArray() {
    const arrayLength = listSizeInput.value;
    let value = 0;
    const array = Array.from({ length: arrayLength }, () => Math.floor(Math.random() * arrayLength * 1000));

    updateArrayInDOM(array);
}

function updateArrayInDOM(array) {
    clearResults();

    let template = `<ul>{{list}}</ul>`;

    let list = ``;
    array.forEach((ele) => {
        list += `<li><box id="box_${ele}">${ele}<box></li>`;
    });

    randomArray = array;

    template = template.replace('{{list}}', list);
    arrayDisplay.innerHTML = template;
}

function startSearch() {
    clearResults();

    switch (Number(search_algo.selectedOptions[0].id)) {
        case 1:
            linearSearch();
            break;
        case 2:
            binarySearch();
            break;
        case 3:
            // perform Selection sort
            break;
        case 4:
            // perform bubble sort
            break;
    }
}

async function linearSearch() {
    toggleSearchingText(true);
    let startTimer = performance.now();
    for (let i = 0; i < randomArray.length; i++) {
        let ele = randomArray[i];
        let elementInDOM = document.getElementById(`box_${ele}`);
        if (document.getElementsByClassName('box-scale').length > 0) {
            document.getElementsByClassName('box-scale')[0].classList.remove('box-scale', 'error', 'success');
        }

        if (ele === Number(searchInput.value)) {
            elementInDOM.classList.add('box-scale', 'success');
            displayResults(performance.now() - startTimer, Number(searchInput.value), true);
            break;
        } else {
            if (i === (randomArray.length - 1)) {
                displayResults(performance.now() - startTimer, Number(searchInput.value), false);
            } else {
                elementInDOM.classList.add('box-scale', 'error');
            }
        }
        await wait();
    }
}

async function binarySearch() {
    toggleSearchingText(true);
    let startTimer = performance.now();
    let resultFound = false;;

    randomArray.sort((a, b) => a - b);
    updateArrayInDOM(randomArray);

    let startIndex = 0;
    let endIndex = randomArray.length - 1;
    let mid = Math.floor((endIndex + startIndex) / 2);

    if(endIndex - startIndex === 1) {
        resultFound = true;
        displayResults(performance.now() - startTimer, Number(searchInput.value), false);
    }

    while(!resultFound) {
        let ele = randomArray[mid];
        let elementInDOM = document.getElementById(`box_${ele}`);
        if (document.getElementsByClassName('box-scale').length > 0) {
            document.getElementsByClassName('box-scale')[0].classList.remove('box-scale', 'error', 'success');
        }

        if(ele > Number(searchInput.value)) {
            endIndex = mid;
            mid = Math.floor((endIndex + startIndex) / 2);
        } else if (ele < Number(searchInput.value)) {
            startIndex = mid;
            mid = Math.floor((endIndex + startIndex) / 2);
        }
        
        if(ele === Number(searchInput.value)) {
            elementInDOM.classList.add('box-scale', 'success');
            displayResults(performance.now() - startTimer, Number(searchInput.value), true);
            resultFound = true;
        } else {
            elementInDOM.classList.add('box-scale', 'error');
        }

        if(endIndex - startIndex === 1) {
            resultFound = true;
            displayResults(performance.now() - startTimer, Number(searchInput.value), false);
        }

        await wait();
    }
}


async function wait() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, speed);
    });
}

function displayResults(timeTaken, searchEle, isSearchSuccessful) {
    toggleSearchingText(false);
    searchResult.innerHTML = `Found ${searchEle}`;

    if (!isSearchSuccessful) {
        searchResult.innerHTML = `Not ${searchResult.innerHTML}`;
    }

    timeTakenElement.innerHTML = `Time taken ${(timeTaken / 1000).toFixed(2)} seconds`;
}

function clearResults() {
    searchResult.innerHTML = '';
    timeTakenElement.innerHTML = '';
}

function toggleSearchingText(show) {
    if (show) {
        document.getElementById('searching').classList.remove('hidden');
    } else {
        document.getElementById('searching').classList.add('hidden');
    }
}