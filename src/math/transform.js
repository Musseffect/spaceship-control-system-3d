class transform{
    translation;
    rotation;
    scale;
    constructor(translation, rotation, scale){
        this.translation = translation;
        this.rotation = rotation;
        this.scale = scale;
    }
    clone(){
        return new transform(this.translation.clone(), this.rotation.clone(), this.scale.clone());
    }
    static identity(){
        this.translation = new vec3(0, 0, 0);
        this.rotation = quat.identity();
        this.scale = new vec3(1, 1, 1);
    }
    toAffine(){
        return mat4.fromTRS(this.translation, this.rotation, this.scale);
    }
    transformPoint(point){
        return this.rotation.rotate(vec3.mult(point, this.scale)).addSelf(this.translation);
    }
    transformVector(vector){
        return this.rotation.rotate(vec3.mult(vector, this.scale));
    }
    inverse(){
       return new transform(
            new vec3(-this.translation.x, -this.translation.y, -this.translation.z),
            this.rotation.inverse(),
            new vec3(1.0 / this.scale.x, 1.0 / this.scale.y, 1.0 / this.scale.z)
       ); 
    }
    toString(){
        return `{
    t:${this.translation.toString()},
    r:${this.rotation.toString()},
    s:${this.scale.toString()}
}`;
    }
}