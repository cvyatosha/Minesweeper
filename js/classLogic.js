function rand(number1, number2){  // функція рандома 
    return Math.floor(Math.random() * (number2 - number1 + 1) + number1);
}

document.querySelector('.restar-btn').onclick = function (){  location.reload() };

class Minesweeper {
    
    constructor (gameZone, mapSize = prompt('Write map size, only one side if you want take 10x10 map you need to write 10', 7)) 
    {
        this.map = [];
        this.rowLenght = mapSize;
        this.countFlag = mapSize;
        this.countAllBomb = mapSize;
        this.findBomb = 0

        let BombCount = 0;

        //  Generate map  ---------------------------------------------------------------
        for (let i = 0; i < mapSize; i++) {
            this.map[i] = [];
            
            for (let j = 0; j < mapSize; j++) {
                this.map[i][j] = ' ';
            }
        }

        //  Generate bomb and cell count bomb arround----------------------------------------------
        while (BombCount < mapSize ) {
            let x = rand(0, mapSize - 1);
            let y = rand(0, mapSize - 1);
    
            if (this.map[x][y] != 'bomb')
            {
                this.map[x][y] = 'bomb';   
                BombCount++;  
                
                for (let i = x - 1; i <= x + 1; i++) {
                    if ((x == 0 && i == x - 1) || (x == mapSize - 1 && i == x + 1)) {
                        continue;
                    }

                    for (let j = y - 1; j <= y + 1; j++) {
                        if ((y == 0 && j == y - 1) || (y == mapSize - 1 && j == y + 1)) {
                            continue;
                        }

                        if ((this.map[i][j] != null && this.map[i][j] != undefined) && this.map[i][j] != 'bomb') {
                            this.map[i][j]++;
                        } 
                    }
                }
            }
        }

        //  inner map and info ---------------------------------------------------------------
        this.map.forEach((row, x) => {
            row.forEach((element, y) => {
                let cell = document.createElement("div");
                cell.className = 'cell partition';
                
                cell.setAttribute('x', x);
                cell.setAttribute('y', y);
                
                gameZone.appendChild(cell);
            });
        });

        gameZone.style.width = mapSize * document.querySelector('.cell').offsetWidth +'px';
        gameZone.style.height = mapSize * document.querySelector('.cell').offsetHeight +'px';

        document.querySelector('.info-map-size').innerHTML = 'Map: ' + mapSize + 'x' + mapSize;
        document.querySelector('.info-flag').innerHTML = '🚩: ' + this.countFlag;

    }

    openAllCels() {
        let cellNumber = 0,
            cells = document.querySelectorAll('.cell');

        this.map.forEach((row, i)=> {
            for (let j = 0; j <= row.length - 1; j++) {

                if (this.map[i][j] == 'bomb') {
                    cells[cellNumber].innerHTML = '&#128163;';
                    cells[cellNumber].className += ' bomb';
                    cells[cellNumber].style.background = 'rgb(' +  rand(100, 255) + ',' +  rand(100, 255) + ',' +  rand(100, 255) + ')';
                } else {
                    cells[cellNumber].innerHTML = this.map[i][j];
                }
                cells[cellNumber].classList.remove('flag');
                cells[cellNumber].classList.remove('partition');

                cellNumber++;
            }
        });

    }

    winCheck() {
        if (this.findBomb == this.countAllBomb) {
            document.querySelector('.info-alert').style.display = 'block';
            document.querySelector('.info-alert-text').innerHTML = 'You stay alive, it`s nice';

            this.openAllCels();
        }
    }

    flag(cell){
        let x = cell.getAttribute('x'),
            y = cell.getAttribute('y');

        if (cell.classList.contains('partition')) 
        {
            if (!cell.classList.contains('flag') && this.countFlag > 0)
            {
                cell.classList.add('flag');

                if (this.map[x][y] == 'bomb' && cell.classList.contains('flag')) 
                {
                    this.findBomb++;
                }

                this.countFlag--;
            }
            else if (cell.classList.contains('flag') )
            {
                
                if (this.map[x][y] == 'bomb' && cell.classList.contains('flag')) 
                {
                    this.findBomb--;
                }
        
                cell.classList.remove('flag');
                this.countFlag++;
            } 
        }

        document.querySelector('.info-flag').innerHTML = '🚩: ' + this.countFlag;
        this.winCheck();
    }

    checkCell(cell){
        let x = cell.getAttribute('x'),
            y = cell.getAttribute('y');

        if (this.map[x][y] == 'bomb') {
            cell.innerHTML = '&#128163;';
            cell.className += ' bomb';
            cell.style.background = 'rgb(' +  rand(100, 255) + ',' +  rand(100, 255) + ',' +  rand(100, 255) + ')';

            document.querySelector('.info-alert').style.display = 'block';
            document.querySelector('.info-alert-text').innerHTML = 'You lose';

            this.openAllCels();
        } else if (this.map[x][y] == ' ') {
            let cellNumber = Number(this.rowLenght * x) + Number(y),
                cells = document.querySelectorAll('.cell'),
                canMove = true,
                fuckingLoop = 0;

            cell.innerHTML = this.map[x][y];
            cell.classList.remove('partition');
                
            while (canMove) {
                if(fuckingLoop >= 100){
                    break;
                }

                if (x > 0 && this.map[x - 1][y] == ' ' && cells[cellNumber - Number(this.rowLenght)].classList.contains('partition') == true) {
                    x -= 1;
                    cellNumber -= Number(this.rowLenght);
                } else if (y < this.rowLenght - 1 && this.map[x][y + Number(1)] == ' ' && cells[cellNumber + Number(1)].classList.contains('partition') == true) {
                    y += 1;
                    cellNumber += 1;
                } else if (x < this.rowLenght - 1 && this.map[x + Number(1)][y] == ' ' && cells[cellNumber + Number(this.rowLenght)].classList.contains('partition') == true) {
                    x += 1;
                    cellNumber += Number(this.rowLenght);
                } else if (y > 0 && this.map[x][y - 1] == ' ' && cells[cellNumber - 1].classList.contains('partition') == true) {
                    y -= 1;
                    cellNumber -= 1;
                } else {
                    canMove = false;
                }

                cells[cellNumber].innerHTML = this.map[x][y];
                cells[cellNumber].classList.remove('partition');
                fuckingLoop++;
            }

        } else {
            cell.innerHTML = this.map[x][y];
            cell.classList.remove('partition');
        } 
    }
}

let game = new Minesweeper(document.querySelector('#gameZone'));

document.querySelectorAll('.cell').forEach(cell => {
    cell.onclick = function () {
        if (!cell.classList.contains('flag')) {
            game.checkCell(cell);
        }
    };
    
    cell.oncontextmenu = function () {
        event.preventDefault();

        game.flag(cell) 
    };
});