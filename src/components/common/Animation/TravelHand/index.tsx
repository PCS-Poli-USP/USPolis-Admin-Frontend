import { Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { GiClick } from 'react-icons/gi';

interface TravelHandProps {
  max?: number;
  min?: number;
  duration?: number;
}

export default function TravelHand({
  max = 100,
  min = -100,
  duration = 2,
}: TravelHandProps) {
  return (
    <motion.div
      animate={{
        x: [min, max, min], // Define os pontos-chave da animação
      }}
      transition={{
        duration, // Tempo total do ciclo
        repeat: Infinity, // Repete infinitamente
        ease: 'easeInOut', // Suaviza as transições
      }}
    >
      <Icon boxSize={'20px'} as={GiClick} />
    </motion.div>
  );
}
