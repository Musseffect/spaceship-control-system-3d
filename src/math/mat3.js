function determinant3x3(m11, m12, m13, m21, m22, m23, m31, m32, m33){
    return m11 * (m22 * m33 - m23 * m32)
    - m12 * (m21 * m33 - m31 * m23)
    + m13 * (m21 * m32 - m31 * m22);
}
function determinant2x2(m11, m12, m21, m22){
    return m11 * m22 - m12 * m21;
}

class mat3{
    constructor(m11, m12, m13, m21, m22, m23, m31, m32, m33){
        this.data = [
            [m11, m12, m13],
            [m21, m22, m23],
            [m31, m32, m33]
        ];
    }
    clone(){
        return new mat3(
            this.get(0, 0), this.get(0, 1), this.get(0, 2),
            this.get(1, 0), this.get(1, 1), this.get(1, 2),
            this.get(2, 0), this.get(2, 1), this.get(2, 2),
        );
    }
    static near(a, b, threshold){
        if(threshold === undefined){
            threshold = epsilon;
        }
        for(let i = 0; i < 3 ; i++){
            for(let j = 0; j < 3; j++){
                if(Math.abs(a.get(i, j) - b.get(i, j)) > threshold)
                    return false;
            }
        }
        return true;
    }
    static empty(){
        return new mat3(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0);
    }
    static identity(){
        return new mat3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1);
    }
    static fromAxisAngle(axisAngle){
        let c = Math.cos(axisAngle.angle);
        let s = Math.sin(axisAngle.angle);
        let x = axisAngle.axis.x;
        let y = axisAngle.axis.y;
        let z = axisAngle.axis.z;
        return new mat3(
            c + x * x * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s,
            y * x * (1 - c) + z * s, c + y * y * (1 - c), y * z * (1 - c) - x * s,
            z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + z * z * (1 - c));

            
        return new mat3(
            c + x * x * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s,
            y * x * (1 - c) + z * s, c + y * y * (1 - c), y * z * (1 - c) - x * s,
            z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + z * z * (1 - c));
    }
    trace(){
        return this.get(0, 0) + this.get(1, 1) + this.get(2, 2);
    }
    toAxisAngle(){
        let trace = this.trace();
        if(near(trace, 3, epsilon)){
            let axis = new vec3(
                this.get(2, 1) - this.get(1, 2),
                this.get(0, 2) - this.get(2, 0),
                this.get(1, 0) - this.get(0, 1)
            );
            let angle = Math.acos((trace - 1)/2);
            return new axisAngle(axis, angle);
        }else{
            let axis = new vec3(
                this.get(2, 1) - this.get(1, 2),
                this.get(0, 2) - this.get(2, 0),
                this.get(1, 0) - this.get(0, 1)
            );
            let length = axis.l2norm();
            let angle = Math.atan2(length, trace - 1);
            if(Math.abs(angle) < epsilon){
                axis = new vec3(1., 0., 0.);
            }
            return new axisAngle(axis, angle);
        }
    }
    toEulerAngles(){
        throw new Error("Not implemented");
    }
    //TODO: rewrite
    //y - up
    //x - left
    //z - dir 
    static yaw(yaw){
        let cy = Math.cos(yaw);
        let sy = Math.cos(yaw);
        let m11 = 1;
        let m12 = 0;
        let m13 = 0;
        let m21 = 0;
        let m22 = cy;
        let m23 = -sy;
        let m31 = 0;
        let m32 = sy;
        let m33 = cy;
        return new mat3(
            m11, m12, m13, 
            m21, m22, m23,
            m31, m32, m33);
    }
    static pitch(pitch){
        let cp = Math.cos(pitch);
        let sp = Math.cos(pitch);
        let m11 = cp;
        let m12 = 0;
        let m13 = sp;
        let m21 = 0;
        let m22 = 1;
        let m23 = 0;
        let m31 = -sp;
        let m32 = 0;
        let m33 = cp;
        return new mat3(
            m11, m12, m13, 
            m21, m22, m23,
            m31, m32, m33);
    }
    static roll(roll){
        let cr = Math.cos(roll);
        let sr = Math.cos(roll);
        let m11 = cr;
        let m12 = -sr;
        let m13 = 0;
        let m21 = sr;
        let m22 = cr;
        let m23 = 0;
        let m31 = 0;
        let m32 = 0;
        let m33 = 1;
        return new mat3(
            m11, m12, m13, 
            m21, m22, m23,
            m31, m32, m33);
    }
    static fromEulerAngles(yaw, pitch, roll){
        let cy = Math.cos(yaw);
        let sy = Math.sin(yaw);
        let cp = Math.cos(pitch);
        let sp = Math.sin(pitch);
        let cr = Math.cos(roll);
        let sr = Math.sin(roll);
        let m11 = cr * cp;
        let m12 = - sr * cy + cr * sp * sy;
        let m13 = sr * sy + cr * sp * cy;
        let m21 = sr * cp;
        let m22 = cr * cy + sr * sp * sy;
        let m23 = -cr * sy + sr * sp * cy;
        let m31 = -sp;
        let m32 = cp * sy;
        let m33 = cp * cy;
        return new mat3(
            m11, m12, m13, 
            m21, m22, m23,
            m31, m32, m33);
    }
    set(i, j, value){
        this.data[i][j] = value;
    }
    get(i, j){
        return this.data[i][j];
    }
    toQuat(){
        throw new Error("Not implemented");
    }
    toMat4(){
        return new mat4(
            this.data[0][0], this.data[0][1], this.data[0][2], 0.,
            this.data[1][0], this.data[1][1], this.data[1][2], 0.,
            this.data[2][0], this.data[2][1], this.data[2][2], 0.,
            0., 0., 0., 1.
            );
    }
    static scale(a, l){
        return a.scale(l);
    }
    scale(l, out){
        if(out == undefined){
            return this.scale(l, this.clone());
        }
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                out.set(i, j, this.get(i, j) * l);
            }
        }
        return out;
    }
    scaleSelf(l){
        return this.scale(l, this);
    }
    static mult(a, b){
        return a.mult(b);
    }
    mult(m, out){
        if(out == undefined){
            return this.mult(m, this.clone());
        }
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let result = 0.0;
                result += this.data[i][0] * m.data[0][j];
                result += this.data[i][1] * m.data[1][j];
                result += this.data[i][2] * m.data[2][j];
                out.set(i, j, result);
            }
        }
        return out;
    }
    multSelf(m){
        return this.clone().mult(m, this);
    }
    determinant(){
        return this.get(0, 0) * (this.get(1, 1) * this.get(2, 2) - this.get(1, 2) * this.get(2, 1))
            - this.get(0, 1) * (this.get(1, 0) * this.get(2, 2) - this.get(2, 0) * this.get(1, 2))
            + this.get(0, 2) * (this.get(1, 0) * this.get(2, 1) - this.get(2, 0) * this.get(1, 1));
    }
    static solve(m, v){
        let d = m.determinant();
        let dx = determinant3x3(
            v.x, m.get(0, 1), m.get(0, 2),
            v.y, m.get(1, 1), m.get(1, 2),
            v.z, m.get(2, 1), m.get(2, 2)
        );
        let dy = determinant3x3(
            m.get(0, 0), v.x, m.get(0, 2),
            m.get(1, 0), v.y, m.get(1, 2),
            m.get(2, 0), v.z, m.get(2, 2)
        );
        let dz = determinant3x3(
            m.get(0, 0), m.get(0, 1), v.x,
            m.get(1, 0), m.get(1, 1), v.y,
            m.get(2, 0), m.get(2, 1), v.z
        );
        return new vec3(dx / d, dy / d, dz / d);
    }
    inverse(){
        let d = this.determinant();
        let m11 = determinant2x2(
            this.get(1, 1), this.get(1, 2), 
            this.get(2, 1), this.get(2, 2)
        );
        let m12 = determinant2x2(
            this.get(0, 2), this.get(0, 1), 
            this.get(2, 2), this.get(2, 1)
        );
        let m13 = determinant2x2(
            this.get(0, 1), this.get(0, 2), 
            this.get(1, 1), this.get(1, 2)
        );
        let m21 = determinant2x2(
            this.get(1, 2), this.get(1, 0), 
            this.get(2, 2), this.get(2, 0)
        );
        let m22 = determinant2x2(
            this.get(0, 0), this.get(0, 2), 
            this.get(2, 0), this.get(2, 2)
        );
        let m23 = determinant2x2(
            this.get(0, 2), this.get(0, 0), 
            this.get(1, 2), this.get(1, 0)
        );
        let m31 = determinant2x2(
            this.get(1, 0), this.get(1, 1), 
            this.get(2, 0), this.get(2, 1)
        );
        let m32 = determinant2x2(
            this.get(0, 1), this.get(0, 0), 
            this.get(2, 1), this.get(2, 0)
        );
        let m33 = determinant2x2(
            this.get(0, 0), this.get(0, 1), 
            this.get(1, 0), this.get(1, 1)
        );
        return new mat3(
            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        ).scaleSelf(1.0 / d);
    }
    transpose(){
        return new mat3(
            this.get(0, 0), this.get(1, 0), this.get(2, 0),
            this.get(0, 1), this.get(1, 1), this.get(2, 1),
            this.get(0, 2), this.get(1, 2), this.get(2, 2)
        );
    }
    transform(point){
        let result = [0, 0, 0];
        for(let i = 0 ; i < 3 ; i++){
            result[i] += this.get(i, 0) * point.x;
            result[i] += this.get(i, 1) * point.y;
            result[i] += this.get(i, 2) * point.z;
        }
        return new vec3(result[0], result[1], result[2]);
    }
    toString(){
        return `[
    [${this.get(0, 0).toFixed(4)}, ${this.get(0, 1).toFixed(4)}, ${this.get(0, 2).toFixed(4)}]
    [${this.get(1, 0).toFixed(4)}, ${this.get(1, 1).toFixed(4)}, ${this.get(1, 2).toFixed(4)}]
    [${this.get(2, 0).toFixed(4)}, ${this.get(2, 1).toFixed(4)}, ${this.get(2, 2).toFixed(4)}]
]`;
    }
}