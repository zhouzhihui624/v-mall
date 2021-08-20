var BTN_PLAY_ID = 'play';
var BTN_PAUSE_ID = 'pause';
var BTN_STOP_ID = 'stop';
var MAIN_ID = 'mainID';
var GRADE = 'grade';
var BG_MUSIC = 'bgMusic';

var main, allRow, grade, bgMusic, stopFlag = false;


window.addEventListener('load', function() {
    main = document.getElementById(MAIN_ID); //黑白格的容器
    allRow = getAllRow(); //每一行黑白格
    grade = document.getElementById(GRADE); //当前分数
    bgMusic = document.getElementById(BG_MUSIC);

    //开始游戏（点击）
    var play = document.getElementById(BTN_PLAY_ID);
    play.onclick = startGame;

    //暂停游戏（点击）
    var pause = document.getElementById(BTN_PAUSE_ID);
    pause.onclick = pauseGame;

    //停止游戏（点击）
    var stop = document.getElementById(BTN_STOP_ID);
    stop.onclick = stopGame;

    //按键控制
    document.onkeydown = function(e) {
        keyPlay(e);
    };

    //鼠标控制
    mousePlay();
    alert("游戏规则：点击每一行中的黑色方块，如果黑色方块触碰到底部，游戏结束！");

});



//得到每一行黑白块
function getAllRow() {
    allRow = [];
    var row01 = document.querySelector('#row01');
    var row02 = document.querySelector('#row02');
    var row03 = document.querySelector('#row03');
    var row04 = document.querySelector('#row04');
    var row05 = document.querySelector('#row05');

    allRow.push(row05);
    allRow.push(row04);
    allRow.push(row03);
    allRow.push(row02);
    allRow.push(row01);

    initAllRowInfo();
    return allRow;

}

//初始化allRow数组中的信息
function initAllRowInfo() {
    for (var i = 0; i < allRow.length; i++) {
        allRow[i].hasBlackGrid = false;
        allRow[i].blackGridPos = -1;
        //把黑块全部变为白块
        var row = allRow[i].getElementsByTagName('div');
        for (var j = 0; j < row.length; j++) {
            row[j].style.background = '#fff';
            row[j].rowPos = i;
            row[j].colPos = j;
        }
    }
}

//开始游戏
function startGame() {
    stopFlag = false;

    main.style.borderTop = 'none';
    main.style.borderBottom = 'none';

    initialGame();
}

//初始化游戏，包括黑白格
function initialGame() {
    //移动黑白格
    rowMove(5, 15);
}

var timer;
//移动黑白格（lSpeed表示位移速度（定时器每触发黑白格移动的像素），tSpeed表示时间速度（定时器隔多久触发）
function rowMove(lSpeed, tSpeed) {
    clearInterval(timer);

    //让每一行黑白格进行定时移动
    var n = 1; //用于延迟 黑格的加入
    var hasBlack = false; //游戏中还没有黑格
    timer = setInterval(function() {
        var flag = false; //标识该行是否已从上往下移出了容器，如果是，则对allRow中的顺序进行调整

        for (var i = 0; i < allRow.length; i++) {
            var obj = allRow[i];

            isGameOver(obj); //判断游戏是否结束

            if (obj.offsetTop >= 530) {
                flag = true; //有行移出了容器，那么该行一定是allRow[0]

                obj.style.top = -120 + 'px';

                //将一行白格中的一个变为黑格
                //延迟时间已到 并且 该行木有黑格
                if (n > 50 && !obj.hasBlackGrid) {
                    //随机一行中第几个白格变成黑格
                    var k = Math.floor(Math.random() * 4);
                    obj.getElementsByTagName('div')[k].style.background = '#000';
                    obj.hasBlackGrid = true;
                    obj.blackGridPos = k;

                    //游戏中有黑格了
                    hasBlack = true;
                }
            }
            obj.style.top = obj.offsetTop + lSpeed + 'px';
        }
        if (!hasBlack) {
            n++;
        }

        //对移出该容器的行在allRow中的顺序进行调整，移出容器的行移动到allRow的尾部
        if (flag) {
            var tempRow01 = allRow[0];
            allRow.shift(); //删除数组的第一个元素
            allRow.push(tempRow01); //将原来位置第一的元素加入到数组的尾部

        }
    }, tSpeed);
}


//暂停游戏
function pauseGame() {
    clearInterval(timer);

    stopFlag = true;

    if (bgMusic.play) {
        bgMusic.pause();
    }
}

//停止游戏
function stopGame() {

    if (bgMusic.play) {
        bgMusic.pause();
    }
    grade.innerHTML = '0';
    clearInterval(timer);

    stopFlag = true;

    main.style.borderTop = '1px solid darkturquoise';
    main.style.borderBottom = '1px solid darkturquoise';

    allRow[0].style.top = 400 + 'px';
    allRow[1].style.top = 270 + 'px';
    allRow[2].style.top = 140 + 'px';
    allRow[3].style.top = 10 + 'px';
    allRow[4].style.top = -120 + 'px';


    initAllRowInfo();
}

