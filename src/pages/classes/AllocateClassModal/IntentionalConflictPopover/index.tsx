import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  Button,
  Alert,
  AlertIcon,
  Checkbox,
  PopoverFooter,
  Flex,
  Text,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { LuListChecks } from 'react-icons/lu';
import { FaQuestion } from 'react-icons/fa';
import {
  ClassroomWithConflictCount,
  ConflictsInfo,
} from '../../../../models/http/responses/classroom.response.models';
import { classNumberFromClassCode } from '../../../../utils/classes/classes.formatter';
import { useEffect, useRef, useState } from 'react';

interface IntentionalConflictPopoverProps {
  hidden: boolean;
  classroom?: ClassroomWithConflictCount;
  handleConfirm: (selectedMap: boolean[], infos: ConflictsInfo[]) => void;
  handleCancel: () => void;
}
function IntentionalConflictPopover({
  hidden,
  classroom,
  handleConfirm,
  handleCancel,
}: IntentionalConflictPopoverProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedMap, setSelectedMap] = useState<boolean[]>([]);

  function getConflictText(info: ConflictsInfo) {
    if (info.subject && info.class_code) {
      return `${info.subject} - T${classNumberFromClassCode(info.class_code)} (${info.total_count} conflitos)`;
    }
    if (info.reservation) {
      return `${info.reservation} (${info.total_count} conflitos)`;
    }
    return 'Conflito não encontrado';
  }

  useEffect(() => {
    if (classroom) {
      const newMap = new Array(classroom.conflicts_infos.length).fill(false);
      classroom.conflicts_infos.forEach((info, index) => {
        if (info.intentional_count > 0) {
          newMap[index] = true;
        }
      });
      setSelectedMap(newMap);
      handleConfirm(newMap, classroom.conflicts_infos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom]);

  const isHoveringButton = useRef(false);
  const isHoveringPopover = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openPopover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onOpen();
  };

  const closePopoverWithDelay = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isHoveringButton.current && !isHoveringPopover.current) {
        onClose();
      }
    }, 150);
  };

  return (
    <>
      <Popover
        placement='right-end'
        closeOnBlur={false}
        isOpen={isOpen}
        onClose={() => {
          setSelectedMap([]);
          onClose();
          handleCancel();
        }}
      >
        <PopoverTrigger>
          <Box
            onMouseEnter={() => {
              isHoveringButton.current = true;
              openPopover();
            }}
            onMouseLeave={() => {
              isHoveringButton.current = false;
              closePopoverWithDelay();
            }}
          >
            <Button
              leftIcon={<LuListChecks />}
              hidden={hidden}
              size={'sm'}
              variant={'outline'}
              borderColor={'uspolis.blue'}
              textColor={'uspolis.blue'}
              rightIcon={<FaQuestion size={'10px'} />}
            >
              Conflito intencional
            </Button>
          </Box>
        </PopoverTrigger>
        <PopoverContent
          onMouseEnter={() => {
            isHoveringPopover.current = true;
            openPopover();
          }}
          onMouseLeave={() => {
            isHoveringPopover.current = false;
            closePopoverWithDelay();
          }}
        >
          <PopoverHeader pt={4} fontWeight='bold' border='0'>
            Selecione os conflitos intencionais
          </PopoverHeader>
          <PopoverArrow bg='white' />
          <PopoverBody>
            {classroom ? (
              <>
                <Flex direction={'column'} gap={'10px'} mb={'10px'}>
                  {classroom.conflicts_infos.length > 0 ? (
                    <>
                      {classroom.conflicts_infos.map((conflict, index) => (
                        <div key={index}>
                          <Checkbox
                            isChecked={selectedMap[index]}
                            onChange={(e) => {
                              const newMap = [...selectedMap];
                              newMap[index] = e.target.checked;
                              setSelectedMap(newMap);
                              handleConfirm(newMap, classroom.conflicts_infos);
                            }}
                          >
                            {getConflictText(conflict)}
                          </Checkbox>
                        </div>
                      ))}
                    </>
                  ) : (
                    <Text>Nenhum conflito encontrado</Text>
                  )}
                </Flex>
              </>
            ) : (
              <Alert status='error'>
                <AlertIcon />
                Nenhuma sala selecionada
              </Alert>
            )}
          </PopoverBody>
          <PopoverFooter>
            <Flex gap={'10px'}>
              <Button
                size={'sm'}
                colorScheme='blue'
                onClick={() => {
                  const newMap = Array(selectedMap.length).fill(true);
                  setSelectedMap(newMap);
                  handleConfirm(
                    newMap,
                    classroom ? classroom.conflicts_infos : [],
                  );
                }}
              >
                Marcar tudo
              </Button>
              <Button
                size={'sm'}
                variant={'outline'}
                colorScheme='red'
                color={'red.500'}
                onClick={() => {
                  setSelectedMap(Array(selectedMap.length).fill(false));
                  handleCancel();
                }}
              >
                Desmarcar tudo
              </Button>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default IntentionalConflictPopover;
