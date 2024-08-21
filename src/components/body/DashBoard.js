import { motion } from "framer-motion";

import KanbanBoard from "./KanbanBoard";

const Dashboard = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 1.25,
        ease: "easeInOut",
      }}
      className="flex flex-col items-center justify-center h-screen w-screen "
    >
      <div className="w-[80%] h-[60%]">
        <KanbanBoard />
      </div>
    </motion.div>
  );
};

export default Dashboard;
