import DrawingObj,{xyCoordinate} from './drawingObj';

export default class DrawLine extends DrawingObj {
	
	constructor(
		startX:number,
		startY:number,
		endX:number,
		endY:number,
	){
		super(startX,startY,endX,endY);

		this.xyCoordinates =[
			{x:startX,y:startY},
			{x:endX,y:endY},
		];	
	}

	static draw(ctx:CanvasRenderingContext2D,
	startX:number,startY:number,endX:number,endY:number,){

		const xyCoordinates :xyCoordinate[] = [
			{x:startX,y:startY},
			{x:endX,y:endY},
		];	
		
		ctx.beginPath();
		ctx.moveTo(xyCoordinates[0].x,xyCoordinates[0].y);
		xyCoordinates.forEach((coordinate)=>{
			ctx.lineTo(coordinate.x,coordinate.y);
		});
		ctx.stroke();
	}
	
}