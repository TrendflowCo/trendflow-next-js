import React from 'react';
import Navbar from './global/NavBar';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    );
}

export default Layout;