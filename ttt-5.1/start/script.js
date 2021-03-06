const vshader = `
varying vec2 v_uv;
varying vec3 v_position;
void main() {	
  v_uv = uv;
  v_position = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fshader = `
uniform float u_time;
uniform float u_duration;

varying vec2 v_uv;
varying vec3 v_position;

void main (void)
{
  vec3 color = vec3(v_uv.x, v_uv.y, 1.0);
  gl_FragColor = vec4(color, 1.0); 
}
`






const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const clock = new THREE.Clock();

const geometry = new THREE.PlaneGeometry( 2, 1.5 );
const uniforms = {
  u_time: { value: 0.0 },
  u_mouse: { value:{ x:0.0, y:0.0 }},
  u_resolution: { value:{ x:0, y:0 }}
}

const material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vshader,
  fragmentShader: fshader
} );

const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

camera.position.z = 1;

onWindowResize();

window.addEventListener( 'resize', onWindowResize, false );

update();

function onWindowResize( event ) {
  const aspectRatio = window.innerWidth/window.innerHeight;
  let width, height;
  if (aspectRatio>=(2/1.5)){
    console.log("resize: Use width");
    width = 1;
    height = (window.innerHeight/window.innerWidth) * width;
  }else{
    console.log("resize: Use height")
    height = 1.5/2;
    width = (window.innerWidth/window.innerHeight) * height;
  }
  camera.left = -width;
  camera.right = width;
  camera.top = height;
  camera.bottom = -height;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  uniforms.u_resolution.value.x = window.innerWidth;
  uniforms.u_resolution.value.y = window.innerHeight;
}

function update() {
  requestAnimationFrame( update );
  uniforms.u_time.value += clock.getDelta();
  renderer.render( scene, camera );
}