window.onload = function () {
    
    document.getElementById("ichigojam-font-1.4").addEventListener("click",function(e){
	showFont('ichigojam-font-1.4');
    });

    document.getElementById("ichigojam-font-1.2").addEventListener("click",function(e){
	showFont('ichigojam-font-1.2');
    });
    
    showFont('ichigojam-font-1.4');

}


function showFont(name) {
    document.getElementById(name).checked = true;

    var req = new XMLHttpRequest();
    req.open('GET', name + '.json');
    req.onload = function() {
        if (req.status === 200) {
	    var font = JSON.parse(req.responseText);
	    
	    var canvas = document.getElementById("main");
	    var context = canvas.getContext('2d');
	    if (!context) {
		alert("HTML canvas 2d context is not supported in your environment...")
		return;
	    }

	    var charBuff = newCharBuff(context,font,528,528,33,33);
	    for(var y = 0; y < 0x10; ++y) {
		for(var x = 0; x < 0x10; ++x) {
		    charBuff.putChar(x*2+1,y*2+1,y*0x10 +x);
		}
	    }
	    charBuff.draw();
	    
        } else {
            alert("failed to load font file...");
        }
    };
    req.send();

}




const CHAR_W = 8;
const CHAR_H = 8;

var newCharBuff = function(context, font, screen_w, screen_h, buff_w, buff_h){
    var that = {};
    var dot_w = screen_w / buff_w / CHAR_W;
    var dot_h = screen_h / buff_h / CHAR_H;
    var buff = new Array(buff_w * buff_h);
    
    that.putChar = function (x, y, c) {
	buff [y*buff_w+x] = c
    }
 
    that.clear = function () {
	for (var y = 0; y < buff_h; ++y) {
	    for (var x = 0; x < buff_w; ++x) {
		buff [y*buff_w+x] = 0;
	    }
	}
    }

    that.mapChar = function (cx, cy, c) {
	var glyph = font[c];
	var hiBits = parseInt(glyph.substring(0,8),16);
	var loBits = parseInt(glyph.substring(8),  16);
	for(var y = 0 ; y < CHAR_H; ++y) {
	    var line;
	    if(y < 4) {
		line = (hiBits >> (CHAR_W*(CHAR_H-y-1-4))) & 0xff;
	    } else {
		line = (loBits >> (CHAR_W*(CHAR_H-y-1))) & 0xff;
	    }
	    for(var x = 0 ; x < CHAR_W; ++x) {
		if((line >> (CHAR_W-x-1)) & 0x1){
		    var x0 = (cx*CHAR_W+x)*dot_w;
		    var y0 = (cy*CHAR_H+y)*dot_h;
		    context.fillRect(x0,y0,dot_w,dot_h);
		}
	    }
	}
    }
    
    that.draw = function() {
	context.fillStyle = "rgb(0,0,0)";
	context.fillRect(0,0,screen_w,screen_h);
	context.fillStyle = "rgb(255,255,255)";
	for (var y = 0; y < buff_h; ++y) {
	    for (var x = 0; x < buff_w; ++x) {
		that.mapChar(x, y, buff [y*buff_w+x]);
	    }
	}  
    }
    
    that.clear();
    
    return that;
}
