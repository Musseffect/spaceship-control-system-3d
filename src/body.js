class Body{
	state;
	forces;
	transform;
	inverseTransform;
	constructor(){
		this.state = new State();
		this.forces = [];
		this.updateTransforms();
	}
	resetForces(){
		this.forces = [];
	}
	updateTransforms(){
		this.transform = this.state.toTransform();
		this.inverseTransform = this.transform.inverse();
	}
	pointToGlobal(position){
		return this.state.toTransform().transformPoint(position);
	}
	pointToLocal(position){
		return this.state.toTransform().inverse().transformPoint(position);
	}
	vectorToGlobal(vector){
		return this.state.toTransform().transformVector(vector);
	}
	vectorToLocal(vector){
		return this.state.toTransform().inverse().transformVector(vector);
	}
	addForce(force, localPosition){
		this.forces.push({force:force, position:localPosition});
	}
	integrate(dt){
		let totalForce = new vec3(0., 0., 0.);
		let totalTorque = new vec3(0., 0., 0.);
		this.forces.forEach(function(item){
			totalForce.addSelf(item.force);
			totalTorque.addSelf(vec3.cross(item.force, item.position));
		});
		let localToWorld = this.state.toTransform();
		//transform force and torque from local coordinates to global
		integrateSemiImplicit(this.state, new Derivative(localToWorld.transformVector(totalForce), localToWorld.transformVector(totalTorque)), dt);
	}
}