function dispatchEvent(ctx, name, params) {
    var event = new CustomEvent(name, { detail : params });
    ctx.dispatchEvent(event);
}

function log(msg, json = false) {
    if(json) {
        console.log(JSON.stringify(msg));
    } else {
        console.log(msg);
    }
}

const Colors = {
    SUCCESS : '#50C878',
    ERROR : '#DC3545'
};

function getColorCode(color) {
    switch(color){
        case "blue":
            return "#0000FF";
        case "green":
            return "#00FF00";
        case "red":
            return "#FF0000";
        case "yellow":
            return "#FFFF00";
        case "black":
            return "#000000";
}
}

export { dispatchEvent, log, Colors, getColorCode };