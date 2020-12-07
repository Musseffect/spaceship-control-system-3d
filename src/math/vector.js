class vector{
	data;
	constructor(data){
		this.data = data;
    }
    copy(){
        return new vector(this.data.slice());
    }
	static empty(length){
		let data;
        (data = []).length = length; 
        data.fill(0);
        return new vector(data);
	}
    length(){
        return this.data.length;
    }
    static dot(a, b) {
        let result = 0;
        for(let i = 0;i<a.length();i++){
            result+=a.data[i]*b.data[i];
        }
        return result;
    }
    static empty(length){
        let data;
        (data = []).length = length; 
        data.fill(0);
        return new vector(data);
    }
    static add(a,b){
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] + b.data[i]);
        return new vector(result);
    }
    static sub(a,b){
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] - b.data[i]);
        return new vector(result);
    }
    static mult(a,b){
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] * b.data[i]);
        return new vector(result);
    }
    static scale(a,b){
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] * b);
        return new vector(result);
    }
    clone(){
        return new vector(this.data.slice());
    }
    addSelf(b){
        for(let i=0;i<this.data.length;i++)
            this.data[i]+=b.data[i];
        return this;
    }
    subSelf(b){
        for(let i=0;i<this.data.length;i++)
            this.data[i]-=b.data[i];
        return this;
    }
    scaleSelf(b){
        for(let i=0;i<this.data.length;i++)
            this.data[i]*=b;
        return this;
    }
    get(i){
        return this.data[i];
    }
    set(i, value){
        this.data[i] = value;
    }
    length(){
        return this.data.length;
    }
    getSubVector(offset,length){
        let resultData = new Array(length);
        for(let i=0;i<length;i++)
            resultData[i] = this.data[offset+i];
        return new vector(resultData);
    }
    addSubVector(b, offset){
        for(let i=0;i<b.length();i++)
            this.data[i+offset] += b.get(i);
        return this;
    }
    subSubVector(b, offset){
        for(let i=0;i<b.length();i++)
            this.data[i+offset] -= b.get(i);
        return this;
    }
    add(b, dest){
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] + b.data[i];
        return dest;
    }
    sub(b, dest){
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] - b.data[i];
        return dest;
    }
    mult(b, dest){
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] * b.data[i];
        return dest;
    }
    scale(b, dest){
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] * b;
        return dest;
    }
    l1Norm(){
        let result = 0;
        for(let i=0;i<this.data.length;i++)
            result += Math.abs(this.data[i]);
        return result;
    }
    l2Norm(){
        let result = 0;
        for(let i=0;i<this.data.length;i++)
            result += this.data[i]*this.data[i];
        return Math.sqrt(result);
    }
    lInfNorm(){
        let result = 0;
        for(let i=0;i<this.data.length;i++)
            result = Math.max(Math.abs(this.data[i]));
        return result;
    }
    norm2(){
        let result = 0;
        for(let i=0;i<this.data.length;i++)
            result += this.data[i]*this.data[i];
        return Math.sqrt(result);
    }
    clamp(min,max){
        for(let i = 0;i<this.data.length;i++){
            this.data[i] = clamp(this.data[i],min.data[i],max.data[i]);
        }
    }
    print(fractionDigits){
        if(!fractionDigits)
            fractionDigits = 4;
        let result = "[ ";
        this.data.forEach((item,index)=>result+=item.toFixed(fractionDigits) +" ");
        return result + "]";
    }
}