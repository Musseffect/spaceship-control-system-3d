
class vec3{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static lerp(a, b, t){
        return new vec3(
            lerp(a.x, b.x, t),
            lerp(a.y, b.y, t),
            lerp(a.z, b.z, t)
        );
    }
    static near(a, b, threshold){
        if(threshold === undefined){
            threshold = epsilon;
        }
        return vec3.sub(a, b).lInfnorm() <= threshold;
    }
    static empty(){
        return new vec3(0., 0., 0.);
    }
    clone(){
        return new vec3(this.x, this.y, this.z);
    }
    //scale
    static scale(a, scalar){
        return a.scale(scalar);
    }
    scale(scalar, out){
        if(out == undefined){
            return this.scale(scalar, this.clone());
        }
        out.x = this.x * scalar;
        out.y = this.y * scalar;
        out.z = this.z * scalar;
        return out;
    }
    scaleSelf(scalar){
        this.scale(scalar, this);
        return this;
    }
    //add
    static add(a, b){
        return a.add(b);
    }
    add(vec, out){
        if(out == undefined){
            return this.add(vec, this.clone());
        }
        out.x = this.x + vec.x;
        out.y = this.y + vec.y;
        out.z = this.z + vec.z;
        return out;
    }
    addSelf(vec){
        return this.add(vec, this);
    }
    //sub
    static sub(a, b){
        return a.sub(b);
    }
    sub(vec, out){
        if(out == undefined){
            return this.sub(vec, this.clone());
        }
        out.x = this.x - vec.x;
        out.y = this.y - vec.y;
        out.z = this.z - vec.z;
        return out;
    }
    subSelf(vec){
        return this.sub(vec, this);
    }
    //mult
    static mult(a, b){
        return a.mult(b);
    }
    mult(vec, out){
        if(out == undefined){
            return this.mult(vec, this.clone());
        }
        out.x = this.x * vec.x;
        out.y = this.y * vec.y;
        out.z = this.z * vec.z;
        return out;
    }
    multSelf(vec){
        return this.mult(vec, this);
    }
    //div
    static div(a, b){
        return a.div(b);
    }
    div(vec, out){
        if(out == undefined){
            return this.div(vec, this.clone());
        }
        out.x = this.x / vec.x;
        out.y = this.y / vec.y;
        out.z = this.z / vec.z;
        return out;
    }
    divSelf(vec){
        return this.div(vec, this);
    }
    //dot
    static dot(a, b){
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    dot(vec){
        return vec.dot(this, vec); 
    }
    //cross
    static cross(a, b){
        return new vec3(
            a.y * b.z - a.z * b.y,
            -a.x * b.z + a.z * b.x, 
            a.x * b.y - a.y * b.x 
            );
    }
    cross(vec){
        return vec.cross(this, vec);
    }
    //normalization
    normalize(){
        let l = this.l2norm();
        return this.scaleSelf(1./l);
    }
    normalized(){
        return this.clone().normalize();
    }
    lpnorm(p){
        return Math.pow(
            Math.pow(Math.abs(this.x), p) + 
            Math.pow(Math.abs(this.y), p) + 
            Math.pow(Math.abs(this.z), p)
            , 1.0/p);
    }
    l1norm(){
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    l2norm(){
        return Math.sqrt(this.lengthSquared());
    }
    lInfnorm(){
        return Math.max(Math.abs(this.x), Math.max(Math.abs(this.y), Math.abs(this.z)));
    }
    length(){
        return this.l2norm();
    }
    lengthSquared(){
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }    
    toString(){
        return `[${this.x.toFixed(4)}, ${this.y.toFixed(4)}, ${this.z.toFixed(4)}]`;
    }
    rotateEuler(point){
        let ax = new axisAngle(new vec3(1, 0, 0), this.x);
        let ay = new axisAngle(new vec3(0, 1, 0), this.y);
        let az = new axisAngle(new vec3(0, 0, 1), this.z);
        return az.rotate(ay.rotate(ax.rotate(point)));
    }
}