import React from 'react';
import PropTypes from 'prop-types';

import './Confirm.scss';

const Confirm = props => {

    return (
        <div className = 'wrapperConfirm'>
            <div className = 'confirmSave'>
                <span>Detected new changes</span>
                <input
                    className = 'saveCofirm'
                    onClick = {props.cbSaveChanges}
                    type = 'button'
                    value = 'Save changes'
                />
                <input
                    className = 'cancelCofirm'
                    onClick = {props.cbCancelSave}
                    type = 'button'
                    value = 'Cancel'
                />
            </div>
        </div>
    )
}

Confirm.propTypes = {
    cbSaveChanges: PropTypes.func.isRequired, // callback
    cbCancelSave: PropTypes.func.isRequired // callback
}

export default Confirm;