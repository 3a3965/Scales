Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return i;
        }
    }
    return -1;
}

var list = document.getElementById("boxes").getElementsByTagName("li");
var arrow = document.getElementById("arrow");
var bottompos = 456;  // площадка для посадки на весы
var max = 320;  // максимум шкалы
var min = 160;  // минимум шкалы
var pointweight = (max+min)/2;
var bz = 10;
var point1 = [];
var point2 = [];
var totalweight = 0;

for (index = 0; index < list.length; ++index) {
	totalweight+=parseInt(list[index].innerHTML);
	list[index].onmousedown = function(e) {
	  
	  var self = this;
	  e = fixEvent(e);

	  var coords = getCoords(this);
	  var shiftX = e.pageX - coords.left;
	  var shiftY = e.pageY - coords.top;
	  

	  this.style.position = 'absolute';
	  moveAt(e);
	  
	  bz++;
	  this.style.zIndex = bz; 

	  function moveAt(e) {
		self.style.left = e.pageX - shiftX + 'px';
		self.style.top = e.pageY - shiftY+ 'px';
		
		checkin("point2");
		checkin("point1");
		
		
	  }
	  function checkin(p1){
	    p2 = document.getElementById(p1);
		p2coords = getCoords(p2);
		
		if( (parseInt(self.style.top) > p2coords.top) && ( parseInt(self.style.top) < p2coords.top+parseInt(p2.clientHeight)-80) && (parseInt(self.style.left) > p2coords.left) && ( parseInt(self.style.left) < p2coords.left+parseInt(p2.clientWidth)-30) ){
			p2.setAttribute("class", "border");
			return true;
		}
		else{
			p2.setAttribute("class", "");
			return false;
		}
	  }

	  document.onmousemove = function(e) {
		e = fixEvent(e);
		moveAt(e); 
		
	  };

	  this.onmouseup = function() {
		document.onmousemove = self.onmouseup = null;
		

			
		if(checkin("point2")){  // положили правый
			self.style.top = bottompos+'px';
			if(point2.contains(self)<0){
				point2.push(self);
				(pointweight > max) ? from=max : from=pointweight;
				pointweight+=parseInt(procent*parseInt(self.innerHTML));
				
				if(pointweight>max)
					move(arrow,from,max);
				else if(pointweight<min)
					move(arrow,min,min);
				else if(from<min)
					move(arrow,min,pointweight);	
				else
					move(arrow,from,pointweight);
			}
		}
		else{
			if((ind = point2.contains(self))>-1){ // сняли правый
				point2.splice (ind,1);
				(pointweight > max) ? from=max : from=pointweight;
				pointweight-=parseInt(procent*parseInt(self.innerHTML));
				if(pointweight>max)
					
					move(arrow,from,max);
				else
					move(arrow,from,pointweight);
					
			}
		}
		if(checkin("point1")){  // положили левый
			self.style.top = bottompos+'px';
			if(point1.contains(self)<0){
				point1.push(self);
				
				(pointweight < min) ? from=min : from=pointweight;
				pointweight-=parseInt(procent*parseInt(self.innerHTML));
				
				if(pointweight<min)
					move(arrow,from,min);
				else if(pointweight>max)
					move(arrow,max,max);
				else if(from>max)
					move(arrow,max,pointweight);
				else 
					move(arrow,from,pointweight);
			}
		}
		else{
			if((ind = point1.contains(self))>-1){ // сняли левый
				point1.splice (ind,1);
				(pointweight < min) ? from=min : from=pointweight;
				pointweight+=parseInt(procent*parseInt(self.innerHTML));
				;
				if(pointweight<min)
					move(arrow,from,min);
					
				else
					move(arrow,from,pointweight);
			}
		}
		document.getElementById("point1").setAttribute("class", "");
		document.getElementById("point2").setAttribute("class", "");
		if((pointweight==(max+min)/2) && (point2.length+point1.length==12))
			alert('Mission complete!');
	  };

	}

}
var procent = (max+min)/2/totalweight;

box.ondragstart = function() { 
  return false; 
};




function fixEvent(e) {
  e = e || window.event;

  if (!e.target) e.target = e.srcElement;

  if (e.pageX == null && e.clientX != null ) { 
    var html = document.documentElement;
    var body = document.body;

    e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
    e.pageX -= html.clientLeft || 0;

    e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
    e.pageY -= html.clientTop || 0;
  }

  if (!e.which && e.button) {
    e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) )
  }

  return e;
}


function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    var clientTop = docElem.clientTop || body.clientTop || 0;
    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}


function move(elem,from,to) {

	var y = parseInt(elem.style.top);
  function frame() { 
	if(from>to) from--; else from++;
    elem.style.left = from + 'px'  
    if (from == to) { 
      clearInterval(timer); 
    }
  }

  var timer = setInterval(frame, 10) 
}

