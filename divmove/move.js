var dom = {
	init:function(className){
		var obj = document.getElementsByClassName(className);

		for(var i=0;i<obj.length;i++){
			this.drag(obj[i]);
		}
	},
	drag:function (obj){
		obj.onmousedown = function(e) {
			var x0 = e.clientX,
				y0 = e.clientY,
				offsetX=this.offsetLeft,
				offsetY=this.offsetTop;

			document.onmousemove = function(e){
				var	x1 = e.clientX,
					y1 = e.clientY,
					x  = x1 - x0,
					y  = y1 - y0;

				obj.style.left = (offsetX+x)+'px';
				obj.style.top  = (offsetY+y)+'px';
			}
			
			document.onmouseup = function(){
				this.onmousemove = null;	
			}
		}
	}
}

dom.init('move');