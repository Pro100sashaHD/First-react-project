import React from 'react';
import ClusterSpace from '../components/ClusterSpace/ClusterSpace';
import '../styles/global.css';

const ClusterSpacePage = () => {
  return (
    <div>
      <h1 className="cluster-space-title">Кластерное пространство</h1>
      <div>
        <ClusterSpace />
      </div>
    </div>
  );
};

export default ClusterSpacePage;