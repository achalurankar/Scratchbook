function dispatchEvent(ctx, name, params) {
    var event = new CustomEvent(name, { detail : params });
    ctx.dispatchEvent(event);
}

const Colors = {
    SUCCESS : '#50C878',
    ERROR : '#DC3545'
};

export { dispatchEvent, Colors };