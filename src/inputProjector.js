function BuildSystemMatrix(engines){
    let matrixData = [];
    for(let i=0;i<engines.length;i++){
        matrixData.push(engines[i].localDirection.x);
    }
    for(let i=0;i<engines.length;i++){
        matrixData.push(engines[i].localDirection.y);
    }
    for(let i=0;i<engines.length;i++){
        matrixData.push(engines[i].localDirection.z);
    }
    let torqueData = [];
    for(let i=0;i<engines.length;i++){
        torqueData.push(vec3.cross(engines[i].position, engines[i].localDirection));
    }
    for(let i=0;i<engines.length;i++){
        matrixData.push(torqueData[i].x);
    }
    for(let i=0;i<engines.length;i++){
        matrixData.push(torqueData[i].y);
    }
    for(let i=0;i<engines.length;i++){
        matrixData.push(torqueData[i].z);
    }
    /*for(let i=0;i<engines.length;i++){
        aArray.push(engines[i].priority);
    }*/
    let A = new matrix(matrixData, engines.length, 6);
    return A;
}
class InputProjectorL2Norm{
    constructor(engines){
        this.engines = engines;
    }
    error(thrusts, input){
        let A = BuildSystemMatrix(this.engines);
        let B = input.clone();
        let error = vector.sub(matrix.multVec(A, thrusts), B).norm2();
        /*for(let i=0;i<thrusts.length();i++)
            error += thrusts.get(i);*/
        return error;
    }
    project(input){
        let A = BuildSystemMatrix(this.engines);
        let AT = A.transpose();
        let B = input.clone();
        let AAT = matrix.mult(A, AT);
        let thrusts = matrix.multVec(matrix.mult(AT, AAT.inverse()), B);
        let scale = 1.;
        for(let i=0;i<this.engines.length;i++){
            scale = Math.max(scale, thrusts.get(i)/this.engines[i].maxThrust);
            thrusts.set(i, Math.max(0, thrusts.get(i)));
            if(thrusts.get(i) == undefined)
                thrusts.set(i, 0);
        }
        thrusts.scaleSelf(1./scale);
        return thrusts;
    }
}