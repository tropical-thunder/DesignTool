export type xyCoordinate ={
	x:number,
	y:number,
}



export default class DrawingObj {
	
	
	isSelected :boolean =false;

	//Rect to enclose the drawingObj
	leftTopX :number;
	leftTopY :number;
	rightBottomX :number;
	rightBottomY :number;
	
	strokeColor :string;
	fillColor :string;

	activeMenuIcon :string;
	fillColorMenuOpen : boolean;

	//assign xy coordinates to specify each paths, amount of element get different by shape 
	xyCoordinates :xyCoordinate[] = [];

	static widthOfMenu :number = 80;
	static heightOfMenu :number = 40;
	static distanceToMenu :number = 60;
	static oneMenuIconLength :number = 40;

	constructor(
		startX:number, //MouseDownPointX
		startY:number, //MouseDownPointY
		endX:number, //MouseUpPointX
		endY:number, //MouseUpPointY
		strokeColor:string = '#000',
		fillColor:string = '#FFF',
	){

		//use this as range of shape
		this.leftTopX = Math.min(startX,endX);
		this.leftTopY = Math.min(startY,endY);
		this.rightBottomX = Math.max(startX,endX);
		this.rightBottomY = Math.max(startY,endY);

		this.strokeColor = strokeColor;
		this.fillColor = fillColor;

		this.fillColorMenuOpen =false;
		this.activeMenuIcon = "none";
	};

	updateXYCoordinates(distanceX:number,distanceY:number) :void{
		this.xyCoordinates = this.xyCoordinates.map((coordinate)=>{
			return {x :coordinate.x + distanceX, y: coordinate.y + distanceY}
		});
	}

	updateLeftTopXYandRightBottomXY(distanceX:number,distanceY:number) :void{

		this.leftTopX += distanceX;
		this.leftTopY += distanceY;
		this.rightBottomX += distanceX;
		this.rightBottomY += distanceY;
	}

	//when mouse down , if pointer is in inside of the obj area or obj menu area, treat it as selected 
	checkObjOrItsMenuIsClicked(event:MouseEvent):string{
		
		const clickPointXIsInside = (this.leftTopX < event.offsetX && event.offsetX < this.rightBottomX);
		const clickPointYIsInside = (this.leftTopY < event.offsetY && event.offsetY < this.rightBottomY);

		this.activeMenuIcon = this.getClickedMenuIconName(event);

		if( clickPointXIsInside && clickPointYIsInside ){
			this.isSelected = true;
			return 'shape object';

		}else if(this.isSelected && this.checkMenuIconIsClicked(event)){
			this.isSelected = true;
			return 'menu icon';

		}else{
			this.isSelected = false;
			return 'click nothing';
		}
	}

	checkMenuIconIsClicked (event:MouseEvent) : boolean{
		//this can be whole menu area is clicked i will fix later and make each one maybe 
		const menuIconCount :number = 2;

		const centerOfRectX :number = (this.rightBottomX + this.leftTopX) /2;
		const centerOfRectY :number = (this.rightBottomY + this.leftTopY) /2;
		
		const leftTopOfMenuX :number = centerOfRectX- DrawingObj.widthOfMenu/2;
		const leftTopOfMenuY :number = this.leftTopY - DrawingObj.distanceToMenu ;

		const clickXIsInMenuIcon :boolean = (leftTopOfMenuX < event.offsetX && event.offsetX < leftTopOfMenuX + DrawingObj.oneMenuIconLength * menuIconCount );
		const clickYIsInMenuIcon :boolean = (leftTopOfMenuY < event.offsetY && event.offsetY < leftTopOfMenuY + DrawingObj.oneMenuIconLength * menuIconCount);
		
		if(clickXIsInMenuIcon && clickYIsInMenuIcon){
			return true;
		}else{
			this.activeMenuIcon = "none";
			return false;
		}

	}


	unselectThisObj(){
		this.isSelected = false;
		this.fillColorMenuOpen = false;
		this.activeMenuIcon = "none";
	}

