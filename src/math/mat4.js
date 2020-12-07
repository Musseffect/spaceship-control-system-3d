function determinant4x4(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44){
    return m11 * determinant3x3(m22, m23, m24, m32, m33, m34, m42, m43, m44)
        - m12 * determinant3x3(m21, m23, m24, m31, m33, m34, m41, m43, m44)
        + m13 * determinant3x3(m21, m22, m24, m31, m32, m34, m41, m42, m44)
        - m14 * determinant3x3(m21, m22, m23, m31, m32, m33, m41, m42, m43);
}

class mat4{
    constructor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44){
        this.data = [
            [m11, m12, m13, m14],
            [m21, m22, m23, m24],
            [m31, m32, m33, m34],
            [m41, m42, m43, m44]
        ];
    }
    clone(){
        return new mat4(
            this.get(0, 0), this.get(0, 1), this.get(0, 2), this.get(0, 3),
            this.get(1, 0), this.get(1, 1), this.get(1, 2), this.get(2, 3),
            this.get(2, 0), this.get(2, 1), this.get(2, 2), this.get(2, 3),
            this.get(3, 0), this.get(3, 1), this.get(3, 2), this.get(3, 3)
            );
    }
    static near(a, b, threshold){
        if(threshold === undefined){
            threshold = epsilon;
        }
        for(let i = 0; i < 4 ; i++){
            for(let j = 0; j < 4; j++){
                if(Math.abs(a.get(i, j) - b.get(i, j)) > threshold)
                    return false;
            }
        }
        return true;
    }
    static empty(){
        return new mat4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0);
    }
    static identity(){
        return new mat4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1);
    }
    set(i, j, value){
        this.data[i][j] = value;
    }
    get(i, j){
        return this.data[i][j];
    }
    extractMat3(){
        return new mat3(
            this.get(0, 0), this.get(0, 1), this.get(0, 2),
            this.get(1, 0), this.get(1, 1), this.get(1, 2),
            this.get(2, 0), this.get(2, 1), this.get(2, 2)
        );
    }
    determinant(){
        return determinant4x4(
            this.get(0, 0), this.get(0, 1), this.get(0, 2), this.get(0, 3), 
            this.get(1, 0), this.get(1, 1), this.get(1, 2), this.get(1, 3), 
            this.get(2, 0), this.get(2, 1), this.get(2, 2), this.get(2, 3), 
            this.get(3, 0), this.get(3, 1), this.get(3, 2), this.get(3, 3)
        );
    }
    extractTranslation(){
        return new vec3(this.get(0, 3), this.get(1, 3), this.get(2, 3));
    }
    transformPoint(point){
        let result = [0, 0, 0, 0];
        for(let i = 0 ; i < 4 ; i++){
            result[i] += this.get(i, 0) * point.x;
            result[i] += this.get(i, 1) * point.y;
            result[i] += this.get(i, 2) * point.z;
            result[i] += this.get(i, 3);
        }
        return new vec3(result[0] / result[3], result[1] / result[3], result[2] / result[3]);
    }
    transformVector(vector){
        let result = [0, 0, 0];
        for(let i = 0 ; i < 3 ; i++){
            result[i] += this.get(i, 0) * vector.x;
            result[i] += this.get(i, 1) * vector.y;
            result[i] += this.get(i, 2) * vector.z;
        }
        return new vec3(result[0], result[1], result[2]);
    }
    transpose(){
        return new mat4(
            this.get(0, 0), this.get(1, 0), this.get(2, 0), this.get(3, 0), 
            this.get(0, 1), this.get(1, 1), this.get(2, 1), this.get(3, 1), 
            this.get(0, 2), this.get(1, 2), this.get(2, 2), this.get(3, 2), 
            this.get(0, 3), this.get(1, 3), this.get(2, 3), this.get(3, 3)
            );
    }
    static scale(a, l){
        return a.scale(l);
    }
    scale(l, out){
        if(out == undefined){
            return this.scale(l, this.clone());
        }
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
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
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                let result = 0.0;
                result += this.data[i][0] * m.data[0][j];
                result += this.data[i][1] * m.data[1][j];
                result += this.data[i][2] * m.data[2][j];
                result += this.data[i][3] * m.data[3][j];
                out.set(i, j, result);
            }
        }
        return out;
    }
    multSelf(m){
        return this.clone().mult(m, this);
    }
    static fromTranslation(t){
        return new mat4(
            1, 0, 0, t.x,
            0, 1, 0, t.y,
            0 ,0 ,1, t.z,
            0, 0, 0, 1);
    }
    static fromMat3(m){
        return new mat4(
            m.get(0, 0), m.get(0, 1), m.get(0, 2), 0,
            m.get(1, 0), m.get(1, 1), m.get(1, 2), 0,
            m.get(2, 0), m.get(2, 1), m.get(2, 2), 0,
            0, 0, 0, 1);
    }
    static fromRotation(r){
        return r.toMat4();
    }
    static fromScale(s){
        return new mat4(
            s.x, 0, 0, 0,
            0, s.y, 0, 0,
            0 ,0 ,s.z, 0,
            0, 0, 0, 1);
    }
    static fromTRS(t, r, s){
        let rMat = r.toMat3();
        return new mat4(
            rMat.get(0, 0) * s.x, rMat.get(0, 1) * s.y, rMat.get(0, 2) * s.z, t.x, 
            rMat.get(1, 0) * s.x, rMat.get(1, 1) * s.y, rMat.get(1, 2) * s.z, t.y,
            rMat.get(2, 0) * s.x, rMat.get(2, 1) * s.y, rMat.get(2, 2) * s.z, t.z,
            0, 0, 0, 1
        );
    }
    inverse(){
        let d = this.determinant();
        let m11 = determinant3x3(
            this.get(1, 1), this.get(1, 2), this.get(1, 3),
            this.get(2, 1), this.get(2, 2), this.get(2, 3),
            this.get(3, 1), this.get(3, 2), this.get(3, 3)
        );
        let m21 = determinant3x3(
            this.get(1, 0), this.get(1, 2), this.get(1, 3),
            this.get(2, 0), this.get(2, 2), this.get(2, 3),
            this.get(3, 0), this.get(3, 2), this.get(3, 3)
        );
        let m31 = determinant3x3(
            this.get(1, 0), this.get(1, 1), this.get(1, 3),
            this.get(2, 0), this.get(2, 1), this.get(2, 3),
            this.get(3, 0), this.get(3, 1), this.get(3, 3)
        );
        let m41 = determinant3x3(
            this.get(1, 0), this.get(1, 1), this.get(1, 2),
            this.get(2, 0), this.get(2, 1), this.get(2, 2),
            this.get(3, 0), this.get(3, 1), this.get(3, 2)
        );
        let m12 = determinant3x3(
            this.get(0, 1), this.get(0, 2), this.get(0, 3),
            this.get(2, 1), this.get(2, 2), this.get(2, 3),
            this.get(3, 1), this.get(3, 2), this.get(3, 3)
        );
        let m22 = determinant3x3(
            this.get(0, 0), this.get(0, 2), this.get(0, 3),
            this.get(2, 0), this.get(2, 2), this.get(2, 3),
            this.get(3, 0), this.get(3, 2), this.get(3, 3)
        );
        let m32 = determinant3x3(
            this.get(0, 0), this.get(0, 1), this.get(0, 3),
            this.get(2, 0), this.get(2, 1), this.get(2, 3),
            this.get(3, 0), this.get(3, 1), this.get(3, 3)
        );
        let m42 = determinant3x3(
            this.get(0, 0), this.get(0, 1), this.get(0, 2),
            this.get(2, 0), this.get(2, 1), this.get(2, 2),
            this.get(3, 0), this.get(3, 1), this.get(3, 2)
        );
        let m13 = determinant3x3(
            this.get(0, 1), this.get(0, 2), this.get(0, 3),
            this.get(1, 1), this.get(1, 2), this.get(1, 3),
            this.get(3, 1), this.get(3, 2), this.get(3, 3)
        );
        let m23 = determinant3x3(
            this.get(0, 0), this.get(0, 2), this.get(0, 3),
            this.get(1, 0), this.get(1, 2), this.get(1, 3),
            this.get(3, 0), this.get(3, 2), this.get(3, 3)
        );
        let m33 = determinant3x3(
            this.get(0, 0), this.get(0, 1), this.get(0, 3),
            this.get(1, 0), this.get(1, 1), this.get(1, 3),
            this.get(3, 0), this.get(3, 1), this.get(3, 3)
        );
        let m43 = determinant3x3(
            this.get(0, 0), this.get(0, 1), this.get(0, 2),
            this.get(1, 0), this.get(1, 1), this.get(1, 2),
            this.get(3, 0), this.get(3, 1), this.get(3, 2)
        );
        let m14 = determinant3x3(
            this.get(0, 1), this.get(0, 2), this.get(0, 3),
            this.get(1, 1), this.get(1, 2), this.get(1, 3),
            this.get(2, 1), this.get(2, 2), this.get(2, 3)
        );
        let m24 = determinant3x3(
            this.get(0, 0), this.get(0, 2), this.get(0, 3),
            this.get(1, 0), this.get(1, 2), this.get(1, 3),
            this.get(2, 0), this.get(2, 2), this.get(2, 3)
        );
        let m34 = determinant3x3(
            this.get(0, 0), this.get(0, 1), this.get(0, 3),
            this.get(1, 0), this.get(1, 1), this.get(1, 3),
            this.get(2, 0), this.get(2, 1), this.get(2, 3)
        );
        let m44 = determinant3x3(
            this.get(0, 0), this.get(0, 1), this.get(0, 2),
            this.get(1, 0), this.get(1, 1), this.get(1, 2),
            this.get(2, 0), this.get(2, 1), this.get(2, 2)
        );
        return new mat4(
            m11, -m12, m13, -m14,
            -m21, m22, -m23, m24,
            m31, -m32, m33, -m34,
            -m41, m42, -m43, m44
        ).scaleSelf(1 / d);
    }    
    toString(){
        return `[
    [${this.get(0, 0).toFixed(4)}, ${this.get(0, 1).toFixed(4)}, ${this.get(0, 2).toFixed(4)}, ${this.get(0, 3).toFixed(4)}]
    [${this.get(1, 0).toFixed(4)}, ${this.get(1, 1).toFixed(4)}, ${this.get(1, 2).toFixed(4)}, ${this.get(1, 3).toFixed(4)}]
    [${this.get(2, 0).toFixed(4)}, ${this.get(2, 1).toFixed(4)}, ${this.get(2, 2).toFixed(4)}, ${this.get(2, 3).toFixed(4)}]
    [${this.get(3, 0).toFixed(4)}, ${this.get(3, 1).toFixed(4)}, ${this.get(3, 2).toFixed(4)}, ${this.get(3, 3).toFixed(4)}]
]`;
    }
}