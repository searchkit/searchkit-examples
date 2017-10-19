const map = require("lodash/map")
export class Utils {
    sanitizeQuery(query) {
        return query.replace(/[^\w\s]/g, "").toLowerCase()
    }

    createRegexQuery(queryString) {
        let query = this.sanitizeQuery(queryString)
        query = map(query, (char) => {
            if (/[a-z]/.test(char)) {
                return `[${char}${char.toUpperCase()}]`
            }
            return char
        }).join("")
        query = `${query}.*`
        if(queryString.length > 2){
            query = `([a-zA-Z]+ )?${query}`
        }
        return query
    }
}

export default new Utils()