	moveSelectedObj(ctx:CanvasRenderingContext2D,distanceX:number =0,distanceY:number =0){
		ctx.save();
		ctx.strokeStyle = '#999';
		ctx.beginPath();
		ctx.moveTo(
			this.xyCoordinates[0].x + distanceX,
			this.xyCoordinates[0].y + distanceY
			);
		this.xyCoordinates.forEach((coordinate)=>{
			ctx.lineTo(coordinate.x + distanceX,coordinate.y + distanceY);
		});
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}

	showSelectFrame (ctx:CanvasRenderingContext2D,distanceX:number =0,distanceY:number =0){
		if(!this.isSelected) return;

		const margin :number =10;
		const width :number = this.rightBottomX - this.leftTopX;
		const height :number = this.rightBottomY - this.leftTopY; 


		ctx.save();
		ctx.strokeStyle = '#F00';
		ctx.strokeRect(
			this.leftTopX + distanceX -margin,
			this.leftTopY + distanceY -margin,
			width +margin*2,
			height+margin*2
			);
		ctx.restore();
	}

	showEditMenu(ctx:CanvasRenderingContext2D,preLoadMenuImgs:HTMLImageElement[]){
		if(!this.isSelected) return;

		const centerOfRectX :number = (this.rightBottomX + this.leftTopX) /2;
		const centerOfRectY :number = (this.rightBottomY + this.leftTopY) /2;


		const leftTopOfMenuX :number = centerOfRectX- DrawingObj.widthOfMenu/2 ;
		const leftTopOfMenuY :number = this.leftTopY - DrawingObj.distanceToMenu ;

		ctx.save();
		ctx.fillStyle = "#FFF";
		ctx.strokeStyle= '#000';
		ctx.fillRect(
			leftTopOfMenuX,
			leftTopOfMenuY,
			DrawingObj.widthOfMenu,
			DrawingObj.heightOfMenu,
		);
		ctx.strokeRect(
			leftTopOfMenuX,
			leftTopOfMenuY,
			DrawingObj.widthOfMenu,
			DrawingObj.heightOfMenu,
		);

		//stroke vertical line to divide menu to half
		const verticalLineStartY :number = this.leftTopY - DrawingObj.distanceToMenu;
		const verticalLineEndY :number = verticalLineStartY + DrawingObj.heightOfMenu ;
		ctx.beginPath(); 
		ctx.moveTo(centerOfRectX ,verticalLineStartY);
		ctx.lineTo(centerOfRectX ,verticalLineEndY);
		ctx.stroke();
		ctx.restore();

		//write delete text
		this.showEditMenuIcon(ctx,leftTopOfMenuX,leftTopOfMenuY,preLoadMenuImgs);
	
	}

	showEditMenuIcon(ctx:CanvasRenderingContext2D,leftTopOfMenuX:number,leftTopOfMenuY:number,preLoadMenuImgs:HTMLImageElement[]){
	
		const marginOfImage :number=5; 
		const oneMenuIconLength : number = 40;
		//trashbox icon 
		ctx.drawImage(preLoadMenuImgs[0],leftTopOfMenuX+marginOfImage,leftTopOfMenuY+marginOfImage,30,30);
		
		//pencil icon
		ctx.drawImage(preLoadMenuImgs[1],leftTopOfMenuX+oneMenuIconLength+marginOfImage,leftTopOfMenuY+marginOfImage,30,25);
		ctx.save();
		ctx.lineWidth =2;
		ctx.strokeStyle = this.strokeColor;
		ctx.beginPath();
		ctx.moveTo(
			leftTopOfMenuX+oneMenuIconLength+marginOfImage,
			leftTopOfMenuY+oneMenuIconLength-marginOfImage
		);
		ctx.lineTo(			
			leftTopOfMenuX + oneMenuIconLength *2 - marginOfImage,
			leftTopOfMenuY + oneMenuIconLength - marginOfImage
		);
		ctx.stroke();
		ctx.restore();
	}

