import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Text
} from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  CurriculumSubjectModalProps,
  CurriculumSubjectForm,
} from './curriculumSubject.modal.interface';

import { defaultValues, schema } from './curriculumSubject.modal.form';

import useCurriculumSubjectsService from '../../../hooks/API/services/useCurriculumSubjectsService';
import useSubjectsService from '../../../hooks/API/services/useSubjectsService';
import { CurriculumSubjectType } from '../../../utils/enums/curriculumSubjectType.enum';
import { useParams } from 'react-router-dom';

import TooltipSelect, {
  Option,
} from '../../../components/common/TooltipSelect';

export default function CurriculumSubjectModal(
  props: CurriculumSubjectModalProps,
) {
  const form = useForm<CurriculumSubjectForm>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors, setValue } = form;

  const { create, update } = useCurriculumSubjectsService();
  const { get: getSubjects } = useSubjectsService();
  const { curriculumId } = useParams();
  const toast = useToast();

  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Option[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  async function fetchOptions() {
    try {
      setLoadingSubjects(true);
      const subjectsRes = await getSubjects();

      setSubjectOptions(
        subjectsRes.data.map((s: any) => ({
          label: `${s.code} - ${s.name}`,
          value: s.id,
        })),
      );
    } catch {
      console.error('Erro ao carregar disciplinas');
    } finally {
      setLoadingSubjects(false);
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    if (props.selectedItem) {
      const subject = subjectOptions.find(
        (s) => s.value === props.selectedItem?.subject_id,
      );

      setSelectedSubjects(subject ? [subject] : []);

      reset({
        subject_ids: props.selectedItem?.subject_id
          ? [props.selectedItem.subject_id]
          : [],
        type: props.selectedItem.type,
        category: props.selectedItem.category,
      });
    } else {
      setSelectedSubjects([]);
      reset(defaultValues);
    }
  }, [props.selectedItem, reset, subjectOptions]);

  async function handleSave() {
    const isValid = await trigger();
    if (!isValid) return;

    const values = getValues();

    if (props.isUpdate && props.selectedItem) {
      const payload = {
        subject_id: values.subject_ids[0],
        type: values.type,
        category: values.category,
        period: props.selectedItem.period,
        curriculum_id: Number(curriculumId),
      };

      try {
        await update(props.selectedItem.id, payload);

        toast({
          title: "Atualizado com sucesso",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-left",
        });
        console.log("VALUES", values);
        props.refetch();
        handleClose();
      } catch (err: any) {
        const message =
          err?.response?.data?.detail || "Não foi possível atualizar a disciplina.";

        toast({
          title: "Erro ao atualizar",
          description: message,
          status: "warning",
          duration: 6000,
          isClosable: true,
          position: "top-left",
        });
      }

      return;
    }

    const payloads = values.subject_ids.map((subjectId) => ({
      subject_id: subjectId,
      type: values.type,
      category: values.category,
      period: props.defaultPeriod!,
      curriculum_id: Number(curriculumId),
    }));

    const results = await Promise.allSettled(
      payloads.map((payload) => create(payload))
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;

    const failed = results.filter(
      (r): r is PromiseRejectedResult => r.status === "rejected"
    );

    const errorMessages = failed
      .map((r: any) => r.reason?.response?.data?.detail)
      .filter(Boolean)
      .map((msg: any) => (typeof msg === "string" ? msg : JSON.stringify(msg)));

    if (successCount > 0) {
      toast({
        title: "Cadastro realizado",
        description: `${successCount} disciplina(s) cadastrada(s) com sucesso.`,
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }

    if (errorMessages.length > 0) {
      toast({
        title: "Algumas disciplinas não foram cadastradas",
        description: errorMessages.join("\n"),
        status: "warning",
        duration: 6000,
        isClosable: true,
        position: "top-left",
      });
    }

    props.refetch();
    handleClose();
  }

  function handleClose() {
    reset(defaultValues);
    setSelectedSubjects([]);
    clearErrors();
    props.onClose();
  }

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate
            ? 'Editar Disciplina do Currículo'
            : `Cadastrar Disciplinas no ${props.defaultPeriod}° período`}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <FormProvider {...form}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!form.formState.errors.subject_ids}>
                <FormLabel>Disciplinas</FormLabel>

                <TooltipSelect
                  placeholder="Selecione as disciplinas"
                  isMulti={!props.isUpdate}
                  isLoading={loadingSubjects}
                  closeMenuOnSelect={false}
                  value={selectedSubjects}
                  options={subjectOptions}
                  onChange={(selected) => {
                    if (!selected) {
                      setSelectedSubjects([]);
                      setValue("subject_ids", []);
                      return;
                    }

                    if (props.isUpdate) {
                      const single = selected as Option;
                      setSelectedSubjects([single]);
                      setValue("subject_ids", [single.value as number]);
                    } else {
                      const multi = selected as Option[];
                      setSelectedSubjects(multi);
                      setValue(
                        "subject_ids",
                        multi.map((s) => s.value as number)
                      );
                    }
                  }}
                />
                <Text fontSize="sm" color="red.500">
                  {form.formState.errors.subject_ids?.message}
                </Text>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.type}>
                <FormLabel>Tipo</FormLabel>

                <RadioGroup
                  value={form.watch("type")}
                  onChange={(value) =>
                    form.setValue("type", value as CurriculumSubjectType)
                  }
                >
                  <Stack direction="column">
                    <Radio value={CurriculumSubjectType.SEMESTRAL}>
                      Semestral
                    </Radio>

                    <Radio value={CurriculumSubjectType.QUADRIMESTER}>
                      Quadrimestral
                    </Radio>
                  </Stack>
                </RadioGroup>

                <Text fontSize="sm" color="red.500">
                  {form.formState.errors.type?.message}
                </Text>
              </FormControl>

              <FormControl isInvalid={!!form.formState.errors.category}>
                <FormLabel>Categoria</FormLabel>

                <RadioGroup
                  value={form.watch("category")}
                  onChange={(value) =>
                    form.setValue("category", value as any)
                  }
                >
                  <Stack direction="column">
                    <Radio value="mandatory">Obrigatória</Radio>
                    <Radio value="free_elective">Optativa Livre</Radio>
                    <Radio value="track_elective">Optativa Eletiva</Radio>
                  </Stack>
                </RadioGroup>

                <Text fontSize="sm" color="red.500">
                  {form.formState.errors.category?.message}
                </Text>
              </FormControl>
            </Stack>
          </FormProvider>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} colorScheme="red" onClick={handleClose}>
            Cancelar
          </Button>

          <Button colorScheme="blue" onClick={handleSave}>
            {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}