const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Conway {

    constructor() {
        this.tps = 20;
        this.fps = 30;
        this.scale = 8;

        this.tc = 0;
        this.fc = 0;

        this.tr = 0;
        this.fr = 0;

        this.frameCur = [];

        let temp = this.populateFrame()
        if (temp) { this.frameCur = temp; }

        setInterval(() => this.__loop__(),(1/this.tps)*1000);
        setInterval(() => this.__draw__(),(1/this.fps)*1000);
        setInterval(() => this.__rate__(),1000);

        this.__resize__(); window.onresize = this.__resize__;
    }

    __rate__() {
        console.log("Tick Rate: " + this.tr + " tps\r\nFrame Rate: " + this.fr + " fps");
        this.tr = this.tc;
        this.tc = 0;

        this.fr = this.fc;
        this.fc = 0;
    }

    __loop__() {
        this.tr++;
        let temp = this.calculateFrame();
        if (temp) { this.frameCur = temp; }
    }

    __resize__() {
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        
		//ctx.fillStyle = 'black';
		//ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    }

    __draw__() {
        this.fr++;
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
		// var imgData = ctx.getImageData(0,0,window.innerWidth,window.innerHeight);
		// var i;
		// for (i = 0; i < imgData.data.length; i += 4) {
		//   imgData.data[i + 3]-=64;
		// }
		// ctx.putImageData(imgData, 0,0);
		ctx.fillStyle = 'white';
        let scale = this.scale;
		this.frameCur.forEach(function(v) {
            ctx.fillStyle = 'white';
			if ( 0 > v.x || v.x / scale > window.innerWidth / scale ) { return; }
			if ( 0 > v.y || v.y / scale > window.innerHeight / scale ) { return; }
			ctx.fillRect(v.x*scale,v.y*scale,scale,scale);
		});
    }

    getRandomInt(min,max) {
        return Math.floor(min + (Math.random() * (max-min+1)));
    }
    
    posFromStr(string) {
        let split = String(string).split(":");
        let temp = {x:parseInt(split[0]),y:parseInt(split[1])};
        return temp;
    }
    
    posStr(x,y) {
        return x+":"+y;
    }

    populateFrame() {
        const proto = Object.getPrototypeOf(this); // ???
        let tmpSet = new Set();
        let frameBuf = [];
        for (let i=0;i<((window.innerWidth*window.innerHeight)/(32*(this.scale^2)));i++) {
            tmpSet.add(this.getRandomInt(0,window.innerWidth/this.scale)+":"+this.getRandomInt(0,window.innerHeight/this.scale));
        }
        tmpSet.forEach(function(v){
            let p = proto.posFromStr(v);
            frameBuf.push(p);
        })
        return frameBuf;
    }

    calculateFrame() {
        const proto = Object.getPrototypeOf(this); // Is there a way to do this better?
        if (this.frameCur.length <= 0) { return; } // Insert Reset Routine Here
        let frameBuf = [];
        let frameSet = {};
        this.frameCur.forEach(function(v) {
            for (let ix=-1;ix<=1;ix++) {
                for (let iy=-1;iy<=1;iy++) {
                    if (!(frameSet[proto.posStr(v.x+ix,v.y+iy)])) { frameSet[proto.posStr(v.x+ix,v.y+iy)] = {n:0,l:0}; }
                    if ((ix==0)&&(iy==0)) { frameSet[proto.posStr(v.x+ix,v.y+iy)].l=1; } else { frameSet[proto.posStr(v.x+ix,v.y+iy)].n++; }
                }
            }
        });
        for (const [k,v] of Object.entries(frameSet)) {
            let p = proto.posFromStr(String(k));
            if ((v.n==3)||(v.n==2&&v.l==1)) { frameBuf.push({x:p.x,y:p.y}); }
        }
        return frameBuf;
    }
}

const CGoL = new Conway();