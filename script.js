const $gameBoard = document.getElementById('board'),
    $startOverButton = document.getElementById('start'),
    $N = document.getElementById('N'),
    $M = document.getElementById('M'),
    $NButton = document.getElementById('NButton'),
    $MButton = document.getElementById('MButton'),
    $URLButton = document.getElementById('URLButton'),
    $URL = document.getElementById('URL'),
    $gameStatus = document.getElementById('gameStatus'),
    $divN = document.getElementById('divN'),
    $divM = document.getElementById('divM'),
    $divURL = document.getElementById('divURL');



    let rowNumber=0,
    winNumber,
    currentPlayer = 'X',
    XArray = [],
    OArray = [],
    XArrayBackUp = [],
    OArrayackUp = [],
    winner = false,
    tie = false,
    numbers = /^[-+]?[0-9]+$/,
    url;

    
    ////getting url from teh user
    const getURL = () => {
        url = $URL.value;
        console.log(url);
        $divURL.classList.add('done');
        $divN.classList.remove('done');

    }
    
    ////choosing row number
    const rowNumer = () => {
        rowNumber = $N.value;
        if((!rowNumber.match(numbers))) {
            alert('You Must Enter A Number')
            return false;
        }
        console.log(typeof rowNumber);
        $divN.classList.add('done');
        $divM.classList.remove('done');

    }

    ////creaing the board
    const initialCards = () => {
        winNumber = $M.value;
        console.log(winNumber);
        if(!winNumber.match(numbers) ) {
            alert('You Must Enter A Number')
            return false;
        }

        for(let i=0; i<rowNumber; i++){
            const liElement = document.createElement('li');
            //   liElement.id = hero;
            //   hero = hero.replace(/[0-9]/g, '');
              liElement.dataset.id = i;
               $gameBoard.appendChild(liElement);
     
        }

        $divM.classList.add('done');
        $gameBoard.classList.remove('finish');
        $gameBoard.classList.remove('hide');
        currentPlayer = 'X';
        XArray = [];
        OArray = [];
        XArrayBackUp = [];
        OArrayBackUp = [];
        tie = false;
        winner = false;
        gamePlayer();
    }

///staring the game
    const startGame = () => {
        $gameBoard.innerHTML = "";
        $divURL.classList.remove('done');
        $gameBoard.classList.add('hide');
        $startOverButton.classList.add('hide');

        // $divM.classList.remove('done');
    }

////switching player
    const gamePlayer = () => {
        $gameStatus.innerText = ""
        $gameStatus.innerText = `Current Player is ${currentPlayer}`;
    }

///when user select card
const selectedCard = ($event) => {
    isLiElement = $event.target.nodeName === 'LI';
    if (!isLiElement ||  $event.target.classList.contains('open')) {
        return false;
    }
    

    $event.target.classList.add('open');
    $event.target.innerText = currentPlayer;

    if(currentPlayer === "X"){
        XArray.push($event.target.dataset.id);
        XArrayBackUp.push($event.target.dataset.id);
        console.log(XArray);
    }else{
        OArray.push($event.target.dataset.id);
        OArrayBackUp.push($event.target.dataset.id);
        console.log(OArray);
    }

    checkGameStatus();

    if(winner === false && tie === false) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        gamePlayer();
    }


    }

    /////check what is the status of the game
    checkGameStatus = () => {

        let count = 1,
        openCards = Array.from(document.getElementsByClassName('open'));
        console.log(openCards);
        
       if(currentPlayer === 'X'){
            let sortedXArray = XArray.sort(function(x, y)
            {
            return x - y;})
            
            console.log(sortedXArray);
                
            for(let i=0; i<sortedXArray.length-1; i++){
                if(sortedXArray[i+1] - sortedXArray[i] === 1){
                    count++;
                }
            }

            console.log(count, winNumber);


       } else {

        let sortedOArray = OArray.sort(function(x, y)
        {
        return x - y;})
        
        console.log(sortedOArray);
            
        for(let i=0; i<sortedOArray.length-1; i++){
            if(sortedOArray[i+1] - sortedOArray[i] === 1){
                count++;
            }
        }
        console.log(count, winNumber);

       }

       if(count >= winNumber) {
        $gameStatus.innerText = ""
        $gameStatus.innerText = `Winner Player is ${currentPlayer}`;
        winner = true;
        $gameBoard.classList.add('finish');
        $startOverButton.classList.remove('hide');
        setData(currentPlayer);

    } else {
        if(openCards.length == rowNumber){
            $gameStatus.innerText = ""
            $gameStatus.innerText = `Its a tie`;
            $startOverButton.classList.remove('hide');
            tie = true;
           }
    }

    }

////save data on slected user URL
    const setData = async(currentPlayer) => {
        let data = [];
        if(currentPlayer === 'X'){
                 for(let i=0; i<XArrayBackUp.length; i++){
                    data.push(`Move number ${i+1} is card number ${XArrayBackUp[i]}`) 
         }
        }else {
            for(let i=0; i<OArrayBackUp.length; i++){
                data.push(`Move number ${i+1} is card number ${OArrayBackUp[i]}`) 
        }
    }
        const response= await fetch(url, {
            method: 'POST', // or 'PUT'
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })

          const content = await response.json();
          console.log(content);

        }



///event listeners

$NButton.addEventListener('click', rowNumer);
$MButton.addEventListener('click', initialCards);
$startOverButton.addEventListener('click', startGame);
$gameBoard.addEventListener('click',selectedCard),
$URLButton.addEventListener('click', getURL);