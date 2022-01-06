
const fetch = require('node-fetch');

async function updateRestDB(deviceData){
    const apiKey = "?apikey=61cb6af0a807fd7408e107b5"
    const restUrl = "https://variatemphumi-8288.restdb.io/rest/data"
	const options = {
		method: 'GET',
		headers: {
            'cache-control': 'no-cache',
			'Content-Type': 'application/json',
		},
	};
	fetch(restUrl + apiKey, options).then((resp) => resp.json())
    .then((data) => {

        async function cleanRest(data){
            options.method = 'DELETE'
            await Promise.all((data).map( u => {
                //console.log(u._id)
                const urlForDelete = restUrl + "/" + u._id + apiKey
                //console.log(urlForDelete)
                fetch(urlForDelete, options).then((res) => console.log(res.json()))
            }))
        }

        async function setRest(){
            options.method = 'POST'
            options.json = true
            options.body = JSON.stringify(deviceData)
            await Promise.all([fetch(restUrl + apiKey, options).then((res) => console.log(res.json()))]) 
        }

        cleanRest(data)
        setRest()
    })
}
const rawBody = [{ "BIG": "BRUH"}]
updateRestDB(rawBody)