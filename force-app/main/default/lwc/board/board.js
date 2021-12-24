import { LightningElement, api } from 'lwc';

let isDrawing = false;
let x = 0;
let y = 0;

let canvasElement, ctx; //storing canvas context

export default class Board extends LightningElement {

    @api height;
    @api width;
    @api page;
    
    @api
    moveSidebar(value){
        var marginVal;
        if(!value && value === 'open'){
            marginVal = '250px';
        } else {
            marginVal = '0px';
        }
        var container = this.template.querySelector(".container");
        if(container)
            container.style.marginLeft = marginVal;
    }

    //retrieve canvase and context
    renderedCallback() {
        canvasElement = this.template.querySelector('canvas');
        ctx = canvasElement.getContext("2d");

        // Add the event listeners for mousedown, mousemove, and mouseup
        canvasElement.addEventListener('mousedown', e => {
            x = e.offsetX;
            y = e.offsetY;
            isDrawing = true;
            console.log('x = ' + x + ' y = ' + y);
        });
        
        canvasElement.addEventListener('mousemove', e => {
            if (isDrawing === true) {
                this.drawLine(x, y, e.offsetX, e.offsetY);
                x = e.offsetX;
                y = e.offsetY;
            }
        });
        
        this.template.addEventListener('mouseup', e => {
            if (isDrawing === true) {
                this.drawLine(x, y, e.offsetX, e.offsetY);
                x = 0;
                y = 0;
                isDrawing = false;
            }
        });
    }

    drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        this.triggerEventDispatch('change', {});
    }

    //public method to call from parent
    @api
    loadImage(page){
        this.page = page;
        var image = new Image();
        image.onload = function() {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            ctx.drawImage(image, 0, 0);
        };
        image.src = page.imageData;
    }

    handleSaveClick() {
        //convert to png image as dataURL in the format of 'data:image/png;base64,base64value'
        var temp = Object.assign({}, this.page);
        temp.imageData = canvasElement.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
        //dispatch event
        this.triggerEventDispatch('save', { page : temp });
    }
    
    triggerEventDispatch(name, params) {
        var event = new CustomEvent(name, { detail : params });
        this.dispatchEvent(event);
    }
}