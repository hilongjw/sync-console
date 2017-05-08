import { getParams } from '../utils'
export default class Flag {
    constructor () {
        const query = getParams()
        console.debug(query)
        this.token = query._sync_console_token
        this.show = query._sync_console_show
    }
}
