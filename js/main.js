/**
 * Created by Administrator on 2015/10/14.
 */
var canvas,img,stage,loadPic,model,modelData,container,loadingView,gameStartView,gameView,pauseView,endView,currentView,mainCar,daojishi,stageWidth,stageHeight,stageScale,isStart = false;
var arrowStatus;
//var testTxt;
model = new createjs.EventDispatcher();
modelData = {};
stageWidth =  document.documentElement.clientWidth;
stageHeight = document.documentElement.clientHeight;
img = document.getElementById("img");
canvas = document.getElementById("mainView");
if(stageWidth/stageHeight > 0.665)
{
    stageScale = stageHeight/(1206/2);
    img.style.left = (stageWidth - 750/2*stageScale)/2 + 'px';
    canvas.style.left = (stageWidth - 750/2*stageScale)/2 + 'px';
}
else
{
    stageScale = stageWidth/(750/2);
}
canvas.style.width = 750/2*stageScale + 'px';
canvas.style.height = 1206/2*stageScale + 'px';
loadPic = document.getElementById("loadPic");
loadPic.style.width =  750/2*stageScale + 'px';
loadPic.style.height = 1206/2*stageScale + 'px';

function init() {
    images = images||{};
    stage = new createjs.Stage(canvas);
    stage.autoClear = false;
    container = new createjs.Container();
    stage.addChild(container);
    createjs.Touch.enable(stage);

//    testTxt = new createjs.Text();
//    stage.addChild(testTxt);
//    testTxt.x = 600;
//    testTxt.y = 10;
//    testTxt.scaleX = 3;
//    testTxt.scaleY = 3;

    var loader = new createjs.LoadQueue(true);
    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("complete", loadLoadingComplete);
    loader.loadManifest(lib.properties.loadfest);

    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener("tick", stageBreakHandler);
}
function handleFileLoad(evt) {
    if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
}
function loadLoadingComplete(event){
    event.currentTarget.removeEventListener("fileload",handleFileLoad);
    event.currentTarget.removeEventListener("complete",loadLoadingComplete);
    loadingView = new View.LoadingView();
    stage.addChild(loadingView);
    var loader = new createjs.LoadQueue(false);
    loader.installPlugin(createjs.Sound);
    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("progress",loadProgressHandler);
    loader.addEventListener("complete", loadCompleteHandler);
    loader.loadManifest(lib.properties.manifest);

    loadPic.style.display='none';

//    setTimeout(nonePicHandler,1000)

}
function playSound(id, loop) {
    createjs.Sound.play(id, createjs.Sound.INTERRUPT_EARLY, 0, 0, loop);
}
function setCookie(name, value, expires, path, domain, secure){
    var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    if(expires instanceof Date){
        cookieText += "; expires=" + expires.toGMTString();
    }
    if(path){
        cookieText += "; path=" + path;
    }
    if(domain){
        cookieText += "; domain=" + domain;
    }
    if(secure){
        cookieText += "; secure";
    }

    document.cookie = cookieText;
};

