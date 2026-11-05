import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Code,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { prefixError } from '../../../utils/apiKeys/apiKeys.validator';
import { SUGGESTED_PREFIXES } from '../../../utils/apiKeys/apiKeys.formatter';

const MONO = 'mono';

function PrefixesField() {
  const {
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useFormContext<{ prefixes: string[] }>();
  const prefixes = watch('prefixes') ?? [];
  const [newPrefix, setNewPrefix] = useState('');
  const [inputError, setInputError] = useState('');
  const fieldError = errors.prefixes?.message;

  function setPrefixes(value: string[]) {
    setValue('prefixes', value, {
      shouldDirty: true,
      shouldValidate: isSubmitted,
    });
  }

  function addPrefix(prefix: string) {
    const error = prefixError(prefix);
    if (error) return setInputError(error);
    if (prefixes.includes(prefix))
      return setInputError('Este prefixo já foi adicionado.');
    setPrefixes([...prefixes, prefix]);
    if (prefix === newPrefix.trim()) setNewPrefix('');
    setInputError('');
  }

  const suggestions = [...SUGGESTED_PREFIXES, '/'].filter(
    (p) => !prefixes.includes(p),
  );

  return (
    <FormControl isRequired isInvalid={!!(inputError || fieldError)}>
      <FormLabel mb={1}>Prefixos de rotas permitidas</FormLabel>
      <Text fontSize='sm' color='uspolis.textMuted' mb={3}>
        Rotas públicas que esta chave pode acessar. Pelo menos uma.
      </Text>
      <Flex wrap='wrap' gap={2} mb={3}>
        {prefixes.map((p) => (
          <Tag
            key={p}
            variant='solid'
            colorScheme='blue'
            fontFamily={MONO}
            size='md'
          >
            <TagLabel>{p === '/' ? '/ (todas)' : p}</TagLabel>
            <TagCloseButton
              aria-label='remover'
              onClick={() => setPrefixes(prefixes.filter((x) => x !== p))}
            />
          </Tag>
        ))}
        {prefixes.length === 0 && (
          <Text fontSize='sm' color='uspolis.textMuted'>
            Nenhum prefixo selecionado.
          </Text>
        )}
      </Flex>
      <Flex wrap='wrap' gap={2}>
        {suggestions.map((p) => (
          <Button
            key={p}
            size='xs'
            variant='outline'
            borderStyle='dashed'
            colorScheme='blue'
            fontFamily={MONO}
            fontWeight='normal'
            leftIcon={<AddIcon boxSize={2} />}
            onClick={() => addPrefix(p)}
          >
            {p === '/' ? '/ (todas as rotas)' : p}
          </Button>
        ))}
      </Flex>
      <Flex gap={2} mt={3}>
        {/* Only a helper to add tags: the field's value is the tag list, so
            this box must not inherit the FormControl's native `required`. */}
        <Input
          isRequired={false}
          size='sm'
          fontFamily={MONO}
          placeholder='Outro prefixo, ex.: /classrooms/schedules'
          value={newPrefix}
          isInvalid={!!inputError}
          onChange={(e) => {
            setNewPrefix(e.target.value);
            setInputError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addPrefix(newPrefix.trim());
            }
          }}
        />
        <Button
          size='sm'
          variant='outline'
          onClick={() => addPrefix(newPrefix.trim())}
        >
          Adicionar
        </Button>
      </Flex>
      {(inputError || fieldError) && (
        <Text color='red.500' fontSize='sm' mt={2}>
          {inputError || fieldError}
        </Text>
      )}
      {prefixes.includes('/') && (
        <Alert status='warning' mt={3} borderRadius='md'>
          <AlertIcon />
          <AlertDescription>
            O prefixo <Code>/</Code> dá acesso a{' '}
            <strong>todas as rotas públicas</strong>, inclusive as que forem
            criadas no futuro. Prefira listar só as rotas necessárias e registre
            a justificativa conforme a política de chaves.
          </AlertDescription>
        </Alert>
      )}
    </FormControl>
  );
}

export default PrefixesField;
