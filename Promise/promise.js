//简单实现的一个Promise,用于理解Promuse

function Promise(executor) {

    this.PromiseState = 'pending';
    this.PromiseResult = null;
    let self = this;
    this.callbacks = [];

    function resolve(data) {

        if (self.PromiseState !== 'pending') return;
        self.PromiseState = 'fulfilled';
        self.PromiseResult = data;

        self.callbacks.forEach(function (items) {

            items.onResolved(data);
        })
    }

    function reject(data) {

        if (self.PromiseState !== 'pending') return;
        self.PromiseState = 'rejected';
        self.PromiseResult = data;


        self.callbacks.forEach(function (items) {

            items.onRejected(data);
        })

    }

    try {

        executor(resolve, reject);

    } catch (error) {

        reject(error);

    }

}

Promise.prototype.then = function (onResolved, onRejected) {
    let self = this;
    if (typeof onRejected !== "function") {

        onRejected = reason => {

            throw reason
        }
    }

    if (typeof onResolved !== "function") {

        onResolved = value => value
    }
    return new Promise((resolve, reject) => {
        if (self.PromiseState === "fulfilled") {
            queueMicrotask(() => {
                try {
                    let res = onResolved(self.PromiseResult);
                    if (res instanceof Promise) {
                        res.then(function (v) {

                            resolve(v);
                        }, function (r) {

                            reject(r);
                        })

                    } else {

                        resolve(res);
                    }

                } catch (error) {
                    reject(error)
                }
            })

        } else if (self.PromiseState === 'rejected') {

            queueMicrotask(() => {

                try {
                    let res = onRejected(self.PromiseResult);
                    if (res instanceof Promise) {
                        res.then(function (v) {

                            resolve(v);
                        }, function (r) {

                            reject(r);
                        })

                    } else {

                        resolve(res);
                    }

                } catch (error) {
                    reject(error)
                }

            })


        } else {

            this.callbacks.push({

                onResolved: function () {
                    queueMicrotask(() => {

                        let res = onResolved(self.PromiseResult);

                        if (res instanceof Promise) {
                            res.then(function (v) {

                                resolve(v);
                            }, function (r) {

                                reject(r);
                            })

                        } else {

                            resolve(res);
                        }
                    })



                },
                onRejected: function () {

                    queueMicrotask(() => {

                        try {
                            let res = onRejected(self.PromiseResult);

                            if (res instanceof Promise) {
                                res.then(function (v) {

                                    resolve(v);
                                }, function (r) {

                                    reject(r);
                                })

                            } else {

                                resolve(res);
                            }
                        } catch (e) {
                            reject(e)
                        }
                    })

                }

            }
            )
        }
    })

}

Promise.prototype.catch = function (onRejected) {


    return this.then(undefined, onRejected);

}

Promise.resolve = function (value) {

    return new Promise((resolve, reject) => {

        if (value instanceof Promise) {
            value.then(v => {
                resolve(v)
            }, r => {

                reject(r)
            })

        } else {
            resolve(value)

        }

    })
}

Promise.reject = function (value) {
    return new Promise((resolve, reject) => {

        reject(value)
    })
                                  }
