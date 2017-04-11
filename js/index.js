function init(){
  var page0;
  var stage = new createjs.Stage('canvas');
  var queue = new createjs.LoadQueue();
  queue.installPlugin(createjs.Sound);
  queue.addEventListener('progress',preload);
  queue.addEventListener('complete',start);
  queue.loadManifest(manifest);

  createjs.Ticker.setFPS(24);
  createjs.Ticker.addEventListener('tick',function (){
    stage.update();
  });

  function preload(event){
      console.log(event.progress);
      page0 = new createjs.Container();
      page0.bg = new createjs.Bitmap(
        document.getElementById('background')
      );
      page0.text = new createjs.Text('Night Run','85px Arial','#eee');
      page0.text.textAlign = 'center';
      page0.text.x = 1280 / 2;
      page0.text.y = 750 / 2  - 150;
      page0.progress = new createjs.Container();
      page0.num = new createjs.Text(Math.floor(event.progress*100) + '%','45px Arial','#eee');
      page0.num.y = 80/2 - 45/2;
      page0.num.x = 1000/2 - 45/2;
      page0.proBg = new createjs.Shape();
      page0.proBg.graphics.beginStroke('#eee').drawRect(0,0,1000,80);
      page0.proColor = new createjs.Shape();
      page0.proColor.graphics.beginFill('gray').drawRect(0,0,Math.floor(event.progress*1000),80);
      page0.progress.addChild(page0.proBg,page0.proColor,page0.num);
      page0.progress.x = 1280/2 - 1000/2;
      page0.progress.y = 750/2 - 80/2 + 150;
      page0.addChild(page0.bg,page0.text,page0.progress);
      stage.addChild(page0);
      createjs.Sound.play('GameTheme',{loop:-1});
  };

  function start(){   //载入后游戏准备开始
    queue.removeEventListener('progress',preload);
    page0.removeChild(page0.progress)
    page0.table = new createjs.Bitmap(queue.getResult('backtable'));
    page0.tableTxt = new createjs.Text('PLAY GAME','36px Arial','#EEE');
    page0.tableTxt.textAlign = 'center';
    createjs.Tween.get(page0.tableTxt,{loop:true}).to({
      'alpha':0
    },500).to({
      'alpha':1
    },500);
    page0.table.x = 1280/2 - 439/2;
    page0.table.y = 750/2 - 259/2 + 170;
    page0.tableTxt.x = 1280 / 2;
    page0.tableTxt.y = 750 / 2 + 150;

    page0.addChild(page0.table,page0.tableTxt);
  };
};
