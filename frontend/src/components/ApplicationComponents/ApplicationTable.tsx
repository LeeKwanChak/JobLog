import React from 'react';
import type { Application } from '../../types';

interface ApplicationTableProps {
  applications: Application[];
  onUpdate: (appId: number) => void;
  onDelete: (appId: number) => void;
  onViewDetails: (app: Application) => void;
  getStatusStyle: (status: string) => string;
  getFavicon: (url: string) => string;
}

const ApplicationTable: React.FC<ApplicationTableProps> = () => {
  return (
    <div>

    </div>

  )
}

export default ApplicationTable;