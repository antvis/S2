import React from 'react';
import Page from '../../playground/layouts';
import { Header } from '@antv/dumi-theme-antv/dist/slots/Header';
import { Footer } from '@antv/dumi-theme-antv/dist/slots/Footer';

const Playground: React.FC = () => {
  return (
    <>
      <Header />
      <Page />
      <Footer />
    </>
  );
};

export default Playground;
