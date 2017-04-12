function init(){
  var page0;
  var stage = new createjs.Stage('canvas');
  var queue = new createjs.LoadQueue();
  queue.installPlugin(createjs.Sound);
  queue.addEventListener('progress',preload);
  queue.addEventListener('complete',menu);
  queue.loadManifest(manifest);

  createjs.Ticker.setFPS(24);
  createjs.Ticker.addEventListener('tick',function (){
    stage.update();
  });

  function preload(event){
      page0 = new createjs.Container();
      var page0bg = new createjs.Bitmap(
        document.getElementById('background')
      );
      var page0text = new createjs.Text('Night Run','85px Arial','#eee');
      page0text.textAlign = 'center';
      page0text.x = 1280 / 2;
      page0text.y = 750 / 2  - 150;
      var page0progress = new createjs.Container();
      console.log(event.progress);
      var page0num = new createjs.Text(Math.floor(event.progress*10) + '0%','45px Arial','#eee');
      page0num.y = 80/2 - 45/2;
      page0num.x = 1000/2 - 45/2;
      var page0proBg = new createjs.Shape();
      page0proBg.graphics.beginStroke('#eee').drawRect(0,0,1000,80);
      var page0proColor = new createjs.Shape();
      page0proColor.graphics.beginFill('gray').drawRect(0,0,Math.floor(event.progress*1000),80);
      page0progress.addChild(page0proBg,page0proColor,page0num);
      page0progress.x = 1280/2 - 1000/2;
      page0progress.y = 750/2 - 80/2 + 150;
      page0.addChild(page0bg,page0text,page0progress);
      stage.addChild(page0);
      createjs.Sound.play('GameTheme',{loop:-1});
  };

  function menu(){   //载入后游戏准备开始
    page0.removeAllChildren();
    stage.clear();
    queue.removeEventListener('progress',preload);
    //page0.removeChild(page0progress,page0num,page0proBg,page0proColor)
    /*var page0table = new createjs.Bitmap(queue.getResult('backtable'));
    var page0tableTxt = new createjs.Text('PLAY GAME','36px Arial','#EEE');
    page0tableTxt.textAlign = 'center';
    createjs.Tween.get(page0.tableTxt,{loop:true}).to({
      'alpha':0
    },500).to({
      'alpha':1
    },500);
    page0table.x = 1280/2 - 439/2;
    page0table.y = 750/2 - 259/2 + 170;
    page0tableTxt.x = 1280 / 2;
    page0tableTxt.y = 750 / 2 + 150;
    page0.addChild(page0table,page0tableTxt);
    //page0.tableTxt.addEventListener('click',start);*/
  };

  function start(event){
    page0.removeAllChildren();
    console.log(page0);
    stage.update();
  };
};
