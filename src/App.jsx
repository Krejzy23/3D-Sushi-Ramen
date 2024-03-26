import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Home } from "./components/Home"
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { UI } from "./components/UI"
import Loader from "./components/Loader";



function App() {

  return (
    <>
      <Canvas shadows camera={{ position: [2, 3, 8], fov: 42}}>
        <Suspense fallback={<Loader />}>
          <Home />
        </Suspense>
        <EffectComposer>
          <Bloom 
            mipmapBlur
            intensity={0.8}
          />
        </EffectComposer>
      </Canvas>
      <UI />
    </>
  )
}

export default App
