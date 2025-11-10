import { Flex } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';
import { FeedbackContentProps } from './feedback.interface';
import { Input } from '../../form/Input';
import { TextareaInput } from '../../form/TextareaInput';
import { useEffect } from 'react';

function FeedbackContent(props: FeedbackContentProps) {
  const title = props.form.watch('title');
  const message = props.form.watch('message');

  useEffect(() => {
    if (title) {
      props.form.clearErrors('title');
    }
    if (message) {
      props.form.clearErrors('message');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, message]);

  return (
    <Flex direction={'column'} h={'400px'}>
      <FormProvider {...props.form}>
        <form>
          <Input name='title' label='Título' mb={'10px'} />
          <TextareaInput
            name='message'
            label='Mensagem'
            maxSize={2000}
            height={'250px'}
            placeholder='Alguma sugestão de melhoria ou funcionalidade? Algum comentário? Nos envie!'
          />
        </form>
      </FormProvider>
    </Flex>
  );
}

export default FeedbackContent;
