const epsilon = 0.000001;

function radians(value){
    return value / 180 * Math.PI;
}

function degrees(value){
    return value / Math.PI * 180;
}

function clamp(value, min, max){
    return Math.max(Math.min(value, max), min);
}

function near(a, b, threshold){
    if(threshold === undefined)
        threshold = epsilon;
    return Math.abs(a - b) <= threshold;
}

function lerp(a, b, t){
    return b * t + a * (1 - t);
}