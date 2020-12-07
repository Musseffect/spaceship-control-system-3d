class axisAngle{
    axis;
    angle;
    constructor(axis, angle){
        this.axis = axis.normalized();
        this.angle = angle;
    }
    static near(a, b, threshold){
        if(threshold === undefined){
            threshold = epsilon;
        }
        return axis.near(a.axis, b.axis, threshold) && near(a.angle, b.angle, threshold);
    }
    rotate(point){
        return vec3.add(vec3.lerp(this.axis.scale(vec3.dot(this.axis, point)), point, Math.cos(this.angle)),
         vec3.cross(this.axis, point).scaleSelf(Math.sin(this.angle)));
    }
    toString(){
        return `{axis:${this.axis.toString()}, angle:${this.angle.toFixed(4)}}`;
    }
}