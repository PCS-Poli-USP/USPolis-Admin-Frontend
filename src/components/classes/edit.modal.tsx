import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  Text,
} from '@chakra-ui/react';
import Class, { EditClassEvents } from 'models/class.model';
import { WeekDays } from 'models/enums/weekDays.enum';
import { useEffect, useState } from 'react';
import { Capitalize } from 'utils/formatters';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: Class;
  onSave: (data: EditClassEvents[]) => void;
}

export default function EditModal({ isOpen, onClose, formData, onSave }: EditModalProps) {
  const weekDaysOptions = Object.values(WeekDays);

  const [form, setForm] = useState<EditClassEvents[]>([]);

  useEffect(() => {
    if (formData) {
      setForm(
        formData.week_days.map((weekDay, index) => ({
          week_day_id: weekDay,
          professor: formData.professors[index] ?? '',
          week_day: weekDay,
          start_time: formData.start_time[index],
          end_time: formData.end_time[index],
          subscribers: formData.subscribers,
        })),
      );
    }
  }, [formData]);

  function handleSaveClick() {
    onSave(form);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {formData?.subject_code} - {formData?.class_code}
          <Text fontSize='md' fontWeight='normal'>
            {formData?.subject_name}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Quantidade de alunos</FormLabel>
            <NumberInput
              placeholder='Alunos'
              value={form[0]?.subscribers}
              onChange={(_, value) => {
                console.log(value);
                setForm((prev) => prev.map((it) => ({ ...it, subscribers: isNaN(value) ? 0 : value })));
              }}
              min={0}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <Accordion allowMultiple defaultIndex={[0]}>
            {formData?.week_days?.map((it, index) => (
              <AccordionItem key={index}>
                <AccordionButton bg='uspolis.blue' _hover={{ bg: 'uspolis.blue' }} color='white'>
                  <Box flex='1' textAlign='left'>
                    {Capitalize(it)} - {form[index]?.start_time} - {form[index]?.end_time}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <FormControl>
                    <FormLabel>Professor</FormLabel>
                    <Input
                      value={form[index]?.professor ?? ''}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev.map((it, idx) => (index === idx ? { ...it, professor: event.target.value } : it)),
                        )
                      }
                    />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Dia</FormLabel>
                    <Select
                      value={form[index]?.week_day ?? ''}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev.map((it, idx) => (index === idx ? { ...it, week_day: event.target.value } : it)),
                        )
                      }
                    >
                      {weekDaysOptions.map((it) => (
                        <option key={it} value={it}>
                          {it}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl mt={4} display='flex' alignItems='center'>
                    <FormLabel>Início</FormLabel>
                    <Input
                      type='time'
                      value={form[index]?.start_time ?? ''}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev.map((it, idx) => (index === idx ? { ...it, start_time: event.target.value } : it)),
                        )
                      }
                    />
                    <FormLabel ml={4}>Fim</FormLabel>
                    <Input
                      type='time'
                      value={form[index]?.end_time ?? ''}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev.map((it, idx) => (index === idx ? { ...it, end_time: event.target.value } : it)),
                        )
                      }
                    />
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            Salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
