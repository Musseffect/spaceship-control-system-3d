class Engine{
    constructor(localPosition, direction, maxThrust){
        this.position = localPosition;
        this.maxThrust = maxThrust;
        this.localDirection = direction.normalized();
    }
}

class StateSpaceController{
    //K;
    constructor(K){
        this.K = K;
    }
    computeInput(error){
        return matrix.multVec(this.K, error);
    }
}

class Goal{
    position;
    orientation;
    constructor(position, orientation){
        this.position = position;
        this.orientation = orientation;
    }
    computeError(state){
        let positionError = this.position.sub(state.position);
        let rotationDifference = quat.mult(this.orientation, state.orientation.conj()).toAxisAngle();
        let orientationError = rotationDifference.axis.scaleSelf(-rotationDifference.angle);
        return {positionError, orientationError};
    }
    l1ErrorNorm(state){
        const {positionError, orientationError} = this.computeError(state);
        const velocityError = state.velocity;
        const angularVelocityError = state.angularVelocity;
        return Math.max(
            Math.max(positionError.l1norm(), orientationError.l1norm()),
            Math.max(velocityError.l1norm(), angularVelocityError.l1norm())
            );
    }
}

class Ship{
    body;
    engines;
    thrusts;
    constructor(engines){
        this.body = new Body();
        this.engines = engines;
        this.controller = new StateSpaceController(
            new matrix([
            120, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 120, 140, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 120, 140, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 254, 950, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 254, 950, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 254, 950
            ], 12, 6));
        this.inputProjector = new InputProjectorL2Norm(engines);
    }
    applyControl(goal){
        this.thrusts = [];
        let error = goal.computeError(this.body.state);
        let localError = {
            positionError:this.body.vectorToLocal(error.positionError),
            orientationError:this.body.vectorToLocal(error.orientationError),
            velocityError:this.body.vectorToLocal(this.body.state.velocity),
            angularVelocity:this.body.vectorToLocal(this.body.state.angularVelocity)
        };
        console.log(`vel:${this.body.state.angularVelocity.toString()}, err:${localError.orientationError.toString()}`);
        let input = this.controller.computeInput(new vector([
            localError.positionError.x,
            -localError.velocityError.x,
            localError.positionError.y,
            -localError.velocityError.y,
            localError.positionError.z,
            -localError.velocityError.z,
            localError.orientationError.x,
            localError.angularVelocity.x,
            localError.orientationError.y,
            localError.angularVelocity.y,
            localError.orientationError.z,
            localError.angularVelocity.z
        ]));
        let thrusts = this.inputProjector.project(input);
        for(let i=0;i<thrusts.length();i++){
            let direction = this.engines[i].localDirection;
            if(thrusts.get(i)>0.00001){
                this.body.addForce(vec3.scale(direction, thrusts.get(i)), this.engines[i].position);
            }
            this.thrusts.push({direction: direction, thrust: thrusts.get(i)});
        }
    }
    integrate(dt){
        for(let i=0; i<9;i++)
            this.body.integrate(dt/9);
        this.body.resetForces();
    }
    drawThrusters(){
        this.thrustersRenderObjects.forEach(function(item, id){
            let rotation = quat.fromVectors(new vec3(0, 1, 0), this.engines[id].localDirection);
            rotation = this.body.state.orientation.mult(rotation);
            const scale = Math.min(this.thrusts[id].thrust / 200, 1);
            let size = Math.pow(scale, 1/2);
            const thrustConeSize = 1;
            let position = this.body.state.position.add(this.body.state.orientation.rotate(this.engines[id].position.add(this.engines[id].localDirection.scale(thrustConeSize)))); 
            const quaternion = new THREE.Quaternion(rotation.v.x, rotation.v.y, rotation.v.z, rotation.s);
            item.position.copy(new THREE.Vector3(position.x, position.y, position.z));
            item.quaternion.copy(quaternion);
            item.scale.copy(new THREE.Vector3(0.75, -thrustConeSize, 0.75));
            item.material.opacity = size;
            //item.material.needsUpdate = true;
        }, this);
    }
    drawBody(){
        throw new Error("Not implemented");
    }
    draw(){
        //TODO
        //draw body and draw thrusters
        this.drawBody();
        this.drawThrusters();
    }
    addToScene(scene){
        throw new Error("Not implemented");
    }
}

//TODO
//even-sided tetrahedral ship
class TetrahedralShip extends Ship{
    constructor(mass, transform, size, engines){
        super(engines);
        this.mass = mass;
        this.size = size;
        this.setupState(transform);
    }
    setupState(transform){
        const {mass, size} = this;
    }
    drawBody(){

    }
    addToScene(){

    }

}

//Cuboid-like ship
class CuboidShip extends Ship{
    constructor(mass, transform, width, height, depth, engines){
        super(engines);
        this.mass = mass;
        this.w = width;
        this.h = height;
        this.d = depth;
        this.setupState(transform);
    }
    setupState(transform){
        const {mass, w, h, d} = this;
        let inertia = new mat3(
            1 / 12 * mass * (h * h + d * d), 0, 0,
            0, 1 / 12 * mass * (w * w + d * d), 0,
            0, 0, 1 / 12 * mass * (w * w + h * h)
        );
        this.body.state.velocity = new vec3(15, -5, -4);
        this.body.state.angularVelocity = new vec3(1, -2, 3);
        this.body.state.setFromTransform(transform);
        this.body.state.mass = mass;
        this.body.state.setInertia(inertia);
        this.body.updateTransforms();
    }
    drawBody(){
        const {orientation, position} = this.body.state;
        const quaternion = new THREE.Quaternion(orientation.v.x, orientation.v.y, orientation.v.z, orientation.s);
        this.shipRenderObject.position.copy(new THREE.Vector3(position.x, position.y, position.z));
        this.shipRenderObject.quaternion.copy(quaternion);
    }
    addToScene(scene){
        const geometry = new THREE.BoxGeometry(this.w, this.h, this.d);
        const material = new THREE.MeshBasicMaterial({color: 0x555555});
        this.shipRenderObject = new THREE.Mesh(geometry, material);
        scene.add(this.shipRenderObject);
        this.thrustersRenderObjects = this.engines.map(function(engine, id){
            const geometry = new THREE.ConeGeometry(1, 1, 32);
            const material = new THREE.MeshBasicMaterial(
                {
                    color: 0xCCCC00, 
                    opacity: 0.5, 
                    transparent:true
                });
            const thrusterRenderObject = new THREE.Mesh(geometry, material);
            scene.add(thrusterRenderObject);
            return thrusterRenderObject;
        }, this)
    }
}

//particle system ship

