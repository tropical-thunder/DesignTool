import DrawRect from './drawRect';
import DrawLine from './drawLine';
import DrawTriangle from './drawTriangle';

export const drawingObjMode : {[modeNumber:number]:string}= {
	0: 'drawLine',
	1: 'drawRect',
	2: 'drawTriangle',
};


export const createInstanceOf = (
	mouseDownPointX :number,
	mouseDownPointY :number,
	mouseUpPointX :number,
	mouseUpPointY :number,
	className :string,
): DrawLine | DrawRect | DrawTriangle | undefined =>{
	
	const width :number = mouseUpPointX-mouseDownPointX ;
	const height :number = mouseUpPointY-mouseDownPointY;
	const requireLength :number =5;
	const enoughLength :boolean =(Math.abs(width) > requireLength && Math.abs(height) > requireLength);

	if(!enoughLength) return; //dont make shape obj if it is too small 
	switch(className){
		case 'drawLine' :
			return new DrawLine(
				mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY
			);
			break;

		case 'drawRect' :
			return new DrawRect(
				mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY
			);
			break;

		case 'drawTriangle' :
			return new DrawTriangle(
				mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY
			);
			break;

	}
}

export const drawObj = (
	ctx:CanvasRenderingContext2D,
	mouseDownPointX :number,
	mouseDownPointY :number,
	mouseUpPointX :number,
	mouseUpPointY :number,
	drawingMode :string,
) => {

	switch(drawingMode){
		case 'drawLine':
			return DrawLine.draw(ctx,mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY);
			break;

		case 'drawRect':
			return DrawRect.draw(ctx,mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY);
			break;

		case 'drawTriangle':
			return DrawTriangle.draw(ctx,mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY);
			break;
	}
}