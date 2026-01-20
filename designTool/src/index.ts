import DrawingObj from './drawingObj';
import DrawRect from './drawRect';
import DrawLine from './drawLine';
import {renderAllDrawnObjs} from './renderDrawnObjs';
import {drawingObjMode, createInstanceOf,drawObj} from './drawingObjType';


let stateText = document.querySelector("#test")!;
const canvas = document.querySelector('.canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D =canvas.getContext('2d')!;
//hoge
const selectModeBtn = document.querySelector('#selectModeBtn')!;
const drawRectBtn = document.querySelector('#drawRectBtn')!;
const drawLineBtn = document.querySelector('#drawLineBtn')!;
const drawTriangleBtn = document.querySelector('#drawTriangleBtn')!;
const currentModeTxt = document.querySelector('#currentModeTxt')!;
const preLoadMenuImgs :HTMLImageElement[]=[]; 

let mouseDownPointX :number;
let mouseDownPointY :number;
let mouseUpPointX :number;
let mouseUpPointY :number;

let drawnObjs :DrawingObj[] =Array();
let selectedObj :DrawingObj | undefined;

let isDragging :boolean = false;
let isSelectMode :boolean = false;
let drawingMode : string='';

currentModeTxt.innerHTML = `${isSelectMode}`;


selectModeBtn.addEventListener('click',()=>{
	isSelectMode=!isSelectMode; 
	currentModeTxt.innerHTML = `${isSelectMode}`
	if(selectedObj) {
		selectedObj.unselectThisObj();
		selectedObj = undefined;
		refreshScreen(drawnObjs,ctx);
	}
});

window.addEventListener('load',()=>{preLoadImg();});
canvas.addEventListener('mousedown',(event)=>{mouseDown(event)});
canvas.addEventListener('mousemove',(event)=>{mouseMove(event)});
canvas.addEventListener('mouseup',(event)=>{mouseUp(event)});
drawLineBtn.addEventListener('click',()=>{changeDrawingMode(0)});
drawRectBtn.addEventListener('click',()=>{changeDrawingMode(1)});
drawTriangleBtn.addEventListener('click',()=>{changeDrawingMode(2)});



const mouseDown = (event :MouseEvent)=>{
	
	isDragging = true;

	refreshScreen(drawnObjs,ctx);

	if(isSelectMode){
		selectedObj= getSelectedDrawnObj(event);
		selectedObj?.showSelectFrame(ctx);
		selectedObj?.showEditMenu(ctx,preLoadMenuImgs);	

	};

	stateText.innerHTML = `${isDragging}`;
	

	mouseDownPointX = event.offsetX;
	mouseDownPointY = event.offsetY;
}

const mouseMove = (event :MouseEvent)=>{


	refreshScreen(drawnObjs,ctx);
	if(isSelectMode && selectedObj) {
		//when not dragging any object
		selectedObj.showSelectFrame(ctx);
		selectedObj.showEditMenu(ctx,preLoadMenuImgs);
		if(selectedObj.activeMenuIcon == 'pencilIcon'){

			selectedObj.showFillColorMenu(ctx);
		}
	}
	//if selectemode and selectedobj plus clickedicon name exist keep showing the frame 

	mouseUpPointX = event.offsetX;
	mouseUpPointY = event.offsetY;

	//use for moving selected object.
	const distanceX = mouseUpPointX-mouseDownPointX;
	const distanceY = mouseUpPointY-mouseDownPointY;

	if(isSelectMode && isDragging && selectedObj){
		refreshScreen(drawnObjs,ctx);
		selectedObj.moveSelectedObj(ctx,distanceX,distanceY);
	}

	if(!isSelectMode && isDragging && drawingMode){
		drawObj(ctx,mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY,drawingMode);	
	}
	
}

const mouseUp = (event:MouseEvent)=>{

	if(isSelectMode && selectedObj){


		const distanceX = mouseUpPointX-mouseDownPointX;
		const distanceY = mouseUpPointY-mouseDownPointY;
		
		selectedObj.updateXYCoordinates(distanceX,distanceY);
		selectedObj.updateLeftTopXYandRightBottomXY(distanceX,distanceY);

		const clickedMenuIconName :string|undefined = selectedObj.getClickedMenuIconName(event);
		

		refreshScreen(drawnObjs,ctx);
		selectedObj?.showSelectFrame(ctx);
		selectedObj?.showEditMenu(ctx,preLoadMenuImgs);

		executeMenuIcon(clickedMenuIconName,drawnObjs,selectedObj,ctx);

		if(clickedMenuIconName == 'trashBox'){
			selectedObj = undefined;
		}
	
	}

	if(!isSelectMode && isDragging && drawingMode){
		addNewDrawnObj(mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY,drawingMode);
	}

	isDragging =false;
	stateText.innerHTML = `${isDragging}`;
}

const getSelectedDrawnObj = (event:MouseEvent) :DrawingObj|undefined=>{
	
	if(drawnObjs.length < 0) return;

	drawnObjs.forEach((drawnObj)=>{
		drawnObj.checkObjOrItsMenuIsClicked(event);
	});

	const selectedObj = drawnObjs.find((drawnObj)=> drawnObj.isSelected ===true);
	return selectedObj;
}



const moveSelectedObj = (distanceX:number,distanceY:number) :void =>{
	selectedObj?.updateXYCoordinates(distanceX,distanceY);
}

const addNewDrawnObj = (
	mouseDownPointX :number,
	mouseDownPointY :number,
	mouseUpPointX :number,
	mouseUpPointY :number,
	className :string,
	)=>{

	const newDrawingObj = createInstanceOf(
		mouseDownPointX,mouseDownPointY,mouseUpPointX,mouseUpPointY,drawingMode
	);
	
	if(newDrawingObj){
		drawnObjs.push(newDrawingObj);
	}
	
}

const changeDrawingMode = (modeNumber:number)=>{
	isSelectMode = false;
	currentModeTxt.innerHTML = `${isSelectMode}`
	drawingMode = drawingObjMode[modeNumber];
}

const deleteSelectedObj = (drawnObjs:DrawingObj[],selectedObj:DrawingObj|undefined) =>{
	//if(drawnObjs.length < 0) return;
	const indexNumToDelete:number = drawnObjs.findIndex(drawnObj =>drawnObj === selectedObj);
	drawnObjs.splice(indexNumToDelete,1);

}

const refreshScreen = (drawnObjs:DrawingObj[],ctx:CanvasRenderingContext2D) =>{
	ctx.clearRect(0,0,canvas.width,canvas.height);

	if(drawnObjs.length < 0)return;
	renderAllDrawnObjs(drawnObjs,ctx);
}

const preLoadImg = () => {
	const imgPaths :string[] = ['./trashBox.png','./pencil.png'];
	imgPaths.forEach((imgPath)=>{
		const img = new Image();
		img.src = `${imgPath}`;
		preLoadMenuImgs.push(img);
	})
}

const executeMenuIcon = (
	clickedMenuName:string|undefined,
	drawnObjs:DrawingObj[],
	selectedObj:DrawingObj|undefined,
	ctx:CanvasRenderingContext2D
	)=>{
	if(clickedMenuName == 'trashBox'){
		deleteSelectedObj(drawnObjs,selectedObj);
		refreshScreen(drawnObjs,ctx);
	}else if(selectedObj && clickedMenuName == 'pencilIcon'){
		selectedObj.showFillColorMenu(ctx);
	}else if(selectedObj 
		&& selectedObj.fillColorMenuOpen
		&& typeof clickedMenuName == "string" 
		&& clickedMenuName.includes("fillColor")){
		selectedObj.changeFillColor(clickedMenuName);
		refreshScreen(drawnObjs,ctx);
	}
}