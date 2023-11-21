import { Flex, Text } from "@chakra-ui/react";

interface DayProps {
  weekDay: string;
  numberDay: string | number;
}


export function Day (props: DayProps) {
  return (
    <Flex flexDirection='column' w='full'>
      <Text color='gray.500' fontSize='xs' >{props.weekDay}</Text>
      <Text color='blackAlpha.900' fontSize='2xl' >{props.numberDay}</Text>
    </Flex>
  )
}