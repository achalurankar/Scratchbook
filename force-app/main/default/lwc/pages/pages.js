import { LightningElement, api, track } from 'lwc';
import getPages from '@salesforce/apex/scratchbook_cc.getPages';
import savePage from '@salesforce/apex/scratchbook_cc.savePage';
import deletePage from '@salesforce/apex/scratchbook_cc.deletePage';

import { Colors } from 'c/utils';
import { dispatchEvent, log } from 'c/utils';

let isDrawing = false;
let x = 0;
let y = 0;

let canvasElement, ctx; //storing canvas context

//pens context
let pencontainer;
let pens;

//saving and restoring the canvas state using this
let canvasStack = [];

export default class Pages extends LightningElement {

    @api height;
    @api width;
    @api page;
    @track pages = [];
    @track responseMsg = 'Page has been updated!';
    @api bookId;
    @track selectedColor = 'black';

    connectedCallback(){
        this.page = {};
        this.height = 607;
        this.width = 1278;
        this.loadPages();
    }

    // html canvas methods
    renderedCallback(){
        canvasElement = this.template.querySelector('canvas');
        ctx = canvasElement.getContext("2d");

        // Add the event listeners for mousedown, mousemove, and mouseup
        canvasElement.addEventListener('mousedown', e => {
            e.preventDefault(); // to avoid text selection on mousemove
            x = e.offsetX;
            y = e.offsetY;
            isDrawing = true;
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
                this.save(); // save canvas state
            }
        });
        this.setPenClickListener();
    }

    drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.strokeStyle = this.selectedColor;
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }

    loadImage(page){
        this.page = page;
        this.putImageOnCanvas(page.imageData);
    }

    /*side bar functions*/
    toggleNav() {
        let sidebar = this.template.querySelector(".sidebar");
        let main = this.template.querySelector(".main");
        if(main.style.marginLeft == '0px'){
            sidebar.style.width = "250px";
            main.style.marginLeft = "250px";
        } else {
            sidebar.style.width = "0px";
            main.style.marginLeft = "0px";
        }
    }

    navigator = 0; // initially on first page
    leftClick(){
        let curr = this.navigator - 1;
        if(curr >= 0) {
            this.loadImage(this.pages[curr]);
            --this.navigator;
        }
    }

    rightClick(){
        let curr = this.navigator + 1;
        if(curr < this.pages.length) {
            this.loadImage(this.pages[curr]);
            ++this.navigator;
        }
    }

    init = true;
    loadPages(){
        getPages({ bookId : this.bookId })
            .then(result =>{
                console.log('length ' + result.length);
                this.pages = result;
                if(this.pages.length > 0 && this.init){
                    this.loadImage(this.pages[0]); // load page on board just for the first time opening this component
                    this.init = false;
                }
            })
            .catch(error =>{
                console.log(JSON.stringify(error));
            });
    }

    refresh() {
        //location.reload();
        this.loadPages();
    }
    
    handleImageSelect(event){
        this.page = event.detail.page;
        this.loadImage(this.page);
    }

    //delete
    handleDeleteClick(event) {
        var page = event.detail.page;
        deletePage({ pageId : page.pageId })
            .then(result => {
                console.log('deletePage result id - ' + result);
                //corner case
                if(result == this.page.pageId) {
                    let temp = Object.assign({}, this.page);
                    temp.pageId = undefined;
                    this.page = temp;
                }
                this.createToast('success', 'Page has been deleted!');
                this.refresh();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    // new
    handleNewClick(){
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        this.page = {};
    }

    // save
    handleSaveClick(event){
        //convert to png image as dataURL in the format of 'data:image/png;base64,base64value'
        let temp = Object.assign({}, this.page);
        temp.imageData = canvasElement.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
        let reqParams = {};
        reqParams.pageId = temp.pageId ? temp.pageId : '';
        reqParams.imageData = temp.imageData;
        reqParams.bookId = this.bookId;
        savePage({ requestStructure : JSON.stringify(reqParams)})
            .then(result => {
                let temp = Object.assign({}, this.page);
                if(!temp.pageId) {
                    temp.pageId = result;
                    this.page = temp;
                }
                this.createToast('success', 'Your page has been saved!');
                this.refresh();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    handleExitClick() {
        dispatchEvent(this, 'exit', {});
    }

    setPenClickListener() {
        pencontainer = this.template.querySelector('.pen-container');
        pens = pencontainer.childNodes;
        pens.forEach(element => {
            element.addEventListener('click', this.handlePenClick);
        });
    }

    handlePenClick(event){
        pens.forEach(element => {
            element.classList.remove('active');
            element.style.height = '15px';
            element.style.width = '15px';
        });
        let pen = event.target; //get clicked element
        pen.classList.add('active'); //add active to the class list
        pen.style.height = '17px';
        pen.style.width = '17px';
        this.selectedColor = pen.classList[1]; //get color from class
    }

    success;
    // toast
    createToast(type, msg) {
        let tc = this.template.querySelector(".toast-container");
        let toast = this.template.querySelector(".toast");
        if(type === 'success'){
            this.success = true;
            toast.style.backgroundColor  = Colors.SUCCESS;
        }else{
            this.success = false;
            toast.style.backgroundColor  = Colors.ERROR;
        }
        tc.style.top = '13px';
        this.responseMsg = msg;
        setTimeout(() => {
            tc.style.top = '-50px';
        }, 2000);
    }

    handleUndoClick() {
        this.restore();
    }

    save() {
        let state = canvasElement.toDataURL("image/png");
        canvasStack.push(state);
        console.log(canvasStack.length);
    }

    restore() {
        let data = canvasStack.pop();
        let currState = canvasElement.toDataURL("image/png")
        if(data === currState)
            data = canvasStack.pop();
        if(data) {
            this.putImageOnCanvas(data); 
        } else {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        }
    }

    putImageOnCanvas(data) {
        var image = new Image();
        image.onload = function() {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            ctx.drawImage(image, 0, 0);
        };
        image.src = data;
    }
}