// Camera.js

class Camera {
    constructor(canvas) {
        this.fov = 60;
        this.eye = new Vector3([0, 0, 0]);
        this.at = new Vector3([0, 0, -1]);
        this.up = new Vector3([0, 1, 0]);
        this.viewMatrix = new Matrix4().setLookAt(
                this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
                this.at.elements[0], this.at.elements[1], this.at.elements[2],
                this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
        this.projectionMatrix = new Matrix4().setPerspective(
            this.fov, 
            canvas.width / canvas.height, 
            0.1, 
            1000
        );
        this.panAngle = 5;
    }

    update() {
        this.viewMatrix = new Matrix4().setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );

    }

    moveForward() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(0.1);
        this.eye.add(f);
        this.at.add(f);
        this.update();
    }

    moveBackwards() {
        let b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        b.mul(0.1);
        this.eye.add(b);
        this.at.add(b);
        this.update();
    }

    moveLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(0.1);
        this.eye.add(s);
        this.at.add(s);
        this.update();
    }
    moveRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(0.1);
        this.eye.add(s);
        this.at.add(s);
        this.update();
    }

    panLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4().setRotate(this.panAngle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        console.log(rotationMatrix);
        let f_prime = rotationMatrix.multiplyVector3(f);
        console.log(f_prime);
        this.at = this.eye.add(f_prime);
        console.log(this.at);
        this.update();
    }

    panRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4().setRotate(-this.panAngle, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        
        let f_prime = rotationMatrix.multiplyVector3(f);
        
        this.at = this.eye.add(f_prime);
        this.update();
    }
    
}