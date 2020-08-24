import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import Icon from '@material-ui/core/Icon';

import './Toast.css'

const Toast = (props) => {

    const [open, setOpen] = useState(props.open)

    useEffect(() => {
        setOpen(props.open)
    }, [props.open])

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            message={props.message}
            action={
                <>
                    <Icon
                        className="far fa-times-circle"
                        size="small" aria-label="close" color="inherit"
                        onClick={handleClose}>
                    </Icon>
                </>
            }
        />
    );
}

export default Toast
