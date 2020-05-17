var divLetterContainer = document.getElementById("letter-container")
var letters = []; //保存所有的字母
var moveTimer, produceTimer; //保存移动和产生字母的计时器id
var maxLost = 10; //最多丢失的数量
var curLost = 0; //当前丢失的数量
var score = 0; //当前的得分
/**
 * 创建一个字母
 */
function createLetter() {
    var letter = {}; //字母对象
    //dom元素
    letter.dom = document.createElement("div");
    letter.dom.className = "letter";
    divLetterContainer.appendChild(letter.dom);

    //坐标
    var maxLeft = divLetterContainer.clientWidth - 100; //最大的横坐标
    letter.left = getRandom(0, maxLeft); //横坐标随机
    letter.top = -100;

    //字母
    //根据一个随机的ASCII编码，产生一个字符串
    letter.value = String.fromCharCode(getRandom(65, 91));
    letter.dom.style.background = "url(./img/letter/" + letter.value + ".png)";

    //字母的速度 (像素/秒)
    letter.speed = getRandom(20 + score / 10, 120 + score / 10); //随机产生一个速度

    //显示方法，该方法的作用，是重新设置dom元素的相关属性，保持跟自身的属性一致
    letter.show = function () {
        this.dom.style.left = this.left + "px";
        this.dom.style.top = this.top + "px";
    }

    //消失方法: 让dom对象从页面移除，同时数组中移除
    letter.kill = function () {
        this.dom.remove(); //移除dom
        var index = letters.indexOf(this)
        letters.splice(index, 1);
    }

    //移动方法 (改变top值)
    //duration: 经过的时间（秒）
    letter.move = function (duration) {
        var dis = this.speed * duration; //移动的距离
        this.top += dis;
        this.show();
        //移动到一定程度时，需要自杀
        if (this.top >= divLetterContainer.clientHeight) {
            this.kill();
            //丢失了
            curLost++;
            showBoard();
            if (curLost >= maxLost) {
                //丢失数量到达最大值
                stop();
            }
        }
    }
    letter.show();

    letters.push(letter); //把当前对象加入到数组中
}

/**
 * 产生一个最小值到最大值之间的随机整数
 * @param {*} min 
 * @param {*} max 取不到最大值
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 移动所有的字母
 */
function moveAll() {
    moveTimer = setInterval(function () {
        //循环所有字母，移动每一个字母
        for (var i = 0; i < letters.length; i++) {
            letters[i].move(16 / 1000);
        }
    }, 16)
}

/**
 * 不断的产生字母
 */
function produceLetter() {
    produceTimer = setInterval(createLetter, 500);
}

/**
 * 显示计分板
 */
function showBoard() {
    var divBoard = document.getElementById("board");
    divBoard.innerHTML = "<p>得分：" + score + "</p><p>丢失：" + curLost + "/" + maxLost + "</p>"
}

/**
 * 游戏开始
 */
function start() {
    produceLetter();
    moveAll();
    showBoard();
}

/**
 * 游戏结束，停止所有的东西
 */
function stop() {
    clearInterval(moveTimer)
    clearInterval(produceTimer)
    //显示游戏结束的div
    document.getElementById("over").style.display = "block";
}


start(); //开始游戏

//注册键盘事件，消除对应的字母
window.onkeydown = function (e) {
    var key = e.key.toUpperCase();
   
    for (var i = 0; i < letters.length; i++) {
        var letter = letters[i];
        if (letter.value === key) {
            //消除
            letter.kill();
            //得分
            score += 10; //每个得十分
            showBoard();
            return; //每次只消除一个，所以要结束循环
        }
    }

    //这个时候表示按错了
    score -= 5;
    if (score < 0) score = 0;
    showBoard();
}