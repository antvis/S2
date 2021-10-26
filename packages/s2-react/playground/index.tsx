import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Sheet } from '../src';

const Playground: FC = () => {
  return (
    <>
      <h1>S2 React Playground</h1>
      <Sheet />
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Playground />
  </React.StrictMode>,
  document.getElementById('root'),
);
