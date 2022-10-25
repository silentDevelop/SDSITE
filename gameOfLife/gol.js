    var gameTable = document.getElementById("gameTable");
    var cellsAlive = [];
    var frames = [];
    var running = false;
    const dead = "white";
    const alive = "black";
    var setCellTo = "birth";
    var rotation = 0;
    var interv = 0;

    var mouseDown = false;
    document.body.onmousedown = function() {
        mouseDown = true;
    }
    document.body.onmouseup = function() {
        mouseDown = false;
    }

    function previewsFrame() {
        frames.pop();
        try{
            var temp = frames[frames.length-1].split(",");
            killEmAll();

            for(let i = 0; i < temp.length; i++){
                birthCell(temp[i]);
            }
        } catch{            
        }
    }

    //Toggle button from killing or birthen cells on click
    function changeKill() {
        if (setCellTo == "birth") {
            document.getElementById("kill").innerHTML = "Kill Cells";
            setCellTo = "kill";
        } else {
            document.getElementById("kill").innerHTML = "Birthen Cells";
            setCellTo = "birth";
        }
    }

    function changeSquareSize() {
        var size = document.getElementById("squareSizeSelector").value;
        for (let i = 0; i < gameTable.rows.length; i++) {
            for (let q = 0; q < gameTable.rows[i].cells.length; q++){
                gameTable.rows[i].cells[q].style.width = size + "px";
                gameTable.rows[i].cells[q].style.height = size + "px";
            }
        }
    }

    //setting the rotation variable to an integer from 0 to 3
    //which determines which rotation the shape will be displayed
    function rotate() {
        if (rotation == 3) {
            rotation = 0;
        } else {
            rotation++;
        }
        changePreview();
    }

    //changing the size of the world by checking if any of the width or height slider has changed
    //if so than changing the table size by adding/removing rows/cells
    function changeTableSize() {
        var width = document.getElementById("widthSelector").value;
        var height = document.getElementById("heightSelector").value;

        while (height > gameTable.rows.length) {
            var row = gameTable.insertRow(gameTable.rows.length);
            var temp = gameTable.rows[0].cells.length;
            for (let col = 0; col < temp; col++) {
                row.insertCell(col);
                setCell((gameTable.rows.length - 1), col);
            }
            changeSquareSize();
        }

        while (height < gameTable.rows.length) {
            gameTable.deleteRow(gameTable.rows.length - 1);
        }

        while (width < gameTable.rows[gameTable.rows.length - 1].cells.length) {
            for (let i = 0; i < gameTable.rows.length; i++) {
                gameTable.rows[i].deleteCell(gameTable.rows[i].cells.length - 1);
            }
        }

        while (width > gameTable.rows[gameTable.rows.length - 1].cells.length) {
            for (let row = 0; row < gameTable.rows.length; row++) {
                gameTable.rows[row].insertCell(gameTable.rows[row].cells.length);
                setCell(row, gameTable.rows[row].cells.length - 1);
            }
            changeSquareSize();
        }
    }

    function changePreview() {
        var tab = document.getElementById("preview");
        for (let i = tab.rows.length - 1; i > -1; i--) {
            tab.deleteRow(0);
        }
        var shape = document.getElementById("shape").value;
        var W;
        var H;
        var birthen = [];
        var coord = 0 + ":" + 0;

        if (shape == "1") {
            coord = (1 + ":" + 1);
            birthen = getCells(shape, coord);
            W = 3;
            H = 3;

        } else if (shape == "2") {
            coord = (3 + ":" + 2);
            birthen = getCells(shape, coord)
            W = 5;
            H = 5;

        } else if (shape == "3") {
            coord = (3 + ":" + 2);
            birthen = getCells(shape, coord)
            W = 5;
            H = 5;

        } else if (shape == "4") {
            coord = (3 + ":" + 2);
            birthen = getCells(shape, coord)
            W = 5;
            H = 5;

        }

        for (let i = 0; i < W; i++) {
            var row = tab.insertRow(i);
            for (let q = 0; q < H; q++) {
                var cell = row.insertCell(q);
                cell.classList.add("squarePreview");
                for (let j = 0; j < birthen.length; j++) {
                    var temp = i + ":" + q;
                    if (temp == birthen[j]) {
                        cell.style.backgroundColor = alive;
                        birthen.splice(j, 1);
                    }
                }
            }
        }
    }

    function clickRun() {
        var startStop = document.getElementById("startStop");
        if (running == false) {
            running = true;
            startStop.innerHTML = "Stop Game"
            runManager();
        } else if (running = true) {
            running = false;
            startStop.innerHTML = "Start Game";
        }
    }

    function runManager() {
        setTimeout(function() {
            if (running) {
                run();
                runManager();
            }
        }, (2005 - parseInt(document.getElementById("delay").value)));
    }

    //one iteration of the simulation
    function run() {
        if(cellsAlive.length > 0) {
            if(frames.length > 100){
                array_pop(array_reverse(frames));
            }
            frames[frames.length] = cellsAlive.toString();
            document.getElementById("goBack").disabled = false;
        
            const cellsToKill = [];
            const cellsToBirth = [];
            const willLive = [];

            for (let i = 0; i < cellsAlive.length; i++) {
                var cellX = parseInt(cellsAlive[i].split(":")[0]);
                var cellY = parseInt(cellsAlive[i].split(":")[1]);
                const aliveNeighbours = getNeighbours(true, cellX, cellY);

                if (aliveNeighbours.length == 2 || aliveNeighbours.length == 3) {
                    // Let Live
                    willLive[willLive.length] = cellsAlive[i];
                } else {
                    // kill
                    cellsToKill[cellsToKill.length] = cellsAlive[i];
                }

                const deadNeighbours = getNeighbours(false, cellX, cellY);
                for (let i = 0; i < deadNeighbours.length; i++) {

                    const aliveNeighboursOfDeadNeighbour =
                        getNeighbours(true, parseInt(deadNeighbours[i].split(":")[0]), parseInt(deadNeighbours[i].split(":")[1]));
                    if (aliveNeighboursOfDeadNeighbour.length == 3) {
                        if (cellsToBirth.includes(deadNeighbours[i]) == false) {
                            cellsToBirth[cellsToBirth.length] = deadNeighbours[i];
                        }
                    }
                }
            }

            for (let i = 0; i < willLive.length; i++) {
                for (let q = 0; q < cellsToKill.length; q++) {
                    if (willLive[i] == cellsToKill[q]) {
                        cellsToKill.splice(q, 1);
                    }
                }
            }

            for (let i = 0; i < cellsToKill.length; i++) {
                killCell(cellsToKill[i]);
            }

            for (let i = 0; i < cellsToBirth.length; i++) {
                birthCell(cellsToBirth[i]);
            }
        }
    }
    
    function getNeighbours(alive, cellX, cellY) {
        const neighbours = [];
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                if (x != 0 || y != 0) {
                    if (((cellX + x) > gameTable.rows.length - 1) ||
                        ((cellX + x) < 0) ||
                        ((cellY + y) > gameTable.rows[0].cells.length) ||
                        ((cellY + y) < 0)) {

                    } else {
                        if (gameTable.rows[(cellX + x)].cells[(cellY + y)].getAttribute("alive") == "true" && alive == true) {
                            neighbours[neighbours.length] = gameTable.rows[(cellX + x)].cells[(cellY + y)].getAttribute("coord");

                        } else if (alive == false) {
                            neighbours[neighbours.length] = gameTable.rows[(cellX + x)].cells[(cellY + y)].getAttribute("coord");

                        }
                    }
                }
            }
        }

        return neighbours;
    }

    function setUpGameTable() {
        document.getElementById("kill").setAttribute("kill", true);

        var height = document.getElementById("heightSelector").value;
        var width = document.getElementById("widthSelector").value;
        for (let row = 0; row < height; row++) {
            var newRow = gameTable.insertRow(row);
            for (let column = 0; column < width; column++) {
                var cell = newRow.insertCell(column);
                setCell(row, column);
            }
        }
        changeSquareSize();
    }

    function setCell(row, col) {
        var size = document.getElementById("squareSizeSelector").value;
        var cell = gameTable.rows[row].cells[col];
        cell.setAttribute("coord", row + ":" + col);
        cell.classList.add("square");
        cell.setAttribute("alive", "false");
        cell.setAttribute('onmousedown', 'cellClick(event)');
        cell.setAttribute('onclick', 'cellClick(event)');
        cell.setAttribute('onmouseenter', 'cellEnter(event)');
        cell.setAttribute('onmouseleave', 'cellLeave(event)');
        cell.style.width = size+"px";
        cell.style.height = size+"px";
    }

    function cellClick(event) {
        var cells = getCells(document.getElementById("shape").value, event.target.getAttribute("coord"));
        if (setCellTo == "birth") {
            for (let i = 0; i < cells.length; i++) {
                birthCell(cells[i]);
            }
        } else if (setCellTo == "kill") {
            for (let i = 0; i < cells.length; i++) {
                killCell(cells[i]);
            }
        }
    }

    function cellLeave(event) {
        var shape = document.getElementById("shape").value;
        const cells = getCells(shape, event.target.getAttribute("coord"));

        if (setCellTo == "birth") {
            for (const cell of cells) {
                if (gameTable.rows[cell.split(":")[0]].cells[cell.split(":")[1]].getAttribute("alive") == "false") {
                    gameTable.rows[cell.split(":")[0]].cells[cell.split(":")[1]].style.backgroundColor = dead;
                }
            }
        } else if (setCellTo == "kill") {
            for (const cell of cells) {
                if (gameTable.rows[cell.split(":")[0]].cells[cell.split(":")[1]].getAttribute("alive") == "true") {
                    gameTable.rows[cell.split(":")[0]].cells[cell.split(":")[1]].style.backgroundColor = alive;
                }
            }
        }

        if (mouseDown) {
            cellClick(event);
        }
    }

    function cellEnter(event) {
        var shape = document.getElementById("shape").value;
        const cells = getCells(shape, event.target.getAttribute("coord"));

        if (setCellTo == "birth") {
            for (const cell of cells) {
                gameTable.rows[cell.split(":")[0]].cells[cell.split(":")[1]].style.backgroundColor = alive;
            }
        } else if (setCellTo == "kill") {
            for (const cell of cells) {
                gameTable.rows[cell.split(":")[0]].cells[cell.split(":")[1]].style.backgroundColor = dead;
            }
        }

        if (mouseDown) {
            cellClick(event);
        }
    }

    function birthCell(coord) {
        if(coord == null){

        } else {
            gameTable.rows[coord.split(":")[0]].cells[coord.split(":")[1]].style.backgroundColor = alive;
            gameTable.rows[coord.split(":")[0]].cells[coord.split(":")[1]].setAttribute("alive", "true");
            if (cellsAlive.includes(coord) == false) {
                cellsAlive[cellsAlive.length] = coord;
            }
        }
    }

    function killCell(coord) {
        gameTable.rows[coord.split(":")[0]].cells[coord.split(":")[1]].style.backgroundColor = dead;
        gameTable.rows[coord.split(":")[0]].cells[coord.split(":")[1]].setAttribute("alive", "false");
        if (cellsAlive.includes(coord)) {
            for (let i = 0; i < cellsAlive.length; i++) {
                if (cellsAlive[i] == coord) {
                    cellsAlive.splice(i, 1);
                    i = cellsAlive.length;
                }
            }
        }
    }

    function getCells(selectedShape, coord) {
        var cells = [];

        if (selectedShape == "1") {
            cells[0] = coord;

        } else if (selectedShape == "2") {
            if (rotation == 0) {
                cells[0] = coord;
                cells[1] = getWestCoord(coord);
                cells[2] = getEastCoord(coord);
                cells[3] = getNorthCoord(getEastCoord(coord));
                cells[4] = getNorthCoord(getNorthCoord(coord));

            } else if (rotation == 1) {
                cells[0] = getEastCoord(coord);
                cells[1] = getWestCoord(getNorthCoord(coord));
                cells[2] = getNorthCoord(getNorthCoord(getEastCoord(coord)));
                cells[3] = getNorthCoord(getEastCoord(coord));
                cells[4] = getNorthCoord(getNorthCoord(coord));

            } else if (rotation == 2) {
                cells[0] = coord;
                cells[1] = getWestCoord(getNorthCoord(coord));
                cells[2] = getNorthCoord(getNorthCoord(coord));
                cells[3] = getNorthCoord(getNorthCoord(getEastCoord(coord)));
                cells[4] = getNorthCoord(getNorthCoord(getWestCoord(coord)));

            } else if (rotation == 3) {
                cells[0] = coord;
                cells[1] = getWestCoord(coord);
                cells[2] = getEastCoord(getNorthCoord(coord));
                cells[3] = getNorthCoord(getWestCoord(coord));
                cells[4] = getNorthCoord(getNorthCoord(getWestCoord(coord)));

            }
        } else if (selectedShape == "3") {
            if (rotation == 0 || rotation == 2) {
                cells[0] = getNorthCoord(coord);
                cells[1] = getNorthCoord(getWestCoord(coord));
                cells[2] = getNorthCoord(getEastCoord(coord));

            } else if (rotation == 1 || rotation == 3) {
                cells[0] = coord;
                cells[1] = getNorthCoord(coord);
                cells[2] = getNorthCoord(getNorthCoord(coord));

            }
        } else if (selectedShape == "4") {
            cells[0] = coord;
            cells[1] = getNorthCoord(coord);
            cells[2] = getNorthCoord(getNorthCoord(coord));
            cells[3] = getNorthCoord(getWestCoord(coord));
            cells[4] = getNorthCoord(getEastCoord(coord));

        }

        return cells;
    }

    function getNorthCoord(coord) {
        var Y = parseInt(coord.split(":")[0]);
        var X = parseInt(coord.split(":")[1]);
        return (Y - 1) + ":" + X;
    }

    function getSouthCoord(coord) {
        var Y = parseInt(coord.split(":")[0]);
        var X = parseInt(coord.split(":")[1]);
        return (Y + 1) + ":" + X;
    }

    function getWestCoord(coord) {
        var Y = parseInt(coord.split(":")[0]);
        var X = parseInt(coord.split(":")[1]);
        return Y + ":" + (X - 1);
    }

    function getEastCoord(coord) {
        var Y = parseInt(coord.split(":")[0]);
        var X = parseInt(coord.split(":")[1]);
        return Y + ":" + (X + 1);
    }

    function sendTemp(txt, plus) {
        if (plus) {
            document.getElementById("temp").innerHTML += "<br>" + txt;
        } else {
            document.getElementById("temp").innerHTML = txt;
        }
    }

    function killEmAll(){
        for(let i = cellsAlive.length-1; i > -1; i--){
            killCell(cellsAlive[i]);
        }
    }

    document.getElementById("body").addEventListener('click', event => {
      if (event.target.classList.contains("square")) {
        cellClick(event);
      }
    });

    setUpGameTable();
    changePreview();
    document.getElementById("goBack").disabled = true;

    frames[0] = ",";