import ClientOnly from '@antv/dumi-theme-antv/dist/common/ClientOnly';
import Footer from '@antv/dumi-theme-antv/dist/slots/Footer';
import Header from '@antv/dumi-theme-antv/dist/slots/Header';
import React from 'react';

const Page = React.lazy(() => import('../../playground/layouts'));

const Playground: React.FC = () => {
  return (
    <>
      <Header />
      <ClientOnly>
        <Page />
      </ClientOnly>
      <Footer />
    </>
  );
};

export default Playground;
