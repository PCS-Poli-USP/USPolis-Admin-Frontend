import { Flex, FormLabel } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { TextareaInput } from '../../form/TextareaInput';
import { BugReportContentProps } from './bug.report.interface';
import { RadioButton } from '../../form/RadioButton';
import { BugPriority, BugType } from '../../../../utils/enums/bugReport.enum';
import { ImageDropzone } from '../../form/ImageDropzone';
import { useEffect } from 'react';

function BugReportContent(props: BugReportContentProps) {
  const description = props.form.watch('description');

  useEffect(() => {
    if (description) props.form.clearErrors('description');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  return (
    <Flex direction={'column'} h={'fit-content'}>
      <FormProvider {...props.form}>
        <form>
          <Flex mb={'15px'} direction={'column'} gap={'0px'}>
            <FormLabel alignSelf='flex-start'>Tipo de problema: </FormLabel>
            <RadioButton
              name='type'
              options={BugType.values().map((val) => ({
                label: BugType.translate(val),
                value: val,
              }))}
              onChange={(value) => {
                props.form.setValue('type', value as BugType);
                props.form.clearErrors('type');
              }}
              isInvalid={!!props.form.formState.errors['type']}
              wrap={true}
            />
          </Flex>

          <TextareaInput
            name='description'
            label='Descrição do problema'
            maxSize={2000}
            height={'250px'}
            mb={'20px'}
          />

          <Flex mb={'15px'} direction={'column'} gap={'0px'}>
            <FormLabel alignSelf='flex-start'>Prioridade: </FormLabel>
            <RadioButton
              name='priority'
              options={BugPriority.values().map((val) => ({
                label: BugPriority.translate(val),
                value: val,
              }))}
              colors={BugPriority.values().map((val) =>
                BugPriority.getColor(val),
              )}
              onChange={(value) => {
                props.form.setValue('priority', value as BugPriority);
                props.form.clearErrors('priority');
              }}
              isInvalid={!!props.form.formState.errors['priority']}
              wrap={true}
            />
          </Flex>
          <Flex mb={'15px'} direction={'column'} gap={'0px'}>
            <FormLabel alignSelf='flex-start'>
              Evidências (máximo de 3 imagens):{' '}
            </FormLabel>
            <ImageDropzone onDrop={(files) => props.setFiles(files)} />
          </Flex>
        </form>
      </FormProvider>
    </Flex>
  );
}

export default BugReportContent;