	showFillColorMenu (ctx:CanvasRenderingContext2D){
		const oneMenuIconLength = 40;
		const colorIconCount : number = 3;

		const centerOfRectX :number = (this.rightBottomX + this.leftTopX) /2;
		const centerOfRectY :number = (this.rightBottomY + this.leftTopY) /2;
		
		const leftTopOfMenuX :number = centerOfRectX- DrawingObj.widthOfMenu/2;
		const leftTopOfMenuY :number = this.leftTopY - DrawingObj.distanceToMenu ;
		const marginFromMenuBottom :number =3;

		//lower menu frame for fill color 
		ctx.save();

		const leftTopOfFillColorMenuX :number = leftTopOfMenuX ;
		const leftTopOfFillColorMenuY :number = leftTopOfMenuY + oneMenuIconLength + marginFromMenuBottom;

		ctx.beginPath();
		ctx.fillStyle = "#FFF";
		ctx.strokeStyle= '#000';
		ctx.fillRect(
			leftTopOfFillColorMenuX,
			leftTopOfFillColorMenuY,
			oneMenuIconLength * colorIconCount,
			DrawingObj.heightOfMenu
		);
		ctx.strokeRect(
			leftTopOfFillColorMenuX,
			leftTopOfFillColorMenuY,
			oneMenuIconLength * colorIconCount,
			DrawingObj.heightOfMenu
		);

		const centerYofFillColorMenu :number = leftTopOfFillColorMenuY + oneMenuIconLength/2 ;
		const fillColorObjWidth :number = 24;
		const fillColorObjHeight :number = 24;

		//draw fill color obj
		//red
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1.5;
		ctx.fillStyle = "#F00";
		ctx.fillRect(leftTopOfFillColorMenuX  + oneMenuIconLength/2 - fillColorObjWidth /2,
			centerYofFillColorMenu - fillColorObjHeight/2,
			fillColorObjWidth,
			fillColorObjHeight
			);
		ctx.strokeRect(leftTopOfFillColorMenuX  + oneMenuIconLength/2 - fillColorObjWidth /2,
			centerYofFillColorMenu - fillColorObjHeight/2,
			fillColorObjWidth,
			fillColorObjHeight
			);
		
		//blue
		ctx.beginPath();
		ctx.fillStyle = "#00F";
		ctx.fillRect(leftTopOfFillColorMenuX  + oneMenuIconLength + oneMenuIconLength/2 - fillColorObjWidth /2,
			centerYofFillColorMenu - fillColorObjHeight/2,
			fillColorObjWidth,
			fillColorObjHeight
			);
		ctx.strokeRect(leftTopOfFillColorMenuX  + oneMenuIconLength + oneMenuIconLength/2 - fillColorObjWidth /2,
			centerYofFillColorMenu - fillColorObjHeight/2,
			fillColorObjWidth,
			fillColorObjHeight
			);
		
		//white
		ctx.beginPath();
		ctx.fillStyle = "#FFF";
		ctx.fillRect(leftTopOfFillColorMenuX  + oneMenuIconLength*2 + oneMenuIconLength/2 - fillColorObjWidth /2,
			centerYofFillColorMenu - fillColorObjHeight/2,
			fillColorObjWidth,
			fillColorObjHeight
			);
		ctx.strokeRect(leftTopOfFillColorMenuX  + oneMenuIconLength*2 + oneMenuIconLength/2 - fillColorObjWidth /2,
			centerYofFillColorMenu - fillColorObjHeight/2,
			fillColorObjWidth,
			fillColorObjHeight
			);
		
		ctx.restore();
		this.fillColorMenuOpen = true;
	}

