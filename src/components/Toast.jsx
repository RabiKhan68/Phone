import { motion, AnimatePresence } from "framer-motion";
import "./Toast.css";

export default function Toast({ message, type, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`toast ${type}`}
          initial={{ opacity: 0, y: -30, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}