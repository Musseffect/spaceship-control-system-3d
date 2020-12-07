class Path{
    pathArray;
    current;
    constructor(pathArray){
        this.pathArray = pathArray;
        this.current = 0;
    }
    currentPoint(){
        return this.pathArray[this.current];
    }
    reset(){
        this.current = 0;
    }
    advance(){
        this.current += (this.current == this.pathArray.length?0:1);
    }
}

class Simulation{
    constructor(){
        function computeTetrahedronEngines(size){
            const invSqr2 = 1 / Math.sqrt(2);
            const vertices = [
                new vec3(1, 0, -invSqr2).scaleSelf(size/2),
                new vec3(-1, 0, -invSqr2).scaleSelf(size/2),
                new vec3(0, 1, invSqr2).scaleSelf(size/2),
                new vec3(0, -1, invSqr2).scaleSelf(size/2)
            ];
            const center = vec3.add(
                vec3.add(vertices[0], vertices[1]), 
                vec3.add(vertices[2], vertices[3])
            ).scaleSelf(0.25);
            const planeCenters = [
                vec3.add(vertices[0], vertices[1]).add(vertices[2]).scaleSelf(1/3),
                vec3.add(vertices[0], vertices[1]).add(vertices[3]).scaleSelf(1/3),
                vec3.add(vertices[1], vertices[2]).add(vertices[3]).scaleSelf(1/3),
                vec3.add(vertices[0], vertices[2]).add(vertices[3]).scaleSelf(1/3),
            ];
            const enginePoints = [
                //01
                vec3.add(vertices[0], vertices[1]).scaleSelf(0.5),
                //12
                vec3.add(vertices[1], vertices[2]).scaleSelf(0.5),
                //20
                vec3.add(vertices[2], vertices[0]).scaleSelf(0.5),
                //03
                vec3.add(vertices[0], vertices[3]).scaleSelf(0.5),
                //13
                vec3.add(vertices[1], vertices[3]).scaleSelf(0.5),
                //23
                vec3.add(vertices[2], vertices[3]).scaleSelf(0.5)
            ];
            const normals = [
                planeCenters[0].sub(center).normalize(),
                planeCenters[1].sub(center).normalize(),
                planeCenters[2].sub(center).normalize(),
                planeCenters[3].sub(center).normalize(),
            ];
            const engines = [
                //012
                new Engine(enginePoints[0], normals[0], 200),
                new Engine(enginePoints[1], normals[0], 200),
                new Engine(enginePoints[2], normals[0], 200),
                //013
                new Engine(enginePoints[0], normals[1], 200),
                new Engine(enginePoints[3], normals[1], 200),
                new Engine(enginePoints[4], normals[1], 200),
                //123
                new Engine(enginePoints[1], normals[2], 200),
                new Engine(enginePoints[4], normals[2], 200),
                new Engine(enginePoints[5], normals[2], 200),
                //023
                new Engine(enginePoints[2], normals[3], 200),
                new Engine(enginePoints[3], normals[3], 200),
                new Engine(enginePoints[5], normals[3], 200)
            ];
            return engines;
        }
        const x = 4, y = 2, z = 1;
        const w = 6*0.5, h = 4*0.5, d = 3*0.5;
        const engines = computeTetrahedronEngines(6, 5);
        /*const engines = [
            //xy -z
            new Engine(new vec3(x, y, -d), new vec3(0, 0, -1), 200),
            new Engine(new vec3(-x, y, -d), new vec3(0, 0, -1), 200),
            new Engine(new vec3(x, -y, -d), new vec3(0, 0, -1), 200),
            new Engine(new vec3(-x, -y, -d), new vec3(0, 0, -1), 200),
            //xy z
            new Engine(new vec3(x, y, d), new vec3(0, 0, 1), 200),
            new Engine(new vec3(-x, y, d), new vec3(0, 0, 1), 200),
            new Engine(new vec3(x, -y, d), new vec3(0, 0, 1), 200),
            new Engine(new vec3(-x, -y, d), new vec3(0, 0, 1), 200),
            //xz -y
            new Engine(new vec3(x, -h, z), new vec3(0, -1, 0), 200),
            new Engine(new vec3(-x, -h, z), new vec3(0, -1, 0), 200),
            new Engine(new vec3(x, -h, -z), new vec3(0, -1, 0), 200),
            new Engine(new vec3(-x, -h, -z), new vec3(0, -1, 0), 200),
            //xz y
            new Engine(new vec3(x, h, z), new vec3(0, 1, 0), 200),
            new Engine(new vec3(-x, h, z), new vec3(0, 1, 0), 200),
            new Engine(new vec3(x, h, -z), new vec3(0, 1, 0), 200),
            new Engine(new vec3(-x, h, -z), new vec3(0, 1, 0), 200),
            //yz -x
            new Engine(new vec3(-w, y, z), new vec3(-1, 0, 0), 200),
            new Engine(new vec3(-w, -y, z), new vec3(-1, 0, 0), 200),
            new Engine(new vec3(-w, y, -z), new vec3(-1, 0, 0), 200),
            new Engine(new vec3(-w, -y, -z), new vec3(-1, 0, 0), 200),
            //yz x
            new Engine(new vec3(w, y, z), new vec3(1, 0, 0), 200),
            new Engine(new vec3(w, -y, z), new vec3(1, 0, 0), 200),
            new Engine(new vec3(w, y, -z), new vec3(1, 0, 0), 200),
            new Engine(new vec3(w, -y, -z), new vec3(1, 0, 0), 200)
        ];*/
        let transf = new transform(new vec3(0, 0, 0), quat.fromEulerAngles(0, 0, 0), new vec3(1, 1, 1));
        this.ship = new CuboidShip(100., transf, w*2, h*2, d*2, engines);
        this.time = 0.0;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        
        this.goalRenderObject = new THREE.Mesh(geometry, material);
        this.ship.addToScene(this.scene);
        this.scene.add(this.goalRenderObject);
        
        this.camera.position.set(0, 0, 80);
    }
    goal(time){




        //time = Math.floor(time / 4);
        let phi = time * 0.5;
        let theta = time * 0.8 + 1.2;
        let r = 30.0;
        let sp = Math.sin(phi);
        let cp = Math.cos(phi);
        let st = Math.sin(theta);
        let ct = Math.cos(theta);
        const targetPosition = new vec3(sp * st * r, cp * st * r, ct * r);
        //const targetOrientation = quat.identity();
        //const targetOrientation = quat.fromVectors(new vec3(1., 0., 0.), new vec3(-sp * st, -cp * st, -ct));
        const targetOrientation = quat.fromVectors(new vec3(1., 0., 0.), new vec3(1, 0,0));
        return new Goal(targetPosition, targetOrientation);
    }
    drawGoal(goal){
        this.goalRenderObject.position.copy(new THREE.Vector3(goal.position.x, goal.position.y, goal.position.z));
        this.goalRenderObject.scale.copy(new THREE.Vector3(6*0.95, 4*0.95, 3*0.95));
        const quaternion = new THREE.Quaternion(goal.orientation.v.x, goal.orientation.v.y, goal.orientation.v.z, goal.orientation.s);
        this.goalRenderObject.quaternion.copy(quaternion)
    }
    update(dt){
        let goal = this.goal(this.time);
        this.drawGoal(goal);
        this.ship.applyControl(goal);
        this.ship.integrate(dt * 9.8);
        this.ship.draw();
        this.time += dt;
        let shift = this.ship.body.state.orientation.rotate(new vec3(20, 10, 0));
        const position = new THREE.Vector3(this.ship.body.state.position.x, 
            this.ship.body.state.position.y, 
            this.ship.body.state.position.z);
        const camPos = new THREE.Vector3(this.ship.body.state.position.x + shift.x, 
            this.ship.body.state.position.y + shift.y, 
            this.ship.body.state.position.z + shift.z);
        const quaternion = new THREE.Quaternion(this.ship.body.state.orientation.v.x, 
            this.ship.body.state.orientation.v.y,
            this.ship.body.state.orientation.v.z,
            this.ship.body.state.orientation.s 
            );
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);
        this.camera.position.copy(camPos);
        this.camera.up.copy(up);
        this.camera.lookAt(position);
        //this.camera.quaternion.copy(quaternion);
    }
    render(){
        this.renderer.render(this.scene, this.camera);
    }
}