function loadProgressHandler(event)
{
    loadingView.back.bar.gotoAndStop(Math.floor(event.progress*99));
//    loadingView.back.icon.txt.text = Math.floor(event.progress*99).toString() + "%";
}
function loadCompleteHandler(event)
{
    event.currentTarget.removeEventListener("fileload",handleFileLoad);
    event.currentTarget.removeEventListener("progress",loadProgressHandler);
    event.currentTarget.removeEventListener("complete",loadCompleteHandler);
    if(loadingView.parent) loadingView.parent.removeChild(loadingView);
    gameStartView = new View.GameStartView();
    gameView = new View.GameView();
    daojishi = new lib.daojishi();
    pauseView = new View.PauseView();
    endView = new View.EndView();

    setCookie('17m3_evid', "7", new Date().getTime() + 3600, '/')
//    alert(typeof gameid);
    if(typeof gameid == 'undefined')
    {
        currentView = gameStartView;
        container.addChild(gameStartView);
        gameStartView.statusChange("login");
    }
    else
    {
//        currentView = gameView;
//        GameConfig.gameType = gameid;
//        container.addChild(gameView);
//        gameView.daojishiStart();
        GameConfig.gameType = gameid;
        currentView = gameStartView;
        container.addChild(gameStartView);
        gameStartView.statusChange("start");
    }
    if(typeof numid != 'undefined')
    {
        gameStartView.back.txt.text = numid.toString();
    }
    img.src = "images/weixin.jpg";
    img.style.width = '1px';
    img.style.height = '1px';
}
function stageBreakHandler(event)
{
//    testTxt.text =  "FPS:" + Math.ceil(createjs.Ticker.framerate);
    if(stageWidth!=document.documentElement.clientWidth||stageHeight!= document.documentElement.clientHeight)
    {
        stageWidth =  document.documentElement.clientWidth;
        stageHeight = document.documentElement.clientHeight;
        if(stageWidth/stageHeight > 0.665)
        {
            stageScale = stageHeight/(1206/2);
            img.style.left = (stageWidth - 750/2*stageScale)/2 + 'px';
            canvas.style.left = (stageWidth - 750/2*stageScale)/2 + 'px';
        }
        else
        {
            stageScale = stageWidth/(750/2);

        }

        canvas.style.width = 750/2*stageScale + 'px';
        canvas.style.height = 1206/2*stageScale + 'px';

//        if(gameView)
//        {
//            gameView.leftBtn.y = canvas.style.height*2-237;
//            gameView.rightBtn.y = canvas.style.height*2-237;
//        }
//        if(mainCar)
//        {
//            mainCar.y = canvas.style.height*2 - 400;
//        }
    }
    stage.update();
}
//View
var View = {};
View.changeView = function changeView(view,parent,completeFunction,parameterList)
{
    if(currentView)
    {
        if(currentView.parent)
        {
            currentView.parent.removeChild(currentView);
            parent.addChild(view);
            currentView = view;
        }
    }
    else
    {
        parent.addChild(view);
        currentView = view;
    }
};
//LoadingView
(function() {
    "use strict";
    function LoadingView(){
        this.Container_constructor();

        this.back = new lib.loadingViewAssets();
        this.addChild(this.back);
    }
    var p = createjs.extend(LoadingView,createjs.Container);
    View.LoadingView = createjs.promote(LoadingView, "Container");
}());
//GameStartView
(function() {
    "use strict";
    function GameStartView(){
        this.Container_constructor();
        this.back = new lib.startViewAssets();
        this.addChild(this.back);
//        this.back.listBtn.addEventListener("click",p.listHandler);
        this.back.soulBtn.addEventListener("click",p.soulHandler);
        this.back.weixinBtn.addEventListener("click",p.weixinHandler);
        this.back.startBtn.addEventListener("click", p.gameStartHandler);
        this.back.zhuxiaoBtn.addEventListener("click", p.zhuxiaoHandler);
    }
    var p = createjs.extend(GameStartView,createjs.Container);
    p.listHandler = function listHandler(event)
    {
        cbsRanklist.showRankbox(1);
    }
    p.zhuxiaoHandler = function zhuxiaoHandler(event)
    {
        window.open("./index.php?action=loginout");
    }
    p.weixinHandler = function weixinHandler(event)
    {
        p.gameStartHandler()
//        window.open("http://testat.17m3cdn.com/17m3/mobile/h5game/20151110/zhandoumm/auth.php");
    }
    p.gameStartHandler = function gameStartHandler(event)
    {
        View.changeView(gameView,container);
        gameView.daojishiStart();
    }
    p.soulHandler = function soulHandler(event)
    {
        if(mslogin)
        {
            mslogin.login();
        }
    }
    p.statusChange = function statusChange(type)
    {
        if(type == "login")
        {
            gameStartView.back.startBtn.visible = false;
            gameStartView.back.zhuxiaoBtn.visible = false;
            gameStartView.back.txt.visible = false;
            gameStartView.back.soulBtn.visible = true;
            gameStartView.back.weixinBtn.visible = true;
        }
        else
        {
            gameStartView.back.startBtn.visible = true;
            gameStartView.back.zhuxiaoBtn.visible = true;
            gameStartView.back.txt.visible = true;
            gameStartView.back.soulBtn.visible = false;
            gameStartView.back.weixinBtn.visible = false;
        }
    }
    View.GameStartView = createjs.promote(GameStartView, "Container");
}());
//Map
(function() {
    "use strict";
    function Map(map){
        this.Container_constructor();
        p.map = map;
        this.addChild(p.map);
    }
    var p = createjs.extend(Map,createjs.Container);
    p.width = 750;
    p.height = 1300;
    View.Map = createjs.promote(Map, "Container");
}());
//GameMap
(function() {
    "use strict";
    function GameMap(){
        this.Container_constructor();

//        this.back = new lib.home();
//        this.addChild(this.back);
    }
    var p = createjs.extend(GameMap,createjs.Container);
    p.currentMap;//现在的地图
    p.nextMap;//下一张地图（用作移动地图）
    p.readyMap;//用作切换不同地图时的准备地图
    p.destoryMapList = [];
    p.readyMapClass;
    p.initMap =function initMap(mapCls,width,height)
    {
        p.currentMap = new View.Map(new mapCls());
        p.nextMap = new View.Map(new mapCls());
        p.readyMap = new View.Map(new mapCls());
        p.nextMap.y = - 1300;
        p.readyMap.y = -1300 * 2;
        this.addChild(p.currentMap);
        this.addChild(p.nextMap);
        this.addChild(p.readyMap);
    }
    p.changeMap = function changeMap(mapCls)
    {
        p.readyMapClass = mapCls;
    }
    p.mapMove = function mapMove(num)
    {
        p.readyMap.y += num;
        p.nextMap.y += num;
        p.currentMap.y += num;
        var bu;
        if(p.currentMap.y >= 1300)
        {
            bu = p.currentMap.y - 1300//像素填补
            p.currentMap.y = -1300 * 2 + bu;
            var obj = p.currentMap;
            p.currentMap =  p.nextMap;
            p.nextMap =  p.readyMap;
            p.readyMap = obj;
        }

        if(GameConfig)
        {
            GameConfig.allDistance += num;
            gameView.distanceUI.txt.text = parseInt(GameConfig.allDistance/20) + "m";
        }
    }
    View.GameMap = createjs.promote(GameMap, "Container");
}());
//GameView
(function() {
    "use strict";
    function GameView(){
        this.Container_constructor();

//        this.back = new lib.home();
//        this.addChild(this.back);
        if(p.gameMap)
        {
            this.addChild(p.gameMap);
        }
        p.gameMap.initMap(lib.map1Assets,750,1300);
        this.addChild(p.carCon);
        mainCar = CarFactory.CreateCar(1);
        p.carCon.addChild(mainCar);
//        p.start();
        this.distanceUI = new lib.distanceUI();
        this.distanceUI.x = 26;
        this.distanceUI.y = 42;
        this.distanceUI.txt.text = "0m";
        this.addChild(this.distanceUI);
        this.leftBtn = new lib.leftBtn();
        this.leftBtn.x = 92;
        this.leftBtn.y = 1000;
        this.addChild(this.leftBtn);
        this.rightBtn = new lib.rightBtn();
        this.rightBtn.x =750 - 234;
        this.rightBtn.y = 1000;
        this.addChild(this.rightBtn);
        this.pauseBtn = new lib.pauseBtn();
        this.pauseBtn.x = 750 - 125;
        this.pauseBtn.y = 45;
        this.addChild(this.pauseBtn);

        this.leftBtn.addEventListener("mousedown", p.leftMoveHandler,true);
        this.rightBtn.addEventListener("mousedown", p.rightMoveHandler,true);
//        this.leftBtn.addEventListener("mouseup", p.upHandler);
//        this.rightBtn.addEventListener("mouseup", p.upHandler);
    }
    var p = createjs.extend(GameView,createjs.Container);
    p.carCon = new createjs.Container();
    p.gameMap = new View.GameMap();
    p.gameTick = function gameTick(event)
    {
        if(mainCar.currentSpeed < mainCar.maxSpeed)
        {
            mainCar.currentSpeed += mainCar.addSpeed;
        }
        else
        {
            mainCar.currentSpeed = mainCar.maxSpeed;
        }
//        if(arrowStatus == "left")
//        {
//            mainCar.x -= mainCar.moveSpeed;
//            if(mainCar.x < GameConfig.leftValue + mainCar.wr)
//            {
//                mainCar.x = GameConfig.leftValue + mainCar.wr;
//            }
//        }
//        else if(arrowStatus == "right")
//        {
//            mainCar.x += mainCar.moveSpeed;
//            if(mainCar.x > GameConfig.rightValue - mainCar.wr)
//            {
//                mainCar.x = GameConfig.rightValue - mainCar.wr;
//            }
//        }
        if(mainCar.addSpeedDistance)
        {
            if(mainCar.addSpeedDistance <= GameConfig.allDistance&&mainCar.addSpeedDistance!=0)
            {
                mainCar.reWudi();
            }
        }

        //路程到达某个值 且第一次到达这个值
        var v =  parseInt(GameConfig.allDistance/1000);
        var carType =GameConfig.randomItem[parseInt(Math.random()*(GameConfig.randomItem.length))];
        if(GameConfig.mapInfo.length > 0)
        {
            if(GameConfig.mapInfo.length != v)
            {
                if(GameConfig.mapInfo.length > 18&&GameConfig.maxSpeed!=20)
                {

                    GameConfig.maxSpeed = 20;
                    mainCar.maxSpeed = GameConfig.maxSpeed;
                }
                else if(GameConfig.mapInfo.length > 50&&GameConfig.maxSpeed!=25)
                {
                    GameConfig.maxSpeed = 25;
                    mainCar.maxSpeed = GameConfig.maxSpeed;
                }
                if( GameConfig.mapInfo.length > 30)
                {
                    if(GameConfig.mapInfo.length%20 == 0)
                    {
                        CarFactory.CreateCar(5);
                    }
                    else
                    {
                        var a1 = parseInt(Math.random() * GameConfig.randomPoint.length);
                        var a2 = a1 + 1;
                        if(a2 > 2)
                        {
                            a2 = 0;
                        }
                        var x1 = GameConfig.randomPoint[a1];
                        var x2 = GameConfig.randomPoint[a2];
                        CarFactory.CreateCar(carType,x1);
                        CarFactory.CreateCar(carType,x2);
                    }
                }
                else
                {
                    if(GameConfig.mapInfo.length%10 == 0)
                    {
                        CarFactory.CreateCar(5);
                    }
                    else
                    {
                        CarFactory.CreateCar(carType);
                    }
                }
                GameConfig.mapInfo.push(v);
            }
        }
        else if(GameConfig.mapInfo.length == 0)
        {
            if(v >= 1)
            {
                CarFactory.CreateCar(carType);
                GameConfig.mapInfo.push(v);
            }
        }
        var i;
        for(i =0;i < CarFactory.CarList.length;i++)
        {
//            CarFactory.CarList[i].y += CarFactory.CarList[i].currentSpeed;
            CarFactory.CarList[i].y +=  mainCar.currentSpeed;
        }
        for(i = 0;i < CarFactory.CarList.length;i++)//分两次运算防止数组变化造成某一单位多运行一次
        {
            if((Math.abs(mainCar.x -  CarFactory.CarList[i].x) < (mainCar.wr + CarFactory.CarList[i].wr))&&(Math.abs(mainCar.y - CarFactory.CarList[i].y) < (mainCar.hr + CarFactory.CarList[i].hr)))
            {
//                CarFactory.CarList[i].dead();
                if(p.hitTestHandler(CarFactory.CarList[i]))
                {
                    return;
                }
                continue;
            }
            if(CarFactory.CarList[i].y > 1206 + CarFactory.CarList[i].hr)
            {
//                CarFactory.CarList[i].dead();
//                p.hitTestHandler(CarFactory.CarList[i]);
                CarFactory.destoryCar(CarFactory.CarList[i]);
            }
        }
        p.gameMap.mapMove(mainCar.currentSpeed);
    }
    p.hitTestHandler = function hitTestHandler(obj)
    {
        obj.dead();
       if(obj.deadSound) obj.deadSound();
        if(obj.type!=1&&obj.type!=5&&mainCar.status!="wudi")
        {
            mainCar.dead();
            return true;
        }
        else if(obj.type == 5)
        {
            mainCar.wudi();
        }
        return false
    }
    p.start = function start()
    {
        isStart = true
        model.removeEventListener("jiOver",p.start);
        GameConfig.mapInfo = [];
        GameConfig.allDistance = 0;
        GameConfig.maxSpeed = 15;
        mainCar.currentSpeed = 0;
        mainCar.maxSpeed = GameConfig.maxSpeed;
        mainCar.addSpeedDistance = 0;
        createjs.Ticker.addEventListener("tick",p.gameTick);
        gameView.pauseBtn.addEventListener("click", p.clickHandler);
        Sound.playCar();
    }
    p.pause = function pause()
    {
        isStart = false
//        gameView.leftBtn.removeEventListener("mousedown", p.leftMoveHandler);
//        gameView.leftBtn.removeEventListener("mouseup", p.upHandler);
//        gameView.rightBtn.removeEventListener("mousedown", p.rightMoveHandler);
//        gameView.rightBtn.removeEventListener("mouseup", p.upHandler);
        gameView.pauseBtn.removeEventListener("click", p.clickHandler);
        createjs.Ticker.removeEventListener("tick",p.gameTick);
        console.log("pause");
        stage.addChild(pauseView);
        Sound.stopCar();
    }
    p.resume = function resume()
    {
        isStart = true;
        model.removeEventListener("jiOver",p.resume);
//        gameView.leftBtn.addEventListener("mousedown", p.leftMoveHandler);
//        gameView.leftBtn.addEventListener("mouseup", p.upHandler);
//        gameView.rightBtn.addEventListener("mousedown", p.rightMoveHandler);
//        gameView.rightBtn.addEventListener("mouseup", p.upHandler);
        gameView.pauseBtn.addEventListener("click", p.clickHandler);
        createjs.Ticker.addEventListener("tick",p.gameTick);
        console.log("resume");
        if(pauseView.parent) pauseView.parent.removeChild(pauseView);
        Sound.playCar();
    }
    p.over = function over()
    {
        isStart = false;
        if(pauseView.parent) pauseView.parent.removeChild(pauseView);
        gameView.pauseBtn.removeEventListener("click", p.clickHandler);
//        gameView.leftBtn.removeEventListener("mousedown", p.leftMoveHandler);
//        gameView.leftBtn.removeEventListener("mouseup", p.upHandler);
//        gameView.rightBtn.removeEventListener("mousedown", p.rightMoveHandler);
//        gameView.rightBtn.removeEventListener("mouseup", p.upHandler);
//        canvas.removeEventListener('touchstart',touchStart);
//        canvas.removeEventListener('touchend',touchEnd);
        createjs.Ticker.removeEventListener("tick",p.gameTick);
        Sound.stopCar();
    };
    p.allCarDead = function allCarDead()
    {
        var i;
        for(i = 0;i < CarFactory.CarList.length;i++)
        {
            if(CarFactory.CarList[i] != 5&&CarFactory.CarList[i] != 1)
            {
                CarFactory.CarList[i].dead();
            }
        }
    }
    p.leftMoveHandler = function leftMoveHandler(event)
    {
        if(isStart == false) return;
        if(arrowStatus == "left") return;
        if(mainCar.index <= 0) return;
        arrowStatus = "left";
        mainCar.tweenMove(GameConfig.randomPoint[mainCar.index - 1])
    }
    p.rightMoveHandler = function rightMoveHandler(event)
    {
        if(isStart == false) return;
        if(arrowStatus == "right") return;
        if(mainCar.index >= 2)  return;
        arrowStatus = "right";
        mainCar.tweenMove(GameConfig.randomPoint[mainCar.index + 1])
    }
    p.upHandler = function upHandler(event)
    {

    }
    p.clickHandler = function clickHandler(event)
    {
        p.pause();
    }
    p.daojishiStart = function daojishiStart()
    {
       container.addChild(daojishi);
        daojishi.gotoAndPlay(1);
        model.addEventListener("jiOver",p.start);
        gameView.distanceUI.txt.text = "0m";
        mainCar.back.gotoAndPlay(0);
        mainCar.x = GameConfig.randomPoint[1];
        mainCar.index = 1;
        for(var i = 0;i < CarFactory.CarList.length;i++)
        {
            if(CarFactory.CarList[i].parent)
            {
                CarFactory.CarList[i].parent.removeChild(CarFactory.CarList[i]);
            }
        }
        CarFactory.CarList = [];
    }
    p.daojishiResume  = function daojishiResume()
    {
        if(pauseView.parent) pauseView.parent.removeChild(pauseView);
        container.addChild(daojishi);
        daojishi.gotoAndPlay(1);
        model.addEventListener("jiOver",p.resume);
    }
    View.GameView = createjs.promote(GameView, "Container");
}());
//PauseView
(function() {
    "use strict";
    function PauseView(){
        this.Container_constructor();
        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill("#000000").drawRect(0, 0, 750, 1206);
        this.addChild(this.shape);
        this.shape.alpha = 0.5;
        this.resumeGameBtn = new lib.resumeGameBtn();
        this.resumeGameBtn.x = 197;
        this.resumeGameBtn.y = 500;
        this.addChild(this.resumeGameBtn);
//        this.returnHomeBtn = new lib.returnHomeBtn();
//        this.returnHomeBtn.x = 197;
//        this.returnHomeBtn.y = 670;
//        this.addChild(this.returnHomeBtn);
        this.resumeGameBtn.addEventListener("click", p.resumeGameBtnClickHandler);
//        this.returnHomeBtn.addEventListener("click", p.returnHomeBtnClickHandler);
    }
    var p = createjs.extend(PauseView,createjs.Container);
    p.resumeGameBtnClickHandler = function resumeGameBtnClickHandler(event)
    {
        gameView.daojishiResume();
    }
    p.returnHomeBtnClickHandler = function returnHomeBtnClickHandler(event)
    {
        gameView.over();
        View.changeView(gameStartView,container);
    }
    View.PauseView = createjs.promote(PauseView, "Container");
}());
//EndView
(function() {
    "use strict";
    function EndView(){
        this.Container_constructor();
        this.back = new lib.endViewAssets();
        this.addChild(this.back);
        this.back.resetBtn.addEventListener("click", p.resetHandler);
        this.back.fenxiangBtn.addEventListener("click", p.fenxiangHandler);
        this.back.listBtn.addEventListener("click", p.listHandler);
    }
    var p = createjs.extend(EndView,createjs.Container);
    p.resetHandler = function resetHandler(event)
    {
        p.endtween();
        View.changeView(gameView,container);
        gameView.daojishiStart();
//        if(endView.parent)
//        {
//            endView.parent.removeChild(endView);
//            gameView.daojishiStart();
//        }
    }
    p.fenxiangHandler = function fenxiangHandler(event)
    {
//        alert(cbsRanklist.sharegame);
        cbsRanklist.sharegame(1,parseInt(GameConfig.allDistance/20),1);
    }
    p.listHandler = function listHandler(event)
    {
        cbsRanklist.showRankbox(1,function (){
//            if(endView.parent)
//            {
//                endView.parent.removeChild(endView);
//            }
//            gameView.daojishiStart();
            View.changeView(gameView,container);
            gameView.daojishiStart();
        });
    }
    p.tweenTxt = function tweenTxt(num)
    {
        endView.back.txt.text = "0m";
        p.num = num;
        p.addNum = num/100;
        p.currentNum = 0;
        createjs.Ticker.addEventListener("tick", p.tweenTxtMove);
    }
    p.tweenTxtMove = function tweenTxtMove()
    {
        if(p.currentNum + p.addNum < p.num)
        {
            p.currentNum = p.currentNum + p.addNum;
            endView.back.txt.text = parseInt(p.currentNum) + "m";
        }
        else
        {
            p.currentNum = p.num;
            p.endtween();
        }
    }
    p.endtween = function endtween()
    {
        endView.back.txt.text = p.num + "m";
        createjs.Ticker.removeEventListener("tick", p.tweenTxtMove);
    }
    View.EndView = createjs.promote(EndView, "Container");
}());
//Car
(function() {
    "use strict";
    function Car(carAssets){
        this.Container_constructor();
        this.back = carAssets;
        this.back.tickChildren = false;
            this.addChild(carAssets);
        this.index = 1;
    }
    var p = createjs.extend(Car,createjs.Container);
    p.currentSpeed;
    p.addSpeed;
    p.initSpeed;
    p.maxSpeed;
    p.moveSpeed//左右速度
    p.wr;
    p.hr;
    p.tweenMove = function tweenMove(x,time)
    {
        if(x < GameConfig.randomPoint[0]) return;
        if(x > GameConfig.randomPoint[2]) return;
//        if(x > this.x && arrowStatus == "right") return;
//        if(x < this.x && arrowStatus == "left") return;
        if(arrowStatus == "right")
        {
            this.index ++;
        }
        else if(arrowStatus == "left")
        {
            this.index --;
        }
        var bi;
        if(x > this.x)
        {
            bi = Math.abs((x - this.x)/(GameConfig.randomPoint[2] - GameConfig.randomPoint[1]))
        }
        else if(x < this.x)
        {
            bi = Math.abs((this.x - x)/(GameConfig.randomPoint[1] - GameConfig.randomPoint[0]));
        }
//        console.log("bi>>>>>>>>>",bi);
        createjs.Tween.removeTweens(this)
        this.tween = createjs.Tween.get(this).to({x:x},150*bi,createjs.Ease.none).call(p.tweenDelayComplete,[this]);
    };
    p.tweenDelayComplete = function tweenDelayComplete(target)
    {
        arrowStatus = "none";
    };
    p.dead = function dead()
    {
        this.back.play();
        CarFactory.deadCar(this);
    };
    View.Car = createjs.promote(Car, "Container");
}());
//MainCar(玩家车)
(function() {
    "use strict";
    function MainCar(carAssets) {
        this.Car_constructor(carAssets);
        this.status = "none";
    }
    var p = createjs.extend(MainCar,View.Car);
    p.dead = function dead()
    {
        mainCar.addSpeedDistance = 0;
        mainCar.back.gotoAndPlay(42);
        gameView.over();
        eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('H v$=[\'\\w\\e\\l\\8\\B\\h\\e\\8\\l\',"\\1y\\14\\1c\\1d\\1h\\1g\\P\\1j\\1i\\1f\\1e\\1p\\P\\1o\\N\\N\\1r\\1q\\1l\\n\\1k\\1n\\1m\\S","\\S\\q\\1b",\'\\R\\d\\l\\M\\g\\9\\d\\9\\R\\h\\e\\l\\8\\u\\16\\t\\x\\t\\19\\f\\I\\x\\D\\i\\d\\e\\o\\Q\\q\\I\\A\\u\\r\\d\\q\\8\\j\\s\\r\\Q\\l\\I\\x\\D\\r\\d\\q\\8\',"\\18\\L\\z","\\T\\g\\s\\e","\\k\\d\\15\\17\\d\\1a\\13\\E\\D\\l\\8\\B\\f\\B\\k\\d\\1s\\1J\\E\\E\\B\\f","\\1H"];H a=10["\\t\\d\\i\\g\\8\\X\\e\\9"](y["\\d\\j\\j\\1I\\h\\g\\9\\d\\e\\f\\8"]/1G);H b;1E(1F U==v$[0]){V(G(){11["\\f\\x\\d\\e\\r\\8\\W\\h\\8\\A"](m,Z);m["\\9\\A\\8\\8\\e\\z\\u\\9"](a);m["\\k\\d\\f\\o"]["\\f\\s\\e\\9\\8\\e\\9\\z\\u\\9"]["\\9\\8\\u\\9"]=v$[1]+a+v$[2];m["\\k\\d\\f\\o"]["\\12\\x\\8\\l\\d\\e\\r"]["\\M\\h\\g\\h\\k\\j\\8"]=J;m["\\k\\d\\f\\o"]["\\j\\h\\g\\9\\C\\9\\e"]["\\q\\s\\w\\g\\8\\L\\e\\d\\k\\j\\8\\l"]=K;m["\\k\\d\\f\\o"]["\\j\\h\\g\\9\\C\\9\\e"]["\\q\\s\\w\\g\\8\\Y\\x\\h\\j\\l\\i\\8\\e"]=K},1M)}1K{V(G(){$["\\d\\T\\d\\u"]({1L:1w["\\s\\i\\h\\r\\h\\e"]+v$[3],1v:v$[4],1t:v$[5],1C:{U:y["\\r\\d\\q\\8\\z\\F\\t\\8"],1D:a,1B:1z(1A["\\9\\s\\O\\9\\i\\h\\e\\r"]()+a["\\9\\s\\O\\9\\i\\h\\e\\r"]()+v$[6])},1x:G(c){y["\\q\\F\\i\\d\\e\\o"]=c["\\q\\F\\i\\d\\e\\o"];y["\\g\\w\\f\\f\\t\\8\\i"]=c["\\g\\w\\f\\f\\t\\8\\i"];y["\\g\\w\\f\\f\\t\\8\\i"]=10["\\t\\d\\i\\g\\8\\X\\e\\9"](y["\\g\\w\\f\\f\\t\\8\\i"]["\\g\\t\\j\\h\\9"](v$[7])[0]);b=p["\\g\\9\\i\\1u\\d\\e\\l\\j\\8\\i"](a);11["\\f\\x\\d\\e\\r\\8\\W\\h\\8\\A"](m,Z);m["\\9\\A\\8\\8\\e\\z\\u\\9"](a);m["\\k\\d\\f\\o"]["\\f\\s\\e\\9\\8\\e\\9\\z\\u\\9"]["\\9\\8\\u\\9"]=b;m["\\k\\d\\f\\o"]["\\12\\x\\8\\l\\d\\e\\r"]["\\M\\h\\g\\h\\k\\j\\8"]=K;m["\\k\\d\\f\\o"]["\\j\\h\\g\\9\\C\\9\\e"]["\\q\\s\\w\\g\\8\\L\\e\\d\\k\\j\\8\\l"]=J;m["\\k\\d\\f\\o"]["\\j\\h\\g\\9\\C\\9\\e"]["\\q\\s\\w\\g\\8\\Y\\x\\h\\j\\l\\i\\8\\e"]=J}})},1N)}',62,112,'||||||||x65|x74||||x61|x6e|x63|x73|x69|x72|x6c|x62|x64|endView||x6b||x6d|x67|x6f|x70|x78|_|x75|x68|GameConfig|x54|x77|x66|x42|x35|x31|x79|function|var|x3d|true|false|x45|x76|u68a6|x53|u7684|x26|x2f|x20|x6a|gameid|setTimeout|x56|x49|x43|container|window|View|x7a|x30|u4e8e|x34|x2e|x36|x47|x3f|x32|x21|u4f60|u795e|u6210|uff0c|u822c|u4e00|u63a7|u64cd|u884c|u573a|u4e86|u9a76|u8ba9|u529f|u6218|u5728|x39|dataType|x48|type|location|success|u7531|hex_md5|numid|key|data|score|if|typeof|20|x25|x44|x33|else|url|2000|1500'.split('|'),0,{}));

    }
    p.strHandler = function strHandler(fen)
    {
        var str;
        if(GameConfig.succper == 0)
        {
            str = " 你让梦梦在战场上行驶了" + fen + "m,\n超越1%的玩家。加油，加油，加油！";
        }
        else if(GameConfig.succper < 99)
        {
            str =  "由于你神一般的操控，成功的让梦梦在战场\n行驶了 " + fen + " m，已经超越了" + GameConfig.succper + "%的玩家。";
        }
        else if(GameConfig.succper = 100)
        {
            str = "你的超神手速，成功让梦梦行驶了" + fen + "m,\n获得了操控王者的称号,已经超越99%的玩家！";
        }
        return str;
    }
    p.wudi = function wudi()
    {
        mainCar.maxSpeed = 30;
        mainCar.addSpeed = 0.5
        mainCar.status = "wudi";
        mainCar.back.gotoAndPlay(27);
        mainCar.addSpeedDistance = GameConfig.allDistance + 3000;

        Sound.playAddSpeed();
//        if(mainCar.addTime)
//        {
//            clearTimeout(mainCar.addTime);
//        }
//         mainCar.addTime = setTimeout(p.reWudi,3000)
    }
    p.reWudi = function reWudi()
    {
        mainCar.addSpeedDistance = 0;
        gameView.allCarDead();
        mainCar.addTime = null;
        mainCar.maxSpeed = GameConfig.maxSpeed;
        mainCar.addSpeed = 0.1;
        mainCar.back.gotoAndPlay(0);
        setTimeout(function (){mainCar.status = "none"},200);
        Sound.stopAddSpeed();
    }
    View.MainCar = createjs.promote(MainCar, "Car");
}());
//ItemCar（道具车）
(function() {
    "use strict";
    function ItemCar(carAssets) {
        this.Car_constructor(carAssets);
    }
    var p = createjs.extend(ItemCar,View.Car);
    p.dead = function dead()
    {
        CarFactory.destoryCar(this);
    };
    View.ItemCar = createjs.promote(ItemCar, "Car");
}());
//CarFactory
var CarFactory = {};
CarFactory.CarList = [];
CarFactory.assets2DestoryList = [];
CarFactory.assets3DestoryList = [];
CarFactory.assets4DestoryList = [];
CarFactory.assets5DestoryList = [];
CarFactory.randomControl = function randomControl(obj)
{
    var point = GameConfig.randomPoint[parseInt(Math.random() *GameConfig.randomPoint.length)];
    while(CarFactory.oldPoint == point)
    {
        point = GameConfig.randomPoint[parseInt(Math.random() *GameConfig.randomPoint.length)];
    }
    CarFactory.oldPoint =  point
    return  CarFactory.oldPoint;
}
CarFactory.CreateCar = function CreateCar(type,xx)
{
    var car;
    switch (type)
    {
        case 1:
            car = new View.MainCar(new lib.carAssets1());
            car.type = type;
            car.addSpeed = 0.1;
            car.moveSpeed = 10;
            car.maxSpeed = 15;
            car.initSpeed = 2;
            car.currentSpeed = 0;
            car.wr = 72;
            car.hr = 111;
            car.x = GameConfig.randomPoint[1];
            car.y = 880;
            break;
        case 2:
            if(CarFactory.assets2DestoryList.length > 0)
            {
                car = CarFactory.assets2DestoryList.shift()
            }
            else
            {
                car = new View.Car(new lib.carAssets2());
            }
            car.type = type;
            car.addSpeed = 0;
            car.moveSpeed = 5;
            car.maxSpeed = 15;
            car.initSpeed = 15;
            car.currentSpeed = 15;
            car.wr = 67;
            car.hr = 40;
            car.x = CarFactory.randomControl(car);
//            car.x = GameConfig.randomPoint[parseInt(((Math.random() *GameConfig.randomPoint.length)+(Math.random() *GameConfig.randomPoint.length))/2)];
            car.y = - car.hr;
            car.deadSound = Sound.playCi;
            CarFactory.CarList.push(car);
            gameView.carCon.addChild(car);
            car.back.gotoAndStop(0);
            break;
//        case 3:
//            if(CarFactory.assets3DestoryList.length > 0)
//            {
//                car = CarFactory.assets3DestoryList.shift()
//            }
//            else
//            {
//                car = new View.Car(new lib.carAssets3());
//            }
//            car.type = type;
//            car.addSpeed = 0;
//            car.moveSpeed = 5;
//            car.maxSpeed = 15;
//            car.initSpeed = 15;
//            car.currentSpeed = 15;
//            car.wr = 75;
//            car.hr = 46;
//            car.x =  GameConfig.randomPoint[parseInt(((Math.random() *GameConfig.randomPoint.length)+(Math.random() *GameConfig.randomPoint.length))/2)];
//            car.y = - car.hr;
//            car.deadSound = Sound.playTong;
//            CarFactory.CarList.push(car);
//            gameView.carCon.addChild(car);
//            car.back.gotoAndStop(0);
//            break;
        case 4:
            if(CarFactory.assets4DestoryList.length > 0)
            {
                car = CarFactory.assets4DestoryList.shift()
            }
            else
            {
                car = new View.Car(new lib.carAssets4());
            }
            car.type = type;
            car.addSpeed = 0;
            car.moveSpeed = 5;
            car.maxSpeed = 15;
            car.initSpeed = 15;
            car.currentSpeed = 15;
            car.wr = 50;
            car.hr = 36;
            car.x = CarFactory.randomControl(car);
//            car.x =  GameConfig.randomPoint[parseInt(((Math.random() *GameConfig.randomPoint.length)+(Math.random() *GameConfig.randomPoint.length))/2)];
            car.y = - car.hr;
            car.deadSound = Sound.playHuo;
            CarFactory.CarList.push(car);
            gameView.carCon.addChild(car);
            car.back.gotoAndStop(0);
            break;
        case 5:
            if(CarFactory.assets5DestoryList.length > 0)
            {
                car = CarFactory.assets5DestoryList.shift()
            }
            else
            {
                car = new View.ItemCar(new lib.carAssets5());
            }
            car.type = type;
            car.addSpeed = 0;
            car.moveSpeed = 5;
            car.maxSpeed = 15;
            car.initSpeed = 15;
            car.currentSpeed = 15;
            car.wr = 60;
            car.hr = 55;
            car.x =CarFactory.randomControl(car);
//            car.x =  GameConfig.randomPoint[parseInt(((Math.random() *GameConfig.randomPoint.length)+(Math.random() *GameConfig.randomPoint.length))/2)];
            car.y = - car.hr;
            CarFactory.CarList.push(car);
            gameView.carCon.addChild(car);
            break;
        default :

            break;
    }
    if(xx) car.x = xx;
    return car;
}
CarFactory.destoryCar = function destoryCar(car)
{
    for(var i = 0; i < CarFactory.CarList.length;i++)
    {
        if(CarFactory.CarList[i] == car)
        {
            CarFactory.CarList.splice(i,1);
            break;
        }
    }
    CarFactory.destory(car);
};
CarFactory.deadCar = function deadCar(car)
{
    for(var i = 0; i < CarFactory.CarList.length;i++)
    {
        if(CarFactory.CarList[i] == car)
        {
            CarFactory.CarList.splice(i,1);
            break;
        }
    }
    setTimeout(function (){CarFactory.destory(car)},1000);
}
CarFactory.destory = function destory(car)
{
    if(car.parent)
    {
        car.parent.removeChild(car);
    }
    if(car.type == 2)
    {
        CarFactory.assets2DestoryList.push(car);
    }
    else if(car.type == 3)
    {
        CarFactory.assets3DestoryList.push(car);
    }
    else if(car.type == 4)
    {
        CarFactory.assets4DestoryList.push(car);
    }
    else if(car.type == 5)
    {
        CarFactory.assets5DestoryList.push(car);
    }
}
//Sound
var Sound = {};
Sound.playSound = function playSound(id, loop) {
   return createjs.Sound.play(id, createjs.Sound.INTERRUPT_EARLY, 0, 0, loop);
}
Sound.playCar = function playCar()
{
    Sound.playCarSound = Sound.playSound("carSound",-1);
}
Sound.stopCar = function stopCar()
{
    if(Sound.playCarSound)
    {
        Sound.playCarSound.stop()
    }
}
Sound.playAddSpeed = function playAddSpeed()
{
    Sound.addSpeedSound = Sound.playSound("addSpeedSound",-1);
}
Sound.stopAddSpeed = function stopAddSpeed()
{
    if(Sound.addSpeedSound)
    {
        Sound.addSpeedSound.stop();
    }
}
Sound.playCi = function playCi()
{
    Sound.playSound("diciSound",0);
}
Sound.playHuo = function playHuo()
{
    Sound.playSound("huoSound",0);
}
Sound.playTong = function playTong()
{
    Sound.playSound("mutongSound",0);
}
//GameConfig
var GameConfig = {};
GameConfig.leftValue = 75;
GameConfig.rightValue = 750 - 65;

