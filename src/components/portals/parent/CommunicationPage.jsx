import React from 'react';
import CommunicationPage from '../shared/CommunicationPage';

const ParentCommunicationPage = ({ darkMode }) => {
    return <CommunicationPage darkMode={darkMode} portalType="parent" />;
};

export default ParentCommunicationPage;
