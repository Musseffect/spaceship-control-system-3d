class quat{
    constructor(v, s){
        this.v = v;
        this.s = s;
    }
    static fromVectors(a, b){
        let axis = vec3.cross(a, b);
        let cos = vec3.dot(a, b) / a.l2norm() / b.l2norm();
        if(1 - Math.abs(cos) <= 0.0001){
            axis = new vec3(1, 0, 0);
        }
        let angle = Math.acos(cos);
        return this.fromAxisAngle(new axisAngle(axis, angle));
    }
    clone(){
        return new quat(this.v.clone(), this.s);
    }
    static near(a, b, threshold){
        if(threshold === undefined){
            threshold = epsilon;
        }
        return Math.abs(a.s - b.s) <= threshold && vec3.near(a.v, b.v, threshold);
    }
    static identity(){
        return new quat(new vec3(0., 0., 0.), 1.0);
    }
    static empty(){
        return new quat(vec3.empty(), 0.0);
    }
    static fromAxisAngle(axisAngle){
        return new quat(axisAngle.axis.normalized().scaleSelf(Math.sin(axisAngle.angle/2)), Math.cos(axisAngle.angle/2));
    }
    static fromComponents(x, y, z, w){
        return new quat(new vec3(x, y, z), w);
    }
    // rotate around x, rotate around y, rotate around z
    static fromEulerAngles(yaw, pitch, roll){
        let cy = Math.cos(yaw / 2);
        let sy = Math.sin(yaw / 2);
        let cp = Math.cos(pitch / 2);
        let sp = Math.sin(pitch / 2);
        let cr = Math.cos(roll / 2);
        let sr = Math.sin(roll / 2);
        return new quat(new vec3(
                sy * cp * cr - cy * sp * sr,
                cy * sp * cr + sy * cp * sr,
                cy * cp * sr - sy * sp * cr
            ),
            cy * cp * cr + sy * sp * sr
        );
    }
    static fromVectorScalar(v, s){
        return new quat(v, s);
    }
    static fromMat3(m){
        return m.toQuat();
    }
    //add
    static add(a, b){
        return a.add(b);
    }
    add(q, out){
        if(out == undefined){
            return this.add(q, this.clone());
        }
        this.v.add(q.v, out.v);
        out.s = this.s + q.s;
        return out;
    }
    addSelf(q){
        return this.add(q, this);
    }
    //sub
    static sub(a, b){
        return a.sub(b);
    }
    sub(q, out){
        if(out == undefined){
            return this.sub(q, this.clone());
        }
        this.v.sub(q.v, out.v);
        out.s = this.s - q.s;
        return out;
    }
    subSelf(q){
        return this.sub(q, this);
    }
    conj(){
        return new quat(new vec3(-this.v.x, -this.v.y, -this.v.z), this.s);
    }
    inverse(){
        return this.conj().scale(1.0 / this.lengthSquared());
    }
    //mult
    static mult(a, b){
        return a.mult(b);
    }
    mult(q, out){
        if(out == undefined){
            return this.mult(q, this.clone());
        }
        const {x, y, z} = this.v;
        const s = this.s;
        out.s = s * q.s - x * q.v.x - y * q.v.y - z * q.v.z;
        out.v.x = s * q.v.x + x * q.s + y * q.v.z - z * q.v.y;
        out.v.y = s * q.v.y - x * q.v.z + y * q.s + z * q.v.x;
        out.v.z = s * q.v.z + x * q.v.y - y * q.v.x + z * q.s;
        //out.v = vec3.cross(this.v, q.v).addSelf(q.v.scale(s)).addSelf(this.v.scale(q.s));
        return out;
    }
    multSelf(q){
        return this.mult(q, this);
    }
    //div
    static div(a, b){
        return a.div(b);
    }
    div(q, out){
        if(out == undefined){
            return this.div(q, this.clone());
        }
        out.s = this.s * q.s + vec3.dot(this.v, q.v);
        out.v = this.v.scale(q.s).subSelf(q.v.scale(this.s)).subSelf(vec3.cross(this.b, q.v));
        return out;
    }
    divSelf(q){
        return this.div(q, this);
    }
    //scale
    static scale(q, l){
        return q.scale(l);
    }
    scale(l, out){
        if(out == undefined){
            return this.scale(l, this.clone());
        }
        out.s = this.s * l;
        this.v.scale(l, out.v);
        return out;
    }
    scaleSelf(l){
        return this.scale(l, this);
    }
    normalize(){
        let l = this.l2norm();
        return this.scaleSelf(1./l);
    }
    normalized(){
        return this.clone().normalize();
    }
    toMat3(){
        const {x, y, z} = this.v;
        const x2 = this.v.x * this.v.x;
        const y2 = this.v.y * this.v.y;
        const z2 = this.v.z * this.v.z;
        return new mat3(
            1. - 2. * y2 - 2. * z2, 
            2. * x * y - 2. * this.s * z, 
            2. * x * z + 2. * this.s * y,

            2. * x * y + 2. * this.s * z, 
            1.0 - 2. * x2 - 2. * z2, 
            2. * y * z - 2. * this.s * x,

            2. * x * z - 2.0 * this.s * y, 
            2. * y * z + 2.0 * this.s * x,
            1.0 - 2. * x2 - 2. * y2
            );
    }
    toMat4(){
        const {x, y, z} = this.v;
        const x2 = this.v.x * this.v.x;
        const y2 = this.v.y * this.v.y;
        const z2 = this.v.z * this.v.z;
        return new mat4(
            1. - 2. * y2 - 2. * z2, 
            2. * x * y - 2. * this.s * z, 
            2. * x * z + 2. * this.s * y,
            0.,

            2. * x * y + 2. * this.s * z, 
            1.0 - 2. * x2 - 2. * z2, 
            2. * y * z - 2. * this.s * x,
            0.,

            2. * x * z - 2.0 * this.s * y, 
            2. * y * z + 2.0 * this.s * x,
            1.0 - 2. * x2 - 2. * y2,
            0.,

            0.,
            0.,
            0.,
            1.
            );
    }
    toAxisAngle(){
        let angle = 2. * Math.atan2(this.v.l2norm(), this.s);
        angle = (Math.abs(angle) > Math.PI?2 * Math.PI * Math.sign(angle) - angle: angle);
        let axis = this.v.clone().normalize();
        let ca = Math.sqrt(1.0 - this.s * this.s);
        if(ca < epsilon){
            axis = new vec3(1., 0., 0.);
        }
        return new axisAngle(axis, angle);
    }
    toEulerAngles(){
        throw new Error("Not implemented");
    }
    rotate(v){
        return this.mult(new quat(v.clone(), 0.0)).multSelf(this.conj()).v;
    }
    l2norm(){
        return Math.sqrt(this.lengthSquared());
    }
    lengthSquared(){
        return this.v.lengthSquared() + this.s * this.s;
    }
    toString(){
        return `[${this.v.x.toFixed(4)}i, ${this.v.y.toFixed(4)}j, ${this.v.z.toFixed(4)}k, ${this.s.toFixed(4)}]`;
    }
}