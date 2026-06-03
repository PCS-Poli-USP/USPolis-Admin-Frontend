import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

import {
  AddIcon,
  CloseIcon,
  MinusIcon,
} from '@chakra-ui/icons';

import {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  subjects: {
    subject_code: string;
    subject_name: string;
    period: number;
  }[];

  onClose: () => void;
}

function MissingSubjectsFloatingWindow({
  subjects,
  onClose,
}: Props) {
  const [minimized, setMinimized] =
    useState(false);

  const windowRef =
    useRef<HTMLDivElement>(null);

  const position = useRef({
    x: window.innerWidth - 620,
    y: 120,
  });

  const dragging = useRef(false);

  const offset = useRef({
    x: 0,
    y: 0,
  });

  const headerBg = useColorModeValue(
    'orange.100',
    'orange.900',
  );

  const borderColor = useColorModeValue(
    'orange.300',
    'orange.700',
  );

  function updateTransform() {
    if (!windowRef.current) return;

    windowRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
  }

  function handleMouseDown(
    e: React.MouseEvent<HTMLDivElement>,
  ) {
    dragging.current = true;

    offset.current = {
      x:
        e.clientX -
        position.current.x,

      y:
        e.clientY -
        position.current.y,
    };
  }

  useEffect(() => {
    updateTransform();

    function handleMouseMove(
      e: MouseEvent,
    ) {
      if (!dragging.current)
        return;

      position.current = {
        x: Math.max(
          0,
          Math.min(
            window.innerWidth -
              300,
            e.clientX -
              offset.current.x,
          ),
        ),

        y: Math.max(
          0,
          Math.min(
            window.innerHeight -
              100,
            e.clientY -
              offset.current.y,
          ),
        ),
      };

      requestAnimationFrame(
        updateTransform,
      );
    }

    function handleMouseUp() {
      dragging.current = false;
    }

    window.addEventListener(
      'mousemove',
      handleMouseMove,
    );

    window.addEventListener(
      'mouseup',
      handleMouseUp,
    );

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove,
      );

      window.removeEventListener(
        'mouseup',
        handleMouseUp,
      );
    };
  }, []);

  return (
    <Box
      ref={windowRef}
      position='fixed'
      top='0'
      left='0'
      w='550px'
      h='auto'
      //bg={bg}
      borderColor={borderColor}
      bg="uspolis.white"
      color="uspolis.black"
      borderRadius='lg'
      boxShadow='2xl'
      border='1px solid'  
      overflow='hidden'
      zIndex={9999}
      transition='height 0.2s'
      willChange='transform'
      maxW='90vw'
      maxH='90vh'
    >
      <Flex
        bg={headerBg}
        p={3}
        align='center'
        cursor='move'
        onMouseDown={
          handleMouseDown
        }
        userSelect='none'
      >
        <Text
          fontWeight='bold'
          flex={1}
        >
           ⚠️ Disciplinas não encontradas
        </Text>

        <IconButton
          aria-label='minimizar'
          icon={
            minimized
              ? <AddIcon />
              : <MinusIcon />
          }
          size='sm'
          mr={2}
          onClick={() =>
            setMinimized(
              !minimized,
            )
          }
        />

        <IconButton
          aria-label='fechar'
          icon={<CloseIcon />}
          size='sm'
          onClick={onClose}
        />
      </Flex>

      {!minimized && (
        <Box
          p={4}
          overflowY='auto'
          maxH='calc(70vh - 60px)'
        >
          <VStack
            align='start'
            spacing={2}
          >
            {subjects.map(
              (s, idx) => (
                <Text
                  key={`${s.subject_code}-${idx}`}
                  fontSize='sm'
                >
                  <b>
                    {
                      s.subject_code
                    }
                  </b>{' '}
                  -{' '}
                  {
                    s.subject_name
                  }{' '}
                  (
                  {s.period}
                  ° período)
                </Text>
              ),
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
}

export default memo(
  MissingSubjectsFloatingWindow,
);