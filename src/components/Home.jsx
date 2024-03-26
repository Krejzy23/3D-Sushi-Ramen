import React, { useRef,useEffect } from 'react'
import { CameraControls, Environment, Text, MeshReflectorMaterial, RenderTexture, Float, useFont } from "@react-three/drei"
import { Color } from "three";
import { useAtom } from "jotai";
import { Shop } from './Shop';
import { currentPageAtom } from "./UI";
import { degToRad, lerp } from "three/src/math/MathUtils";
import { useFrame } from "@react-three/fiber";

const bloomColor = new Color("#fff");
bloomColor.multiplyScalar(1.5);

export const Home = () => {
  const controls = useRef();
  const meshFitCameraHome = useRef();
  const meshFitCameraStore = useRef();
  const textMaterial = useRef();
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);// jeste doresit

  useFrame((_, delta) => {
    textMaterial.current.opacity = lerp(
      textMaterial.current.opacity,
      currentPage === "home" || currentPage === "intro" ? 1 : 0,
      delta * 1.5
    );
  });


  const intro = async () => {
    controls.current.dolly(-182);
    controls.current.smoothTime = 1.6;
    setTimeout(() => {
      setCurrentPage("home");
    }, 1200);
    fitCamera();
  };

  const fitCamera = async () => {
    if (currentPage === "store") {
      controls.current.smoothTime = 0.8;
      controls.current.fitToBox(meshFitCameraStore.current, true);
    } else {
      controls.current.smoothTime = 1.6;
      controls.current.fitToBox(meshFitCameraHome.current, true);
    }
  };
  
  useEffect(() => {
    intro();
  }, []);
  
  useEffect(() => {
    fitCamera();
    window.addEventListener("resize", fitCamera);
    return () => window.removeEventListener("resize", fitCamera);
  }, [currentPage]);
  
  return (
    <>
      <CameraControls ref={controls}/>
      <mesh 
        ref={meshFitCameraHome} 
        position-z={5} 
        position-x={1}
        position-y={5}
        visible={false}
      >
        <boxGeometry args={[40, 5, 7]} />
        <meshBasicMaterial color="orange" transparent opacity={0.5} />
      </mesh>
      <Text 
        font={"fonts/Poppins-Black.ttf"}
        fontSize={4.5}
        position-x={-10}
        position-y={1.5}
        position-z={5}
        lineHeight={0.8}
        textAlign="center"
        rotation-y={degToRad(20)}
        anchorY={"bottom"}
      >
        RAMEN{"\n"}& SUSHI
        <meshBasicMaterial 
          color={bloomColor}
          ref={textMaterial}
          toneMapped={false}
        >
          <RenderTexture attach={"map"}>
            <color attach="background" args={["#fff"]} />
            <Environment preset="sunset"/>
            <Float floatIntensity={4} rotationIntensity={5}>
              <Shop 
                scale={1.6}
                rotation-y={-degToRad(25)}
                rotation-x={degToRad(40)}
                position-y={3}
              />
            </Float>
          </RenderTexture>
        </meshBasicMaterial>
      </Text>
      <group rotation-y={degToRad(30)} position-x={1}>
        <Shop scale={0.8} html/>
        <mesh 
          ref={meshFitCameraStore} 
          position-x={1}
          position-y={6}
          position-z={5}
          visible={false}
        >
          <boxGeometry args={[5, 5, 10]} />
          <meshBasicMaterial color="red" transparent opacity={0.5} />
        </mesh>
      </group>
      <mesh position-y={1.5} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
        />
      </mesh>
      <Environment preset='sunset'/>
    </>
  )
}

useFont.preload("fonts/Poppins-Black.ttf");