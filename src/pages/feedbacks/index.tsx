import { useEffect, useRef, useState } from 'react';
import useFeedbacks from '../../hooks/feedbacks/useFeedbacks';
import { Box, Flex, Icon, Text, useMediaQuery } from '@chakra-ui/react';
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

  const [isMobile] = useMediaQuery('(max-width: 768px)');

  function FeedbackItem({ item }: { item: FeedbackResponse }) {
    const textRef = useRef<HTMLParagraphElement | null>(null);
    const [canShowMore, setCanShowMore] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
      function updateOverflow() {
        if (!textRef.current) {
          setCanShowMore(false);
          return;
        }

        const { scrollHeight, clientHeight } = textRef.current;
        setCanShowMore(scrollHeight > clientHeight);
      }

      updateOverflow();
      window.addEventListener('resize', updateOverflow);

      return () => {
        window.removeEventListener('resize', updateOverflow);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.message, showMore, isMobile]);

    return (
      <Flex
        direction={'column'}
        w={'700px'}
        maxW={isMobile ? '80vw' : '800px'}
        align={'flex-start'}
        border={'1px solid'}
        shadow={'md'}
        borderRadius={'5px'}
        gap={'10px'}
        padding={'20px'}
      >
        <Flex
          direction={'row'}
          gap={'10px'}
          w={'full'}
          justify={'space-between'}
          align={'flex-start'}
        >
          <Flex gap={'10px'}>
            {item.user_picture_url ? (
              <UserImage url={item.user_picture_url} />
            ) : (
              <Icon as={FaUserCircle} boxSize={'50px'} />
            )}
            <Flex direction={'column'} align={'flex-start'}>
              <Text fontWeight={'bold'} fontSize={'lg'}>
                {item.title}
              </Text>
              <Text fontSize={'md'} fontWeight={'normal'}>
                {item.user_name}
              </Text>
              {/* <Text>{item.user_email}</Text> */}
            </Flex>
          </Flex>
        </Flex>

        <Text
          ref={textRef}
          textAlign={'justify'}
          wordBreak={'break-all'}
          noOfLines={showMore ? undefined : 3}
          textOverflow={'ellipsis'}
        >
          {item.message}
        </Text>
        {(canShowMore || showMore) && (
          <Text
            fontSize={'sm'}
            fontWeight={'bold'}
            color={'uspolis.blue'}
            cursor={'pointer'}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Ver menos' : 'Ver mais'}
          </Text>
        )}
        <Text
          fontSize={'sm'}
          color={'uspolis.gray'}
        >{`Enviado em ${moment(item.created_at).format('DD/MM/YYYY [às] HH:mm')}`}</Text>
      </Flex>
    );
  }

  useEffect(() => {
    getFeedbacks(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPage]);

  function renderPageItem(item: FeedbackResponse) {
    return <FeedbackItem item={item} />;
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
