var cbsRanklist={
	shareLink:location.origin+'/17m3/mobile/h5game/20151110/zhandoumm/index.php',//分享地址
	shareImg:location.origin+'/17m3/mobile/h5game/20151110/zhandoumm/images/weixin.jpg',//分享图片
	int:function(){
		var _t=this;
		_t.effect();
	},
	showRankbox:function(ishow,callback){
		var _t=this;
		if(ishow){//显示
			$('#maskMain').css('display','block');
			_t.ranklist(gameid);
		}else{//隐藏
			$('#maskMain').css('display','none');
		};

		if(typeof callback == "function"){
			$('.replayRankBtn').css('display','block');
			$('.backRankBtn').css('display','none');
			$('.replayRankBtn').on('touchstart',function(){
				$('#maskMain').css('display','none');
  				callback();
			});
		}else{
			$('.backRankBtn').css('display','block');
			$('.replayRankBtn').css('display','none');
			$('.backRankBtn').on('touchstart',function(){
				$('#maskMain').css('display','none');
			});
		};
	},
	effect:function(){
		var _t=this;
		//分享
		$('.shareRankBtn').on('touchstart',function(){
			_t.sharegame(0,parseInt(GameConfig.allDistance/20),1);
		});
		$('.sharemask').on('touchstart',function(){
			$(this).css('display','none');
		});

	},
	getvalByurl:function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return unescape(r[2]); return null;
	},
	ranklist:function(gameid){//gameid:    游戏ID 电魂3 微信2
		var _t=this;
		var ranklistHtml='';
		$.ajax({
			type:'GET',
			url:location.origin+'/advstat/index.php?c=h5rank&m=wxrankdata&d=h5game&gameid='+gameid+'&ranktype=2',
			dataType:'json',
			success:function(data){
				//排行榜列表
				if (gameid==3) {//电魂排行
					$('.ranktitle').html('电魂排行');
					for(var i=0;i<data.rankdata.length;i++){
						ranklistHtml+='<li><em>'+data.rankdata[i][0]+'</em><img src="images/header.jpg"><div class="namebox"><p class="ellipsis">'+data.rankdata[i][1]+'</p><span>'+data.rankdata[i][2]+'m</span></div></li>'	
					}

					$('.ranklist').html(ranklistHtml);

					//本周最佳
					$('.weekBest').html(data.myscore+'m');

					//我的排名
					if (data.myrank==0) {
						$('.myrankcon em').html('暂无成绩');	
					}else if(data.myrank==-1){
						$('.myrankcon em').html('黑名单');
					}else if(data.myrank>0){
						$('.myrankcon em').html(data.myrank);
					}
				}
				
			}
		});
	},
	sharegame:function(hasbat,batnum,ismask){
		/*
			hasbat 1有战绩 0没有战绩
			batnum 行驶距离
			ismask 1有弹层 0没有弹层
		*/
		var _t=this,shareTitle='';
		if(ismask){
			$('.sharemask').css('display','block');
		}else{
			$('.sharemask').css('display','none');
		}
		if(typeof(batnum) != undefined)
			document.title = "你神一般的操作，成功让梦梦在战场上行驶了"+batnum+"m ！"
	}
}
$(function(){
	cbsRanklist.int();
});