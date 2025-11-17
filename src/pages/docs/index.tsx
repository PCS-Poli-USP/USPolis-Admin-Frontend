import PageContent from '../../components/common/PageContent';
import Introducao from '../../mdx/pages/teste.mdx';

export default function Docs() {
  return (
    <PageContent>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <Introducao />
      </div>
    </PageContent>
  );
}
