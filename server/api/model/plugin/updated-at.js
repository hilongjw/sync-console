function updatedAt (schema, options) {
    schema.add({ updatedAt: Date })

    schema.pre('save', function (next) {
        this.updatedAt = Date.now()
        next()
    })

    schema.pre('update', function (next) {
        this.updatedAt = Date.now()
        next()
    })

    if (options && options.index) {
        schema.path('updatedAt').index(options.index)
    }
}

module.exports = exports = updatedAt