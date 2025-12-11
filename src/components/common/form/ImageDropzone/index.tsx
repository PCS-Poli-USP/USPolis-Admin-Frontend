import { useDropzone } from 'react-dropzone';
import { Box, Flex, Text } from '@chakra-ui/react';

interface ImageDropzoneProps {
  maxFiles?: number;
  onDrop: (acceptedFiles: File[]) => void;
}

export function ImageDropzone(props: ImageDropzoneProps) {
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop: props.onDrop,
      accept: {
        'image/*': [],
      },
      maxFiles: props.maxFiles,
      multiple: !!props.maxFiles,
      maxSize: 2 * 1024 * 1024, // 5 MB
    });

  return (
    <Flex direction={'column'} gap={'10px'}>
      <Box
        {...getRootProps({ className: 'dropzone' })}
        border='2px dashed'
        borderColor={isDragActive ? 'uspolis.blue' : 'uspolis.gray'}
        borderRadius='xl'
        p={6}
        textAlign='center'
        cursor='pointer'
        transition='border-color 0.2s'
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text color='uspolis.gray'>Solte o arquivo aqui...</Text>
        ) : (
          <Text>Arraste uma imagem ou clique para selecionar (até 5 MB)</Text>
        )}
      </Box>
      <Flex direction={'column'} hidden={acceptedFiles.length == 0}>
        <Text>Arquivos carregados:</Text>
        {acceptedFiles.map((file) => {
          return (
            <Text>
              {file.path} - {(file.size / (1024 * 1024)).toFixed(2)}MB
            </Text>
          );
        })}
      </Flex>
    </Flex>
  );
}
