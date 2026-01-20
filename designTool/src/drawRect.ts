import DrawingObj,{xyCoordinate} from './drawingObj';

export default class DrawRect extends DrawingObj{
	
	constructor(
		startX:number,
		startY:number,
		endX:number,
		endY:number
	){
		super(startX,startY,endX,endY);

		const width = this.rightBottomX - this.leftTopX;
		const height = this.rightBottomY - this.leftTopY;

		this.xyCoordinates = [
			{ x: this.leftTopX, y:this.leftTopY},
			{ x: this.leftTopX + width, y:this.leftTopY},
			{ x: this.rightBottomX, y:this.rightBottomY },
			{ x: this.leftTopX , y: this.leftTopY + height},
		];
	}

	static draw(ctx:CanvasRenderingContext2D,
	startX:number,startY:number,endX:number,endY:number,){

		const width:number = endX - startX;
		const height:number = endY - startY;

		const xyCoordinates :xyCoordinate[] = [
			{x:startX,y:startY},
			{x:startX + width ,y:startY},
			{x:startX + width ,y:startY + height},
			{x:startX , y: startY + height}
		];	
		
		ctx.beginPath();
		ctx.moveTo(xyCoordinates[0].x,xyCoordinates[0].y);
		xyCoordinates.forEach((coordinate)=>{
			ctx.lineTo(coordinate.x,coordinate.y);
		});
		ctx.closePath();
		ctx.stroke();
	}
	
}