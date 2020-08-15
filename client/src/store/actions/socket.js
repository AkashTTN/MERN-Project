import * as actionTypes from './actionTypes'
import io from 'socket.io-client'
import constants from '../../components/config/constants'

export function initialiseSocket({ url = constants.SERVER_URL, id = '' } = {}) {
    return dispatch => {
        try {

            if (!url && !id) {
                throw new Error('Url or Id needed to create a socket.')
            }

            if (url) {
                dispatch({
                    type: actionTypes.SOCKET_CONNECTION_ESTABLISHED,
                    payload: { socket: io(url) }
                })
            } else {
                dispatch({
                    type: actionTypes.SOCKET_CONNECTION_ESTABLISHED,
                    payload: { socket: io(id) }
                })
            }

        } catch (err) {
            console.log(err)
            dispatch({ type: actionTypes.SOCKET_CONNECTION_FAILED })
        }
    }
}