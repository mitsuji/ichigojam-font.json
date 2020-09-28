var kawakudari;
var frame;
var running;
var x;

var sample;

window.onload = function () {
    document.addEventListener("keydown",function(e) {
        if ((!running) && e.key === "Enter") {
	    kawakudari.cls();
	    resetKawakudari();
	}
    });
    document.getElementById("kawakudari").addEventListener("click",function(e) {
	if (!running) {
	    kawakudari.cls();
	    resetKawakudari();
	} else {
	    var clientRect = this.getBoundingClientRect() ;
	    var clickX = e.pageX - (clientRect.left + window.pageXOffset);
	    if (clickX < 256) {
		x --;
	    } else {
		x ++;
	    }
	}
    });
    document.getElementById("kawakudari").addEventListener("touchstart",function(e) {
	if (!running) {
	    kawakudari.cls();
	    resetKawakudari();
	} else {
	    var touch = e.changedTouches[0] ;	    
	    var clientRect = this.getBoundingClientRect() ;
	    var clickX = touch.pageX - (clientRect.left + window.pageXOffset);
	    if (clickX < 256) {
		x --;
	    } else {
		x ++;
	    }
	}
    });
    resetKawakudari();
    initKawakudari();

    
    document.getElementById("ichigojam-font-1.4").addEventListener("click",function(e){
	showSample('ichigojam-font-1.4');
    });
    document.getElementById("ichigojam-font-1.2").addEventListener("click",function(e){
	showSample('ichigojam-font-1.2');
    });
    initSample();
    showSample('ichigojam-font-1.4');
}

function resetKawakudari() {
    frame = 0;
    running = true;
    x = 15;
}
function initKawakudari() {
    var canvas = document.getElementById("kawakudari");
    var context = canvas.getContext('2d');
    if (!context) {
        alert("HTML canvas 2d context is not supported in your environment...")
        return;
    }

    kawakudari = newStd15(context,512,384,32,24);

    document.addEventListener("keydown",function(e) {
        if (e.key === "ArrowLeft")  x--;
        if (e.key === "ArrowRight") x++;
    });

    setInterval(function() {
        if (!running) return;
        if (frame % 5 == 0) {
            kawakudari.locate(x,5);
            kawakudari.putc('0'.charCodeAt(0));
            kawakudari.locate(Math.floor(Math.random() * 32.0),23);
            kawakudari.putc('*'.charCodeAt(0));
            kawakudari.scroll(DIR_UP);
            if (kawakudari.scr(x,5) != 0) {
                kawakudari.locate(0,23);
                kawakudari.putstr("Game Over...");
                kawakudari.putnum(frame);
                running = false;
            }
        }
        kawakudari.drawScreen();
        ++frame;
    },16);
}


function initSample() {
    var canvas = document.getElementById("sample");
    var context = canvas.getContext('2d');
    if (!context) {
	alert("HTML canvas 2d context is not supported in your environment...")
	return;
    }
    
    sample = newStd15(context,528,528,33,33);
    for(var y = 0; y < 0x10; ++y) {
	for(var x = 0; x < 0x10; ++x) {
	    sample.setChar(x*2+1,y*2+1,y*0x10 +x);
	}
    }
}
function showSample(name) {
    document.getElementById(name).checked = true;

    var req = new XMLHttpRequest();
    req.open('GET', name + '.json');
    req.onload = function() {
        if (req.status === 200) {
	    ICHIGOJAM_FONT = JSON.parse(req.responseText);
	    sample.drawScreen();
	    
        } else {
            alert("failed to load font file...");
        }
    };
    req.send();

}

