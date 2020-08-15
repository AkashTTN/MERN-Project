import io from 'socket.io-client'

import { SOCKET_URL } from "config";

export const socket = io(SOCKET_URL);

export class Socket {
    constructor({ url = '', id = null } = {}) {

        try {

            if (!url && !id) {
                throw new Error('Url or Id needed to create a socket.')
            }

            if (url) {
                this.socket = io(url)
            } else {
                this.socket = io(id)
            }

        } catch (err) {
            console.err(err)
        }
    }

}