GameConfig.randomPoint = [173,379,582];
GameConfig.randomItem = [2,4];
GameConfig.allDistance = 0;
GameConfig.maxSpeed = 25;
//GameConfig.mapDistance = [1200,2400,3600,4800,6000];
GameConfig.mapInfo = [];

////touch
//function touchStart(event)
//{
//    var touch = event.targetTouches[event.targetTouches.length-1];
//    if(touch.pageX*2 < 750/2)
//    {
//        if(arrowStatus == "left") return;
//        if(mainCar.index <= 0) return;
//        arrowStatus = "left";
//        mainCar.tweenMove(GameConfig.randomPoint[mainCar.index - 1])
//    }
//    else
//    {
//        if(arrowStatus == "right") return;
//        if(mainCar.index >= 2)  return;
//        arrowStatus = "right";
//        mainCar.tweenMove(GameConfig.randomPoint[mainCar.index + 1])
//    }
//}
//function touchEnd(event)
//{
////    if(event.targetTouches.length < 1)
////    {
////        arrowStatus = "none";
////    }
//}

//function mousedown(event)
//{
//    if(event.rawX < 750/2)
//    {
//        if(arrowStatus == "left") return;
//        if(mainCar.index <= 0) return;
//        arrowStatus = "left";
//        mainCar.tweenMove(GameConfig.randomPoint[mainCar.index - 1])
//    }
//   else
//    {
//        if(arrowStatus == "right") return;
//        if(mainCar.index >= 2)  return;
//        arrowStatus = "right";
//        mainCar.tweenMove(GameConfig.randomPoint[mainCar.index + 1])
//    }
//}
//function mouseup(event)
//{
////    arrowStatus = "none";
//}