	getClickedMenuIconName (event:MouseEvent):string{
		//include upper and lower menu icon
		const oneMenuIconLength = 40;
		const iconPlaceOrder :{[key:string]:number} = {trashBox:1,pencilIcon:2};

		const centerOfRectX :number = (this.rightBottomX + this.leftTopX) /2;
		const centerOfRectY :number = (this.rightBottomY + this.leftTopY) /2;
		
		const leftTopOfMenuX :number = centerOfRectX- DrawingObj.widthOfMenu/2;
		const leftTopOfMenuY :number = this.leftTopY - DrawingObj.distanceToMenu ;

		//lower fillcolor menu
		const marginFromMenuBottom :number =3;
		const leftTopOfFillColorMenuX :number = leftTopOfMenuX ;
		const leftTopOfFillColorMenuY :number = leftTopOfMenuY + oneMenuIconLength + marginFromMenuBottom;

		const centerYofFillColorMenu :number = leftTopOfFillColorMenuY + oneMenuIconLength/2 ;
		const fillColorObjWidth :number = 24;
		const fillColorObjHeight :number = 24;

		const redFillcolorLeftTopX :number = leftTopOfFillColorMenuX + oneMenuIconLength/2 - fillColorObjWidth /2;
		const redFillcolorLeftTopY :number = centerYofFillColorMenu - fillColorObjHeight/2;

		const blueFillcolorLeftTopX :number = leftTopOfFillColorMenuX + oneMenuIconLength + oneMenuIconLength/2 - fillColorObjWidth /2;
		const blueFillcolorLeftTopY :number = redFillcolorLeftTopY;

		const whiteFillcolorLeftTopX :number = leftTopOfFillColorMenuX + oneMenuIconLength*2 + oneMenuIconLength/2 - fillColorObjWidth /2;
		const whiteFillcolorLeftTopY :number = redFillcolorLeftTopY;


		const clickXIsInTrashboxIcon :boolean = (leftTopOfMenuX < event.offsetX && event.offsetX < leftTopOfMenuX + oneMenuIconLength * iconPlaceOrder['trashBox']);
		const clickYIsInTrashboxIcon :boolean = (leftTopOfMenuY < event.offsetY && event.offsetY < leftTopOfMenuY + oneMenuIconLength );
		
		const clickXIsInPencilIcon :boolean = (leftTopOfMenuX < event.offsetX && event.offsetX < leftTopOfMenuX + oneMenuIconLength * iconPlaceOrder['pencilIcon']);
		const clickYIsInPencilIcon :boolean = (leftTopOfMenuY < event.offsetY && event.offsetY < leftTopOfMenuY + oneMenuIconLength );

		const clickXIsInFillColorRed :boolean = (redFillcolorLeftTopX < event.offsetX && event.offsetX < redFillcolorLeftTopX + fillColorObjWidth); 
		const clickYIsInFillColorRed :boolean = (redFillcolorLeftTopY < event.offsetY && event.offsetY < redFillcolorLeftTopY + fillColorObjHeight); 

		const clickXIsInFillColorBlue :boolean = (blueFillcolorLeftTopX < event.offsetX && event.offsetX < blueFillcolorLeftTopX + fillColorObjWidth); 
		const clickYIsInFillColorBlue :boolean = (blueFillcolorLeftTopY < event.offsetY && event.offsetY < blueFillcolorLeftTopY + fillColorObjHeight); 

		const clickXIsInFillColorWhite :boolean = (whiteFillcolorLeftTopX < event.offsetX && event.offsetX < whiteFillcolorLeftTopX + fillColorObjWidth); 
		const clickYIsInFillColorWhite :boolean = (whiteFillcolorLeftTopY < event.offsetY && event.offsetY < whiteFillcolorLeftTopY + fillColorObjHeight); 

		if(clickXIsInTrashboxIcon && clickYIsInTrashboxIcon){
			return 'trashBox';
		}else if(clickXIsInPencilIcon && clickYIsInPencilIcon){
			return 'pencilIcon';
		}else if(clickXIsInFillColorRed && clickYIsInFillColorRed){
			return "fillColorRed";
		}else if(clickXIsInFillColorBlue && clickYIsInFillColorBlue){
			return "fillColorBlue";
		}else if(clickXIsInFillColorWhite && clickYIsInFillColorWhite){
			return "fillColorWhite";
		}else{
			return 'none';
		}

	}

	changeFillColor(clickedFillColor:string):void{
		const fillColorList :{[key:string]:string} = {
			fillColorRed:'#F00',
			fillColorBlue :'#00F',
			fillColorWhite :'#FFF'
		};
		this.fillColor = fillColorList[clickedFillColor]; 
		this.fillColorMenuOpen =false;
		this.unselectThisObj();
	}
	

	callbackTest(callback:(mes:string)=>void):void{
		const mes = 'callback mes desu';
		callback(mes);
	}

	static draw(ctx:CanvasRenderingContext2D,
	startX:number,startY:number,endX:number,endY:number,){

		//override in subclass	

	}
}