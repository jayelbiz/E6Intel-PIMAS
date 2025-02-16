import React from 'react';
import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useNavigate } from 'react-router-dom';

const MapView = () => {
    const navigate = useNavigate();
    
    const items = [
        { label: 'Home', command: () => navigate('/') },
        { label: 'News', command: () => navigate('/news') },
        { label: 'Map View' }
    ];
    const home = { icon: 'pi pi-home', command: () => navigate('/') };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="mb-4">
                    <h4 className="mb-2">News Map View</h4>
                    <BreadCrumb model={items} home={home} className="p-0 text-sm" />
                </div>
                <Card>
                    <div className="text-center p-5">
                        <i className="pi pi-map text-4xl mb-3"></i>
                        <p className="text-xl">Map view feature coming soon!</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MapView;
