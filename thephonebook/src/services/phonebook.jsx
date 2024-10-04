import axios from "axios";
const baseurl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseurl) //GET
}

const create = newObject => {
    return axios.post(baseurl, newObject) //POST
}

const update = (id, newObject) => {
    return axios.put(`${baseurl}/${id}`, newObject) //PUT
}

const remove = (id) => {
    return axios.delete(`${baseurl}/${id}`) //DELETE
        .catch(error => {
            if (error.response && error.response.status === 404) {
                console.warn('Person deleted already', error)
            } else {
                console.error('error deleting person:',error)
            }
                return Promise.reject(error)
        })
}
export default { getAll, create, update, remove}
//default in this case is phonebookService in the App.jsx