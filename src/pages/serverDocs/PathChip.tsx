import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { HStack, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

interface PathChipProps {
  path: string;
}

function PathChip({ path }: PathChipProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(path);
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1300);
  }

  return (
    <HStack
      spacing={1}
      bg={copied ? '#E3F5F0' : '#F4F4F5'}
      border={'1px solid'}
      borderColor={'uspolis.lightGray'}
      borderRadius={'4px'}
      pl={'10px'}
      pr={'3px'}
      py={'4px'}
    >
      <Text
        fontFamily={'ui-monospace, monospace'}
        fontSize={'12.5px'}
        color={'#262626'}
      >
        {path}
      </Text>
      <Tooltip label={copied ? 'Copiado!' : 'Copiar caminho'}>
        <IconButton
          aria-label='Copiar caminho'
          icon={copied ? <CheckIcon /> : <CopyIcon />}
          onClick={handleCopy}
          size={'xs'}
          variant={'ghost'}
          color={copied ? '#2F9E6E' : '#717075'}
        />
      </Tooltip>
    </HStack>
  );
}

export default PathChip;
