import React from 'react';

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

export default Confirm;