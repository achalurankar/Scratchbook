import { LightningElement, api, track } from 'lwc';
import getPages from '@salesforce/apex/scratchbook_cc.getPages';
import savePage from '@salesforce/apex/scratchbook_cc.savePage';
import deletePage from '@salesforce/apex/scratchbook_cc.deletePage';

let isDrawing = false;
let x = 0;
let y = 0;

let canvasElement, ctx; //storing canvas context

export default class App extends LightningElement {

    @api height;
    @api width;
    @api page;
    @track pages;
    bookId = 'a005j0000057CczAAE';

    connectedCallback(){
        this.page = {};
        this.height = 595;
        this.width = 1275;
        this.loadPages();
    }

    renderedCallback(){
        canvasElement = this.template.querySelector('canvas');
        ctx = canvasElement.getContext("2d");

        // Add the event listeners for mousedown, mousemove, and mouseup
        canvasElement.addEventListener('mousedown', e => {
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

    handleSaveClick(event){
        //convert to png image as dataURL in the format of 'data:image/png;base64,base64value'
        var temp = Object.assign({}, this.page);
        console.log(temp.pageId);
        temp.imageData = canvasElement.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, "");
        var params = {};
        params.pageId = temp.pageId ? temp.pageId : '';
        params.imageData = temp.imageData;
        params.bookId = this.bookId;
        // console.log(JSON.stringify(this.page));
        savePage({ requestStructure : JSON.stringify(params)})
            .then(result => {
                console.log('savePage result - ' + result);
                this.refresh();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }
    
    /*side bar functions*/
    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    openNav() {
        this.template.querySelector(".sidebar").style.width = "250px";
        this.template.querySelector(".main").style.marginLeft = "250px";
    }
    
    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    closeNav() {
        this.template.querySelector(".sidebar").style.width = "0";
        this.template.querySelector(".main").style.marginLeft = "0";
    }

    loadPages(){
        getPages({ bookId : this.bookId })
            .then(result =>{
                this.pages = result;
                // console.log(JSON.stringify(result));
            })
            .catch(error =>{
                console.log(JSON.stringify(error));
            });
    }

    refresh() {
        location.reload();
        //this.loadPages();
    }
    
    handleImageSelect(event){
        this.page = event.detail.page;
        this.loadImage(this.page);
    }

    handleDeleteClick(event) {
        var page = event.detail.page;
        deletePage({ pageId : page.pageId })
            .then(result => {
                console.log('deletePage result - ' + result);
                this.refresh();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    handleNewClick(){
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        this.page = {};
    }
}