var mslogin = {  
    loginurl: "http://action.17m3.com/17m3/login/mbllogin.php", 
    appid: 10163,
    state:'',
    data: null, 
    backurl: null, 
    haveLogin: false,     
    regurl: "http://passport.m3guo.com/register.aspx",
    login: function() {
        this.state=(window.location.href.split('?').length==2&&window.location.href.split('?')[1].length!=0)?window.location.href.split('?')[1].split('=')[1]:'';
        if(this.state.length!=0) this.state=/^\d+/.exec(this.state)==null?'':/^\d+/.exec(this.state)[0];
        
        this.data = { "mod": "getauthorizedurl" };      
        this.ajaxHander(this.loginurl); 
    },

    callbacklogin: function(result) {  
    	var redirectUrl = this.state ? (this.loginurl+'?state='+this.state) : this.loginurl;
        this.backurl = result.loginurl + "?appid=" + this.appid + "&redirectUrl=" + encodeURI(redirectUrl) + "&token=" + encodeURI(result.token) + "&regurl=" + encodeURI(this.regurl) + "&denycallbackurl=" + this.loginurl + "&m=" + Math.random();
		location.href = this.backurl;
    },

    ajaxHander: function(url) { 
        $.ajax({
            type: "POST", 
            url: url + "?m=" + Math.random(), 
            cache: false,
            async: true,
            data: this.data,
            success: function(msg) {
                var result1 = eval("(" + msg + ")");				
				var result=eval("(" + result1.getTokenResult + ")");  
                switch (result.result) {
                    case 0:
                        mslogin.callbacklogin(result);
                        break;
                    case 1:
                        mslogin.callbacklogin(result);
                        break;
                    case 2:
                        break;  
                    default:
                        alert("请稍候再试！");  
                        break;
                }
            },
            error: function(requser) {
                alert("请稍候再试！！");  
            }
        });
    },

    logincheck: function() {
        if (this.haveLogin == "false") {
            this.login(); 
            return false;
        }else {
            return true;
        }
    }
}

function login() {
	if(mslogin.haveLogin=="false"){
		mslogin.login();   
	}   
}       