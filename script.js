"use strict"

let BEFORE_GAME = 1;
let DURING_GAME = 2;
let GAME_OVER = 3;
let userTurn = false;
let state = BEFORE_GAME;
let key = 1;

const reset = document.querySelector(".reset");
const cross = document.querySelector(".cross");
const zero = document.querySelector(".zero");
const playArea = document.querySelectorAll("#play-area div");
const bar = document.querySelector("#bar-ind");

// ??????????????????????????????????????????????????????????
// ??????????????????????????????????????????????????????????
// ??????????????????????????????????????????????????????????
function isMoveOver(arr){
    for(let i = 0; i < 9; i++){
        if(arr[i] == -1){
            return false;
        }
    }
    return true;
}
const checkWin = (arr,key)=>{
    if(arr[0] == key && arr[1] == key && arr[2] == key){
        return [true,1];
    }
    if(arr[3] == key && arr[4] == key && arr[5] == key){
        return [true,2];
    }
    if(arr[6] == key && arr[7] == key && arr[8] == key){
        return [true,3];
    }
    if(arr[0] == key && arr[3] == key && arr[6] == key){
        return [true,4];
    }
    if(arr[1] == key && arr[4] == key && arr[7] == key){
        return [true,5];
    }
    if(arr[2] == key && arr[5] == key && arr[8] == key){
        return [true,6];
    }
    if(arr[0] == key && arr[4] == key && arr[8] == key){
        return [true,7];
    }
    if(arr[2] == key && arr[4] == key && arr[6] == key){
        return [true,8];
    }
    return [false, -1];
}

const getCorrectPosition = (arr,key)=>{
    let records = [];
    for(let i = 0; i < 9; i++){
        if(arr[i] == -1){
            arr[i] = key;
            if(checkWin(arr,key)[0]){
                arr[i] = -1;
                return [100, i];
            }
            records.push([100 - getCorrectPosition(arr, 1-key)[0], i]);
            arr[i] = -1;
        }
    }
    
    if(records.length == 0){
        return [50, -1];
    }
    let sum = 0, maxRecordInd = 0;
    for(let i = 0; i < records.length; i++){
        sum += records[i][0];
        if(records[maxRecordInd][0] < records[i][0]){
            maxRecordInd = i;
        }
    }
    return [sum/records.length, records[maxRecordInd][1]];
}

const arr = [-1,-1,-1,-1,-1,-1,-1,-1,-1];

// ??????????????????????????????????????????????????????????
// ??????????????????????????????????????????????????????????
// ??????????????????????????????????????????????????????????

function random(a,b){
    return Math.round( a + Math.random() * (b - a));
}
function playTurnFirst(){
    let pos = random(0 , 8);
    console.log(`Position ${pos + 1}, Key ${1-key}`);

    if(key == 0){
        arr[pos] = 1;
        playArea[pos].classList.toggle("cross-bg");
    }
    else if(key == 1){
        arr[pos] = 0;
        playArea[pos].classList.toggle("zero-bg");
    }
}
function playDelayTurn(){
    let result = getCorrectPosition(arr, 1 - key);
    arr[result[1]] = 1 - key;
    if(key == 1){
        playArea[result[1]].classList.toggle("zero-bg");
    }
    else{
        playArea[result[1]].classList.toggle("cross-bg");
    }
    //Check for win of computer
    result = checkWin(arr, 1 - key);
    if(result[0]){
        setLine(result[1]);
        state = GAME_OVER;
        return;
    }
    userTurn = true;
    setBar(key);
}
function playTurn(){
    if(isMoveOver(arr)){
        state = GAME_OVER;
    }
    if(state == GAME_OVER){
        return;
    }
    setTimeout(playDelayTurn,1500);
}

function setBar(tempkey){
    if(tempkey == 0){
        bar.style.width = 100 - getCorrectPosition(arr,0)[0] + "%";
    }
    else if(tempkey == 1){
        bar.style.width = getCorrectPosition(arr, 1)[0] + "%";
    }
}

function setLine(line){
    let color = "#1F7E41";
    switch(line){
        case 1:
            playArea[0].style.backgroundColor = color;
            playArea[1].style.backgroundColor = color;
            playArea[2].style.backgroundColor = color;
            break;
        case 2:
            playArea[3].style.backgroundColor = color;
            playArea[4].style.backgroundColor = color;
            playArea[5].style.backgroundColor = color;
            break;
        case 3:
            playArea[6].style.backgroundColor = color;
            playArea[7].style.backgroundColor = color;
            playArea[8].style.backgroundColor = color;
            break;
        case 4:
            playArea[0].style.backgroundColor = color;
            playArea[3].style.backgroundColor = color;
            playArea[6].style.backgroundColor = color;
            break;
        case 5:
            playArea[1].style.backgroundColor = color;
            playArea[4].style.backgroundColor = color;
            playArea[7].style.backgroundColor = color;
            break;
        case 6:
            playArea[2].style.backgroundColor = color;
            playArea[5].style.backgroundColor = color;
            playArea[8].style.backgroundColor = color;
            break;
        case 7:
            playArea[0].style.backgroundColor = color;
            playArea[4].style.backgroundColor = color;
            playArea[8].style.backgroundColor = color;
            break;
        case 8:
            playArea[2].style.backgroundColor = color;
            playArea[4].style.backgroundColor = color;
            playArea[6].style.backgroundColor = color;
            break;
    }
}
// ??????????????????????????????????????????????????????????
// ??????????????????????????????????????????????????????????
// ??????????????????????????????????????????????????????????

cross.addEventListener("click",()=>{
    if(state === BEFORE_GAME){
        cross.classList.toggle("select-color");
        key = 1;
        state = DURING_GAME;
        if(random(1,10) <=5){
            playTurnFirst();
        }
        userTurn = true;
    }
});
zero.addEventListener("click",()=>{
    if(state === BEFORE_GAME){
        zero.classList.toggle("select-color");
        key = 0;
        state = DURING_GAME;
        if(random(1,10) <= 5){
            playTurnFirst();
        }
        userTurn = true;
    }
});
reset.addEventListener("click",()=>{
    if(state == DURING_GAME || state == GAME_OVER){
        if(key == 1){
            cross.classList.toggle("select-color");
        }
        if(key == 0){
            zero.classList.toggle("select-color");
        }
        for(let i = 0; i < 9; i++){
            if(arr[i] == 0){
                playArea[i].classList.toggle("zero-bg");
            }
            else if(arr[i] == 1){
                playArea[i].classList.toggle("cross-bg");
            }
            playArea[i].style.backgroundColor = "#7EB9A4";
            arr[i] = -1;
        }
        bar.style.width = "50%";
        state = BEFORE_GAME;
        userTurn = false;
    }
});
playArea.forEach((playBox)=>{
    playBox.addEventListener("click", ()=>{
        if(state == DURING_GAME && userTurn){
            let boxNumber = Number(playBox.classList[0][4]) - 1;
            if(arr[boxNumber] == -1){
                arr[boxNumber] = key;
                if(key == 1){
                    playBox.classList.toggle("cross-bg");
                }
                else{
                    playBox.classList.toggle("zero-bg");
                }
                setBar(1 - key);
                userTurn = false;
                //Check for win of user:
                let result = checkWin(arr, key);
                if(result[0]){
                    setLine(result[1]);
                    state = GAME_OVER;
                }
                playTurn();
            }
        }
    });
});

// ??????????????????????????????????????????????????????????
// ??????????????????????????????????????????????????????????
// ??????????????????????????????????????????????????????????