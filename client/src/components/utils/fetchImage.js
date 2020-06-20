const fetchImage = async (urlArray) => {
    if (!urlArray || urlArray.length === 0) return ''

    if (Array.isArray(urlArray)) {
        const response = []
        urlArray.forEach(url => {
            response.push(
                fetch(url).then(res => res.blob())
                    .then(localUrl => (URL.createObjectURL(localUrl)))
                    .catch(err => {
                        console.log(err)
                    })
            )
        });

        return Promise.all(response).then(res => {
            return res
        })

    } else {
        return fetch(urlArray).then(res => res.blob())
            .then(localUrl => (URL.createObjectURL(localUrl)))
            .catch(err => {
                console.log(err)
            })
    }
}

export default fetchImage