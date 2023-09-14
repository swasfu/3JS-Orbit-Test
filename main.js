import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0x888888);
scene.add(ambient);

const light = new THREE.PointLight(0xd5deff, 100);
light.castShadow = true;
light.position.x = 5;

light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 50;

scene.add(light);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.y = 0.5;
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(0.3, 64, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

const sphereOrbitHeight = 3;
const sphereOrbitSpeed = 0.01;
sphere.position.add(cube.position);
sphere.position.add(new THREE.Vector3(0, 0, sphereOrbitHeight));

const octGeometry = new THREE.OctahedronGeometry(0.1);
const octMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const oct = new THREE.Mesh(octGeometry, octMaterial);
oct.castShadow = true;
oct.receiveShadow = true;
scene.add(oct);

const octOrbitHeight = 1.0;
const octOrbitSpeed = 0.05;
oct.position.add(sphere.position);
oct.position.add(new THREE.Vector3(0, 0, octOrbitHeight));

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = 0.9 * Math.PI / 2;

function animate() {
    requestAnimationFrame(animate);

    const sphereDistance = new THREE.Vector3().subVectors(sphere.position, cube.position);
    const sphereMovement = new THREE.Vector3().crossVectors(sphereDistance, new THREE.Vector3(0, 1, 0));
    sphereMovement.setLength(sphereOrbitSpeed);
    sphereDistance.add(sphereMovement);
    sphereDistance.setLength(sphereOrbitHeight);
    sphere.position.addVectors(cube.position, sphereDistance);

    const octDistance = new THREE.Vector3().subVectors(oct.position, sphere.position);
    const octMovement = new THREE.Vector3().crossVectors(octDistance, new THREE.Vector3(0, 1, 0));
    octMovement.setLength(octOrbitSpeed);
    octDistance.add(octMovement);
    octDistance.setLength(octOrbitHeight);
    oct.position.addVectors(sphere.position, octDistance);

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.005;

    oct.rotation.x += 0.005;
    oct.rotation.y += 0.005;
    oct.rotation.z += 0.005;

    renderer.render(scene, camera);
}


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

animate();