import { motion } from 'framer-motion';
import { TbHandClick } from 'react-icons/tb';

export default function FingerClick() {
  return (
    <motion.div
      animate={{
        scale: [1, 0.9, 1],
        y: [0, 2, 0],
      }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <TbHandClick size={40} />
    </motion.div>
  );
}
