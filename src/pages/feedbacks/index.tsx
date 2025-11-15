import { useEffect, useState } from 'react';
import useFeedbacks from '../../hooks/feedbacks/useFeedbacks';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import PaginationDisplay from '../../components/common/PaginationDisplay';
import { FeedbackResponse } from '../../models/http/responses/feedback.response.models';
import { FaUserCircle } from 'react-icons/fa';
import { PageSize } from '../../utils/enums/pageSize.enum';
import moment from 'moment';
import UserImage from '../../components/common/UserImage/user.image';

function Feedbacks() {
  const { pageResponse, loading, getFeedbacks } = useFeedbacks();
  const [pageSize, setPageSize] = useState<PageSize>(PageSize.SIZE_5);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    getFeedbacks(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPage]);

  function renderPageItem(item: FeedbackResponse) {
    return (
      <Flex
        direction={'column'}
        w={'700px'}
        align={'center'}
        border={'1px solid'}
        borderRadius={'5px'}
        gap={'10px'}
        padding={'20px'}
      >
        <Flex
          direction={'row'}
          gap={'10px'}
          justify={'center'}
          align={'center'}
        >
          {item.user_picture_url ? (
            <UserImage url={item.user_picture_url} />
          ) : (
            <Icon as={FaUserCircle} boxSize={'50px'} />
          )}
          <Flex direction={'column'} align={'flex-start'}>
            <Text fontSize={'lg'} fontWeight={'bold'}>
              {item.user_name}{' '}
            </Text>
            <Text>{item.user_email}</Text>
          </Flex>
        </Flex>
        <Text fontWeight={'bold'}>{item.title}</Text>
        <Text textAlign={'justify'} wordBreak={'break-all'}>
          {item.message}
        </Text>
        <Text
          fontSize={'sm'}
          color={'uspolis.gray'}
        >{`Enviado em ${moment(item.created_at).format('DD/MM/YYYY [às] HH:mm')}`}</Text>
      </Flex>
    );
  }

  return (
    <PageContent>
      <Box
        p={'10px'}
        display={'flex'}
        justifyContent={'center'}
        alignContent={'center'}
      >
        <PaginationDisplay<FeedbackResponse>
          title='Mensagens'
          pageResponse={pageResponse}
          loading={loading}
          renderPageItem={renderPageItem}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
        />
      </Box>
    </PageContent>
  );
}

export default Feedbacks;
