import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

const DevEdit = () => {
    const [templates, setTemplates] = useState([]);
    const token = useSelector((state) => state.misc.token);

    return (
        <div>
            <h1>Dev Edit</h1>
        </div>
    );
}

export default DevEdit;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         