function init(){
  var progressNum,progress;
  var page0 = new createjs.Container;
  var stage = new createjs.Stage('canvas');
  stage.addChild(page0);
  var queue = new createjs.LoadQueue();
  queue.installPlugin(createjs.Sound);
  queue.addEventListener('complete',menu);
  queue.loadManifest(manifest);

  start.call(page0,document.getElementById('background'));

  function start(img){
    this.bg = new createjs.Bitmap(img);
    this.title = new createjs.Text('Night Run','78px Arial','white');
    this.title.textAlign = 'center';
    this.title.textBaseline = 'middle';
    this.title.x = 1280/2;
    this.title.y = 750/2;
    this.num = new createjs.Text('0%','46px Arial','white');
    this.num.textAlign = 'center';
    this.num.x = 1280/2;
    this.num.y = 750/2 + 200;
    this.addChild(this.bg,this.title,this.num);
    queue.addEventListener('progress',preload);
  };

  function preload(event){
    page0.num.text = Math.floor(event.progress*100) + '%';
  };

  function menu(){
    createjs.Sound.play('GameTheme',{loop:-1});
    page0.num.text = 100 + '%';
    queue.removeEventListener('progress',preload);
    page0.removeChild(page0.num);
    page0.play = new createjs.Container();
    function playFn(){
      this.bg = new createjs.Bitmap(queue.getResult('backtable'));
      this.text = new createjs.Text('PLAY','48px Arial','white');
      this.text.textAlign = 'center';
      this.text.textBaseline = 'middle';
      this.text.x = 439 / 2;
      this.text.y = 259 / 2;
      this.x = 1280/2 - 439/2;
      this.y = 750/2 + 100;
      this.addChild(this.bg,this.text);
      this.addEventListener('click',start);
      createjs.Tween.get(this.text,{loop:true}).to({'alpha':0},1000).to({
        'alpha':1
      },100);
    };
    playFn.call(page0.play);
    page0.addChild(page0.play);
    function start(){
      page0.removeAllChildren();
      page0.bg = new createjs.Container();
      page0.addChild(page0.bg);
      function bgDw(){
        var matrix = new createjs.Matrix2D();
        var translateX = -5;
        var bgRun = setInterval(function (){
          matrix.translate(translateX,0);
        },10);
        this.black = new createjs.Shape();
        this.black.graphics.beginBitmapFill(queue.getResult('BGBlack'),'repeat-x',matrix).drawRect(0,0,1280,480);
        this.white = new createjs.Shape();
        this.white.graphics.beginBitmapFill(queue.getResult('BGWhite'),'repeat-x',matrix).drawRect(0,0,1280,480);
        this.white.y = 750/2;
        this.addChild(this.black,this.white);
      };
      bgDw.call(page0.bg);
    };
  };


  createjs.Ticker.setFPS(24);
  createjs.Ticker.addEventListener('tick',function (){
    stage.update();
  });
};
