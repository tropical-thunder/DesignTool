
import DrawingObj from './drawingObj';

export const renderAllDrawnObjs = (
	drawnObjs :DrawingObj[],
	ctx:CanvasRenderingContext2D,

)=>{
	if(drawnObjs.length > 0){
		for(let drawnObj of drawnObjs){
			
			//start rendering path 
			ctx.save();
			ctx.strokeStyle=drawnObj.strokeColor;
			ctx.fillStyle = drawnObj.fillColor;

			ctx.beginPath();
			ctx.moveTo(
				drawnObj.xyCoordinates[0].x,
				drawnObj.xyCoordinates[0].y
			);
			
			drawnObj.xyCoordinates.forEach((coordinate)=>{
				ctx.lineTo(coordinate.x,coordinate.y);
			})
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			
		}
		
	}
}
