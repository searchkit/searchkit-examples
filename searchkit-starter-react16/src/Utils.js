const map = require("lodash/map")

export class Utils {
    sanitizeQuery(query) {
        return query.replace(/[^\w\s]/g, "").toLowerCase()
    }

    createRegexQuery(query) {
        query = this.sanitizeQuery(query)
        query = map(query, (char) => {
            if (/[a-z]/.test(char)) {
                return `[${char}${char.toUpperCase()}]`
            }
            return char
        }).join("")
        return `.*${query}.*`
    }
}

export default new Utils()