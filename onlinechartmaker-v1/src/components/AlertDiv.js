import React from 'react'
import { Alert } from 'react-bootstrap'

const AlertDiv = ({errorMsg}) => {
    return (
        <div>
            <Alert variant='danger'>
                {errorMsg}
            </Alert>
        </div>
    )
}

export default AlertDiv
