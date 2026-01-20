import DrawingObj ,{xyCoordinate} from './drawingObj';

export default class drawTriangle extends DrawingObj{

	constructor(
		startX:number,
		startY:number,
		endX:number,
		endY:number
	){
		super(startX,startY,endX,endY);

		const width :number = endX - startX;
		const halfWidth :number = width/2;

		const height = this.rightBottomY - this.leftTopY;

		this.xyCoordinates = [
			{ x: startX, y:startY}, //left bottom of triangle
			{ x: startX + halfWidth, y:endY}, // center top of triangle
			{ x: endX, y:startY }, // right bottom of triangle
		];
	}

	static draw(ctx:CanvasRenderingContext2D,
	startX:number,startY:number,endX:number,endY:number,){

		const width :number = endX - startX;
		const halfWidth :number = width/2;

		const xyCoordinates: xyCoordinate[]  = [
			{ x: startX, y:startY}, //left bottom of triangle
			{ x: startX + halfWidth, y:endY}, // center top of triangle
			{ x: endX, y:startY }, // right bottom of triangle
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