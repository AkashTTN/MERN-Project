const fetchImage = async (url) => {
    return fetch(url).then(res => res.blob())
        .then(localUrl => (URL.createObjectURL(localUrl)))
        .catch(err => {
            console.log(err)
        })
}

export default fetchImage