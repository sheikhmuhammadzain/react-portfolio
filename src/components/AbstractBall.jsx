import * as THREE from "three";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { NOISE_VERTEX_SHADER, FRAGMENT_SHADER } from "./abstractBallShaders";

const BASE_MORPH = 4; // gentle idle wobble
const LEVEL_MORPH = 22; // extra deformation at full loudness

// Morphing perlin-noise ball shown during a live call. `getLevel` returns the
// current voice loudness (0..1, yours or the agent's) and drives the morphing.
const AbstractBall = ({ getLevel }) => {
  const mountRef = useRef(null);
  const getLevelRef = useRef(getLevel);
  getLevelRef.current = getLevel;

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, mount.clientWidth / mount.clientHeight, 1, 1000);
    camera.position.set(0, 10, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const uniforms = {
      time: { value: 0 },
      // Low, close-together channel frequencies give a smooth cohesive blend
      // (the original Skiper values) instead of a clashing rainbow.
      RGBr: { value: 0.75 },
      RGBg: { value: 0.5 },
      RGBb: { value: 0.7 },
      RGBn: { value: 0.01 },
      RGBm: { value: 1 },
      morph: { value: BASE_MORPH },
      dnoise: { value: 0 },
      psize: { value: 1 },
    };

    // ponytail: detail 12 keeps weak GPUs at 60fps; bump to 20 for denser morphing
    const geometry = new THREE.IcosahedronGeometry(20, 12);
    const material = new THREE.ShaderMaterial({
      uniforms,
      side: THREE.DoubleSide,
      vertexShader: NOISE_VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let raf;
    let smoothed = 0;
    const animate = () => {
      const level = getLevelRef.current ? getLevelRef.current() : 0;
      smoothed += (level - smoothed) * 0.15; // ease so speech doesn't jitter the ball
      uniforms.time.value += 0.0025 + smoothed * 0.008;
      uniforms.morph.value = BASE_MORPH + smoothed * LEVEL_MORPH;
      mesh.rotation.y += 0.002 + smoothed * 0.01;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
};

AbstractBall.propTypes = {
  getLevel: PropTypes.func,
};

export default AbstractBall;
