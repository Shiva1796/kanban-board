import React, { useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Cloud, Stars, Clouds } from "@react-three/drei";
import { FiArrowRight } from "react-icons/fi";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import { Link } from "react-router-dom";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const HeroSection = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      initial={{
        y: 25,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      style={{
        backgroundImage,
      }}
      className="h-screen w-screen relative place-content-center bg-gray-950 px-4 py-24 text-gray-200 "
    >
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="max-w-[60%] min-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight font-Josefin">
          <motion.span
            animate={{
              textShadow: [
                "0px 0px 5px rgba(255, 255, 255, 0.2)",
                "0px 0px 20px rgba(255, 255, 255, 0.5)",
                "0px 0px 5px rgba(255, 255, 255, 0.2)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Organize
          </motion.span>{" "}
          Your Workflow
          <br />
          <motion.span
            animate={{
              textShadow: [
                "0px 0px 5px rgba(255, 255, 255, 0.2)",
                "0px 0px 20px rgba(255, 255, 255, 0.5)",
                "0px 0px 5px rgba(255, 255, 255, 0.2)",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Achieve More
          </motion.span>
        </h1>

        <p className="my-6 max-w-xl text-center font-Josefin text-base leading-relaxed md:text-2xl md:leading-relaxed">
          Take control of your projects and tasks with our intuitive Kanban app.
        </p>
        <motion.button
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.985,
          }}
          className="group text-xl border-2 relative font-Josefin flex bg-primary-content bg-opacity-50 w-fit items-center gap-1.5 rounded-xl bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors  hover:bg-primary-content duration-300"
        >
          <Link to="/login">Sign Up</Link>

          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={10} count={500} factor={4} fade speed={2} />
          <Stars radius={100} count={1500} factor={4} fade speed={4} />

          <Clouds material={THREE.MeshBasicMaterial}>
            <Cloud segments={10} volume={5} color={"#b68bff"} opacity={0.25} />
            <Cloud
              seed={0.1}
              scale={0.5}
              volume={3}
              color={"#b68bff"}
              fade={100}
              opacity={0.25}
            />
          </Clouds>
        </Canvas>
      </div>
    </motion.section>
  );
};

export default HeroSection;
