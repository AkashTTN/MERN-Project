import React from 'react'
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import './Request.css'

const Request = ({ data, changeRequestStatus, index }) => {

    const requestContent = <Accordion>
        <AccordionSummary
            expandIcon={<Icon className="fas fa-chevron-down" />}
            aria-controls="panel1c-content"
            id="panel1c-header"
        >
            <p>#{index}&nbsp;&nbsp;&nbsp;{data.name}</p>
        </AccordionSummary>
        <AccordionDetails>
            <div className="RequestInfo flex-container">
                <div>
                    <p className="RequestInfoHeading">Current</p>
                    <p>{data.name}</p>
                    <p>{data.team}</p>
                </div>
                <div>
                    <p className="RequestInfoHeading">New</p>
                    <p>{data.newProfileData.name}</p>
                    <p>{data.newProfileData.team}</p>
                </div>
            </div>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
            <Button size="small" color="secondary"
                variant="contained"
                onClick={
                    (e) => {
                        changeRequestStatus({
                            status: 'rejected',
                            id: data.googleId
                        })
                    }
                }
            >Reject</Button>
            <Button size="small" color="primary"
                variant="contained"
                onClick={
                    (e) => changeRequestStatus({
                        status: 'approved',
                        id: data.googleId
                    })
                }
            >
                Approve
            </Button>
        </AccordionActions>
    </Accordion>

    return (
        <div className="Request">
            {requestContent}
        </div>
    )
}

export default Request
