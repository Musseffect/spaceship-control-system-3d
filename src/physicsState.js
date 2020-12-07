class State{
	position;//:vec3;
	velocity;//:vec3;

	mass;//:number;
	inertia;//:mat3;
	invIntertia;//:mat3;

	orientation;//:quat;
	angularVelocity;//:vec3;
	constructor(){
		this.mass = 1;
		this.inertia = mat3.identity();
		this.invIntertia = mat3.identity();
		this.position = vec3.empty();
		this.velocity = vec3.empty();
		this.orientation = quat.identity();
		this.angularVelocity = vec3.empty();
	}
	setInertia(inertia){
		this.inertia = inertia;
		this.invInertia = this.inertia.inverse();
	}
	setFromTransform(transform){
		this.position = transform.translation.clone();
		this.orientation = transform.rotation.clone();
	}
	toTransform(){
		return new transform(this.position.clone(), this.orientation.clone(), new vec3(1., 1., 1.));
	}
	toAffine(){
		return mat4.fromTRS(this.position, this.orientation, new vec3(1., 1., 1.));
	}
}

class Derivative{
	force;
	torque;
	constructor(force, torque){
		this.force = force;
		this.torque = torque;
	}
}

//SemiImplicitEuler
// v_n+1 = v_n + a_n * dt
// x_n+1 = x_n + v_n+1 * dt
function integrateSemiImplicit(inOutState, derivative, dt){
	let rotationMatrix = inOutState.orientation.toMat3();
	let invInertia = rotationMatrix.mult(inOutState.invInertia).mult(rotationMatrix.transpose());
	let inertia = rotationMatrix.mult(inOutState.inertia).mult(rotationMatrix.transpose());
	let acceleration = derivative.force.scale(1.0 / inOutState.mass);
	//acceleration in local coordinates
	//let angularAcceleration = invInertia.transform(derivative.torque.sub(vec3.cross(inOutState.angularVelocity, inertia.transform(inOutState.angularVelocity))));
	let angularAcceleration = invInertia.transform(derivative.torque);

	//damping for rotation
	//angularAcceleration.addSelf(inOutState.angularVelocity.mult(inOutState.angularVelocity).scale(-0.0*dt));

	let velocity = inOutState.velocity.add(acceleration.scale(dt));
	let angularVelocity = inOutState.angularVelocity.add(angularAcceleration.scale(dt));
	

	let position = inOutState.position.add(inOutState.velocity.scale(dt));
	let orientation = inOutState.orientation.mult(quat.fromEulerAngles(angularVelocity.x * dt, angularVelocity.y * dt, angularVelocity.z * dt));
	//orientation = quat.fromEulerAngles(angularVelocity.x * dt, angularVelocity.y * dt, angularVelocity.z * dt).mult(inOutState.orientation);
	
	let omega = quat.fromEulerAngles(angularVelocity.x, angularVelocity.y, angularVelocity.z).toAxisAngle();
	//orientation = (new quat(omega.axis.scale(Math.sin(0.5 * omega.angle * dt)), Math.cos(0.5 * dt * omega.angle))).mult(inOutState.orientation);
	//orientation = inOutState.orientation.mult(new quat(angularVelocity.scale(0.5 * dt), 0));
	//orientation = (new quat(angRot.v.normalized().scale(Math.sin(0.5 * dt  * angRot.v.l2norm()) * Math.exp(angRot.s)), Math.cos(0.5 * dt * angRot.v.l2norm()) * Math.exp(angRot.s))).mult(inOutState.orientation);
	
	let angRot = new quat(angularVelocity.clone(), 0.0);
	let axis = new vec3(1, 0, 0);
	if(angRot.v.l2norm() < 0.0001)
		axis = new vec3(1, 0, 0);
	else
		axis = angRot.v.normalized();
	orientation = (new quat(axis.scale(Math.sin(0.5 * dt * angRot.v.l2norm())), Math.cos(0.5 * dt * angRot.v.l2norm()))).mult(inOutState.orientation);
	//orietnation = (new quat(angularVelocity, 0.0)).scale(0.5 * dt).add(inOutState.orientation);

	inOutState.position = position;
	inOutState.velocity = velocity;
	inOutState.orientation = orientation.normalize();
	inOutState.angularVelocity = angularVelocity;
}