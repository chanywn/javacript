var dom = {
	move:function(className){
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
					x = x1 - x0,
					y = y1 - y0;
					
				var	addX = offsetX+x,
					addY = offsetY+y;

				obj.style.left = addX+'px';
				obj.style.top  = addY+'px';
				
			}
			document.onmouseup = function(){
				this.onmousemove = null;	
			}
		}
	}
}

dom.move('move');