//停止游戏
function stopGame() {
    //初始化分数
    grade.innerHTML = '0';
    //停止移动
    clearInterval(timer);

    stopFlag = true;

    main.style.borderTop = '1px solid darkturquoise';
    main.style.borderBottom = '1px solid darkturquoise';

    //每一行的位置初始化
    allRow[0].style.top = 400 + 'px';
    allRow[1].style.top = 270 + 'px';
    allRow[2].style.top = 140 + 'px';
    allRow[3].style.top = 10 + 'px';
    allRow[4].style.top = -120 + 'px';

    if (bgMusic.play) {
        bgMusic.pause();
    }
    initAllRowInfo();
}


//键盘控制
function keyPlay(e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    e.stopPropagation ? event.stopPropagation() : e.cancelBubble = true;

    //console.log(event.keyCode);

    if (e.keyCode == 113) { //用户按下F2，开始游戏
        startGame();
    } else if (e.keyCode == 32) { //用户按下空格键，暂停游戏
        pauseGame();
    } else if (e.keyCode == 115) { //用户按下F4，停止游戏
        stopGame();
    } else if (e.keyCode == 68 || e.keyCode == 70 || e.keyCode == 74 || e.keyCode == 75) {
        if (!stopFlag) {
            var blackRowPos = -1; //第一行具有黑格的行
            var blackGridPos = -1; // blackRowPos 该行黑格的位置
            for (var i = 0; i < allRow.length; i++) {
                if (allRow[i].hasBlackGrid) {
                    blackRowPos = i;
                    blackGridPos = allRow[i].blackGridPos;
                    break;
                }
            }

            //console.log(blackRowPos + ":" + blackGridPos);
            // D:68  F:70  J:74  K:75

            if (blackRowPos != -1 && blackGridPos != -1) {
                //对应黑格的位置，按了正确的键
                if ((e.keyCode == 68 && blackGridPos == 0) ||
                    (e.keyCode == 70 && blackGridPos == 1) ||
                    (e.keyCode == 74 && blackGridPos == 2) ||
                    (e.keyCode == 75 && blackGridPos == 3)) {

                    if (bgMusic.pause) {
                        bgMusic.play();
                    }

                    rightChange(blackRowPos, blackGridPos);

                } else {
                    //按错键咯，停止游戏，游戏结束
                    var errorGrid;
                    if (e.keyCode == 68) {
                        errorGrid = allRow[blackRowPos].getElementsByTagName('div')[0];
                    } else if (e.keyCode == 70) {
                        errorGrid = allRow[blackRowPos].getElementsByTagName('div')[1];
                    } else if (e.keyCode == 74) {
                        errorGrid = allRow[blackRowPos].getElementsByTagName('div')[2];
                    } else if (e.keyCode == 75) {
                        errorGrid = allRow[blackRowPos].getElementsByTagName('div')[3];
                    }

                    //游戏结束
                    gameOver(errorGrid);
                }
            }
        }
    }
}


//当踩到黑格时，黑格颜色发生“正确”变化
function rightChange(blackRowPos, blackGridPos) {
    //修改标志
    allRow[blackRowPos].hasBlackGrid = false;
    allRow[blackRowPos].blackGridPos = -1;
    grade.innerHTML = (parseInt(grade.innerHTML) + 1) + '';

    var grid = allRow[blackRowPos].getElementsByTagName('div')[blackGridPos];

    grid.style.background = 'green';
    setTimeout(function() {
        grid.style.background = '#fff';
    }, 50);
}


//鼠标控制
function mousePlay() {
    for (var i = 0; i < allRow.length; i++) {
        var row = allRow[i].getElementsByTagName('div');
        for (var j = 0; j < row.length; j++) {
            row[j].onclick = function() {
                //console.log(this.style.background);

                if (bgMusic.pause) {
                    bgMusic.play();
                }

                var _this = this;
                if (_this.style.background == 'rgb(0, 0, 0)') {
                    var tt = _this.parentNode;

                    //修改 这一行的 标记——没有黑格了
                    tt.hasBlackGrid = false;
                    tt.blackGridPos = -1;
                    //修改分数
                    grade.innerHTML = (parseInt(grade.innerHTML) + 1) + '';
                    _this.style.background = 'green';
                    setTimeout(function() {
                        _this.style.background = '#fff';
                    }, 50);
                } else if (_this.style.background == 'rgb(255, 255, 255)') {
                    gameOver(_this);
                }
            };
        }
    }
}



//判断游戏是否结束
function isGameOver(obj) {
    var temp1 = obj.offsetTop + obj.offsetHeight;
    var temp2 = main.offsetTop + main.offsetHeight - 20;
    if (temp1 > temp2) {
        if (obj.hasBlackGrid) {
            obj.hasBlackGrid = false;
            var index = obj.blackGridPos;
            obj.blackGridPos = -1;
            gameOver(obj.getElementsByTagName('div')[index]);
        }
    }
}

//游戏结束
function gameOver(errorGrid) {
    errorGrid.style.background = 'red';
    setTimeout(function() {
        errorGrid.style.background = '#fff';
        setTimeout(function() {
            errorGrid.style.background = 'red';
            alert('游戏结束，您最后的得分是：' + grade.innerHTML + '！');
            stopGame();
        }, 100);
    }, 100);

    if (bgMusic.play) {
        bgMusic.pause();
    }
}