import React from 'react';
import Layout from '../../layout';
export const ScreenWithLayout = ({ component: ScreenComponent, showChatButton }) => {
    return (props) => (
      <Layout showChatButton={showChatButton}>
        <ScreenComponent {...props} />
      </Layout>
    );
  };