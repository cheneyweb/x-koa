let cache = {
    get(redis, key) {
        return new Promise((resolve, reject) => {
            redis.get(key, function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(res))
                }
            })
        })
    },
    set(redis, key, obj) {
        return new Promise((resolve, reject) => {
            redis.set(key, JSON.stringify(obj), function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}

module.exports = cache