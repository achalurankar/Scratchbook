import { LightningElement, api, track } from 'lwc';
import getPages from '@salesforce/apex/scratchbook_cc.getPages';
import savePage from '@salesforce/apex/scratchbook_cc.savePage';
import deletePage from '@salesforce/apex/scratchbook_cc.deletePage';

import { Colors } from 'c/utils';
import { dispatchEvent } from 'c/utils';

let isDrawing = false;
let x = 0;
let y = 0;

let canvasElement, ctx; //storing canvas context

export default class Pages extends LightningElement {

    @api height;
    @api width;
    @api page;
    @track pages;
    @track responseMsg = 'Page has been updated!';
    @api bookId;

    connectedCallback(){
        this.page = {};
        this.height = 595;
        this.width = 1275;
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
            }
        });
        
        this.template.addEventListener('keydown', e => {
            console.log(e.key);
        })
    }

    drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        // dispatchEvent(this, 'change', {});
    }

    loadImage(page){
        this.page = page;
        var image = new Image();
        image.onload = function() {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            ctx.drawImage(image, 0, 0);
        };
        image.src = page.imageData;
    }
    
    init = true;
    /*side bar functions*/
    toggleNav() {
        let sidebar = this.template.querySelector(".sidebar");
        let main = this.template.querySelector(".main");
        if(main.style.marginLeft == '0px' || this.init){
            this.init = false;
            sidebar.style.width = "250px";
            main.style.marginLeft = "250px";
        } else {
            sidebar.style.width = "0px";
            main.style.marginLeft = "0px";
        }
    }

    loadPages(){
        getPages({ bookId : this.bookId })
            .then(result =>{
                console.log('length ' + result.length);
                this.pages = result;
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
}