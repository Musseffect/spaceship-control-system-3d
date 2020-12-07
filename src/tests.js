(function(){
    class TestValue{
        condition;
        not;
        value;
        constructor(value, condition){
            this.value = value;
            this.condition = condition;
        }
        toBeGreater(expected){
            if((this.value > expected) == expected)
                console.log(`\t${this.condition}(${this.value} > ${expected}): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} > ${expected}): FAILED`);
            return this;
        }
        toBeGreaterOrEqual(expected){
            if((this.value > expected) == expected)
                console.log(`\t${this.condition}(${this.value} >= ${expected}): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} >= ${expected}): FAILED`);
            return this;
        }
        toBeLess(expected){
            if((this.value > expected) == expected)
                console.log(`\t${this.condition}(${this.value} < ${expected}): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} < ${expected}): FAILED`);
            return this;
        }
        toBeLessOrEqual(expected){
            if((this.value > expected) == expected)
                console.log(`\t${this.condition}(${this.value} <= ${expected}): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} <= ${expected}): FAILED`);
            return this;
        }
        toTrow(exception){
            if(exception === undefined){
                let throwed = false;
                try{
                    this.value();
                }catch(e){
                    throwed = true;
                }
                if(this.condition == throwed)
                    console.log(`\t${this.condition}(${this.value} throwing exception): MATCHED`);
                else
                    throw new Error(`${this.condition}(${this.value} throwing exception): FAILED`);
            }else if(exception instanceof Error){
                try{
                    this.value();
                }catch(e){
                    if(this.condition == Object.is(e.message, exception.message))
                        throw new Error(`${this.condition}(${this.value} throwing ${exception.message}): FAILED`);
                    else
                        console.log(`\t${this.condition}(${this.value} throwing ${exception}): MATCHED`);
                    return;
                }
                if(!this.condition)
                    throw new Error(`${this.condition}(${this.value} throwing ${exception}): FAILED`);
                else
                    console.log(`\t${this.condition}(${this.value} throwing ${exception}): MATCHED`);
            }else if(exception instanceof String){
                try{
                    this.value();
                }catch(e){
                    if(this.condition == (e == exception))
                        throw new Error(`${this.condition}(${this.value} throwing ${exception}): FAILED`);
                    else
                        console.log(`\t${this.condition}(${this.value} throwing ${exception}): MATCHED`);
                    return;
                }
                if(!this.condition)
                    throw new Error(`${this.condition}(${this.value} throwing ${exception}): FAILED`);
                else
                    console.log(`\t${this.condition}(${this.value} throwing ${exception}): MATCHED`);
            }else if(exception instanceof Function){
                try{
                    this.value();
                }catch(e){
                    if(this.condition == (e instanceof exception))
                        throw new Error(`${this.condition}(${this.value} throwing ${exception.name}): FAILED`);
                    else
                        console.log(`\t${this.condition}(${this.value} throwing ${exception.name}): MATCHED`);
                    return;
                }
                if(!this.condition)
                    throw new Error(`${this.condition}(${this.value} throwing ${exception.name}): FAILED`);
                else
                    console.log(`\t${this.condition}(${this.value} throwing ${exception.name}): MATCHED`);
            }else{
                try{
                    this.value();
                }catch(e){
                    if(this.condition == Object.is(e, exception))
                        throw new Error(`${this.condition}(${this.value} throwing ${exception}): FAILED`);
                    else
                        console.log(`\t${this.condition}(${this.value} throwing ${exception}): MATCHED`);
                    return;
                }
                if(!this.condition)
                    throw new Error(`${this.condition}(${this.value} throwing ${exception}): FAILED`);
                else
                    console.log(`\t${this.condition}(${this.value} throwing ${exception}): MATCHED`);
            }
            return this;
        }
        toBeNotNull(){
            if(!isNull(this.value) == this.condition)
                console.log(`\t${this.condition}(${this.value} is not null): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} is not null): FAILED`);
            return this;
        }
        toBeNull(){
            if(isNull(this.value) == this.condition)
                console.log(`\t${this.condition}(${this.value} is null): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} is null): FAILED`);
            return this;
        }
        toBeNear(expected, threshold){
            if(threshold === undefined){
                threshold = epsilon;
            }
            if((Math.abs(this.value - expected) <= threshold) == this.condition)
                console.log(`\t${this.condition}(${this.value} is near ${expected}): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} is near ${expected}): FAILED`)
            return this;
        }
        toBeEqual(expected){
            if(Object.is(this.value, expected) == expected)
                console.log(`\t${this.condition}(${this.value} is ${expected}): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} is ${expected}): FAILED`);
            return this;
        }
        toBeBoolean(){
            if((this.value instanceof bool) == this.condition)
                console.log(`\t${this.condition}(${this.value} is bool): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} is bool): FAILED`);
            return this;
        }
        toBeNumber(){
            if((this.value instanceof Number) == this.condition)
                console.log(`\t${this.condition}(${this.value} is Number): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} is Number): FAILED`);
            return this;
        }
        toBeDefined(){
            if((this.value !== undefined) == this.condition)
                console.log(`\t${this.condition}(${this.value} is defined): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} is defined): FAILED`);
            return this;
        }
        toBeUndefined(){
            if((this.value === undefined) == this.condition)
                console.log(`\t${this.condition}(${this.value} is undefined): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} is undefined): FAILED`);
            return this;
        }
        toBeTrue(){
            if(this.value == this.condition)
                console.log(`\t${this.condition}(${this.value} == true): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} == true): FAILED`);
            return this;
        }
        toBeFalse(){
            if(!this.value == this.condition)
                console.log(`\t${this.condition}(${this.value} == false): MATCHED`);
            else
                throw new Error(`${this.condition}(${this.value} == false): FAILED`);
                return this;
        }
    }
    function expect(value){
        let result = new TestValue(value, true);
        result.value = value;
        result.not = new TestValue(value, false);
        result.not.not = result;
        return result;
    }

    function test(message, testBody){
        try{
            console.log(`${message} :`);
            testBody();
            console.log(`${message} : PASSED`);
        }catch(e){
            if(e instanceof Error)
                console.log(`Test ${message} FAILED. Reason: \n ${e.message}`);
            else if(e instanceof String)
                console.log(`Test ${message} FAILED. Reason: \n ${e}`);
            else
                console.log(`Test ${message} FAILED. Reason: \n ${e.toString()}`);
        }
    }

    (function(){
        /*test("Quaternion operations", ()=>{
            let axisAngleRotation = new axisAngle(new vec3(1., 2., -3.), radians(70));
            let quatRotation = quat.fromAxisAngle(axisAngleRotation);
            expect(quat.near(quatRotation.mult(quatRotation.inverse()), quat.identity())).toBeTrue();
        });
        */
        /*
        test("Vec3 operations", ()=>{
            let a = new vec3(1., 3., 2.);
            let b = new vec3(2., -1., -4.);
            expect(a.l1norm()).toBeNear(6, epsilon);
            expect(a.l2norm()).toBeNear(Math.sqrt(vec3.dot(a, a)), epsilon);
            expect(a.lInfnorm()).toBeNear(3, epsilon);
            expect(vec3.dot(a, vec3.cross(a, b))).toBeNear(0.0);
            expect(vec3.near(vec3.add(a, b), new vec3(3, 2, -2), epsilon)).toBeTrue();
            expect(vec3.near(vec3.mult(a, b), new vec3(2, -3, -8), epsilon)).toBeTrue();
            expect(vec3.near(vec3.sub(a, b), new vec3(-1, 4, 6), epsilon)).toBeTrue();
            expect(vec3.near(vec3.div(a, b), new vec3(0.5, -3, -0.5), epsilon)).toBeTrue();
        });
        */
        /*
        test("Mat3 transpose", ()=>{
            let a = new mat3(1, 3, 2, 4, 6, 8, 3, -2, -5);
            expect(mat3.near(a.transpose().transpose(), a, epsilon)).toBeTrue();
        });
        */
        /*
        test("Mat3 multiplication", ()=>{
            let a = new mat3(1, 3, 2, 4, 6, 8, 3, -2, -5);
            let b = new mat3(4, -2, -1, -31, 21, -4, 51, -13, 10);
            let c = new mat3(13, 35, 7, 238, 14, 52, -181, 17, -45);
            expect(mat3.near(a, mat3.mult(a, mat3.identity()), epsilon)).toBeTrue();
            expect(mat3.near(c, mat3.mult(a, b), epsilon)).toBeTrue();
        });
        */
        /*
        test("Mat3 inverse", ()=>{
            let a = new mat3(1, 3, 2, 4, 6, 8, 3, -2, -5);
            let b = new mat3(4, -2, -1, -31, 21, -4, 51, -13, 10);
            expect(mat3.near(mat3.identity(), mat3.mult(a, a.inverse()), epsilon)).toBeTrue();
            expect(mat3.near(mat3.identity(), a.mult(a.inverse()), epsilon)).toBeTrue();
        });
        */
        /*
        test("Mat3 determinant", ()=>{
            expect(mat3.identity().determinant()).toBeNear(1);
        });
        */
        /*
        test("Mat4 transpose", ()=>{
            let a = new mat4(
                1, 3, 2, 4,
                6, 8, 3, -2,
                -5, 3, 2, 1,
                3, 4, 5, 2);
            expect(mat4.near(a.transpose().transpose(), a, epsilon)).toBeTrue();
        });
        */
        /*
        test("Mat4 inverse", ()=>{
            let a = new mat4(
                1, 3, 2, 4,
                6, 8, 3, -2,
                -5, 3, 2, 1,
                3, 4, 5, 2);
                expect(mat4.near(mat4.identity(), mat4.mult(a, a.inverse()), epsilon)).toBeTrue();
                expect(mat4.near(mat4.identity(), a.mult(a.inverse()), epsilon)).toBeTrue();
        });
        */
        /*
        test("Mat4 determinant", ()=>{
            let b = new mat3(4, -2, -1, -31, 21, -4, 51, -13, 10);
            expect(mat4.identity().determinant()).toBeNear(1);
        });
        */
        /*
        test("Convert transform to affine", ()=>{
            let axisAngleRotation = new axisAngle(new vec3(1., 2., -3.), radians(70));
            let translation = new vec3(-2, 3, 4.);
            let rotation = quat.fromAxisAngle(axisAngleRotation);
            let scale = new vec3(1.2, -0.2, 0.4);
            let t = mat4.fromTranslation(translation);
            let r = mat4.fromRotation(rotation);
            let s = mat4.fromScale(scale);
            let trs = mat4.fromTRS(translation, rotation, scale);
            expect(mat4.near(trs, t.mult(r).mult(s), epsilon)).toBeTrue();
        });
        */
        /*
        test("Transform components", ()=>{
        let point = new vec3(0.3, -0.5, -0.2);
            let axisAngleRotation = new axisAngle(new vec3(1., 2., -3.), radians(70));
            let translation = new vec3(-2, 3, 4.);
            let rotation = quat.fromAxisAngle(axisAngleRotation);
            let scale = new vec3(1.2, -0.2, 0.4);
            let t = mat4.fromTranslation(translation);
            let r = mat4.fromRotation(rotation);
            let s = mat4.fromScale(scale);
            let trs = mat4.fromTRS(translation, rotation, scale);
            let pS1 = vec3.mult(point, scale);
            let pS2 = s.transformPoint(point);
            let pRS1 = rotation.rotate(pS1);
            let pRS2 = r.transformPoint(pS2);
            let pTRS1 = vec3.add(translation, pRS1);
            let pTRS2 = t.transformPoint(pRS2);
            expect(vec3.near(pS1, pS2, epsilon)).toBeTrue();
            expect(vec3.near(pRS1, pRS2, epsilon)).toBeTrue();
            expect(vec3.near(pTRS1, pTRS2, epsilon)).toBeTrue();
            expect(vec3.near(pTRS1, trs.transformPoint(point), epsilon)).toBeTrue();

        });
        */
       /*
        test("Transform point", ()=>{
            let axisAngleRotation = new axisAngle(new vec3(1., 2., -3.), radians(70));
            let t = new transform(new vec3(-2, 3, 4.), quat.fromAxisAngle(axisAngleRotation), new vec3(1.2, -0.2, 0.4));
            let point = new vec3(0.3, -0.5, -0.2);
            let matTransform = t.toAffine();
            expect(vec3.near(matTransform.transformPoint(point), t.transformPoint(point), epsilon)).toBeTrue();
        });
        */
       /*
        test("Transform vector", ()=>{
            let axisAngleRotation = new axisAngle(new vec3(1., 2., -3.), radians(70));
            let t = new transform(new vec3(-2, 3, 4.), quat.fromAxisAngle(axisAngleRotation), new vec3(1.2, -0.2, 0.4));
            let point = new vec3(0.3, -0.5, -0.2);
            let matTransform = t.toAffine();
            expect(vec3.near(matTransform.transformVector(point), t.transformVector(point), epsilon)).toBeTrue();
        });
        */
       /*
        test("Matrix rotation inverse", ()=>{
            let axisAngleRotation = new axisAngle(new vec3(1., 2., -3.), radians(70));
            let matRotation = mat3.fromAxisAngle(axisAngleRotation);
            expect(mat3.near(matRotation.inverse(), matRotation.transpose(), epsilon)).toBeTrue();
        });
        */
        /*
        test("Rotations", ()=>{
            let axisAngleRotation = new axisAngle(new vec3(1., 2., -3.), radians(70));

            let quatRotation = quat.fromAxisAngle(axisAngleRotation);
            let matRotation = mat3.fromAxisAngle(axisAngleRotation);
            let point = new vec3(0.3, -0.5, -0.2);
            expect(vec3.near(quatRotation.rotate(point), matRotation.transform(point), epsilon)).toBeTrue();
            expect(vec3.near(quatRotation.rotate(point), axisAngleRotation.rotate(point), epsilon)).toBeTrue();   

            let eulerRotation = new vec3(radians(30), radians(55), radians(72));
            quatRotation = quat.fromEulerAngles(eulerRotation.x, eulerRotation.y, eulerRotation.z);
            matRotation = mat3.fromEulerAngles(eulerRotation.x, eulerRotation.y, eulerRotation.z);
            expect(vec3.near(quatRotation.rotate(point), matRotation.transform(point), epsilon)).toBeTrue();
            expect(vec3.near(quatRotation.rotate(point), eulerRotation.rotateEuler(point), epsilon)).toBeTrue();
        });
        */
        test("Rotation conversions test", ()=>{
            let axisAngleRotation = new axisAngle(new vec3(1., 2., -3.), radians(70));

            let quatRotation = quat.fromAxisAngle(axisAngleRotation);
            let matRotation = mat3.fromAxisAngle(axisAngleRotation);
            let point = new vec3(0.3, -0.5, -0.2);
            expect(mat3.near(quatRotation.toMat3(), matRotation, epsilon)).toBeTrue();
            expect(quat.near(quatRotation, matRotation.toQuat(), epsilon)).toBeTrue();
            expect(axisAngle.near(quatRotation.toAxisAngle(), axisAngleRotation, epsilon)).toBeTrue();
            expect(axisAngle.near(matRotation.toAxisAngle(), axisAngleRotation, epsilon)).toBeTrue();
            
            let eulerRotation = new vec3(radians(30), radians(55), radians(72));
            quatRotation = quat.fromEulerAngles(eulerRotation.x, eulerRotation.y, eulerRotation.z);
            matRotation = mat3.fromEulerAngles(eulerRotation.x, eulerRotation.y, eulerRotation.z);
            expect(vec3.near(quatRotation.toMat3().rotate(point), matRotation.transform(point), epsilon)).toBeTrue();
            expect(vec3.near(quatRotation.rotate(point), matRotation.toQuat().rotate(point), epsilon)).toBeTrue();
        });
    })();
})();