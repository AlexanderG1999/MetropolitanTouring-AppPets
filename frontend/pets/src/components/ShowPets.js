import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alert } from '../functions'

const ShowPets = () => {
    const url = 'http://localhost:5000/api/pets'
    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const MySwal = withReactContent(Swal)
    const [title, setTitle] = useState('')

    useEffect(() => {
        axios.get(url)
            .then(response => {
                setPets(response.data)
                setLoading(false)
            })
            .catch(error => {
                setError(true)
                setLoading(false)
            })
    }, [])

    const getPets = () => {
        if (loading) {
            return <tr><td colSpan="4">Loading...</td></tr>
        }

        if (error) {
            return <tr><td colSpan="4">Error...</td></tr>
        }

        return pets.map((pet, index) => (
            <tr key={index}>
                <td>{pet.nombre}</td>
                <td>{pet.especie}</td>
                <td>{pet.edad}</td>
                <td>{pet.dueño}</td>
            </tr>
        ))
    }

    const saveNewPet = () => {
        const id = document.getElementById('id').value
        const nombre = document.getElementById('nombre').value
        const especie = document.getElementById('especie').value
        const edad = document.getElementById('edad').value
        const dueño = document.getElementById('dueño').value

        if (id === '') {
            axios.post(url, {
                nombre: nombre,
                especie: especie,
                edad: edad,
                dueño: dueño
            })
                .then(response => {
                    MySwal.fire({
                        title: 'Pet saved',
                        text: 'Pet saved successfully',
                        icon: 'success'
                    })
                    document.getElementById('nombre').value = ''
                    document.getElementById('especie').value = ''
                    document.getElementById('edad').value = ''
                    document.getElementById('dueño').value = ''
                })
                .catch(error => {
                    MySwal.fire({
                        title: 'Error',
                        text: 'Error saving pet',
                        icon: 'error'
                    })
                })
            // Actualizar la tabla
            axios.get(url)
                .then(response => {
                    setPets(response.data)
                    setLoading(false)
                })
                .catch(error => {
                    setError(true)
                    setLoading(false)
                })
        }
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalPets'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Nombre de la Mascota</th>
                                        <th>Especie</th>
                                        <th>Edad</th>
                                        <th>Dueño</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getPets()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalPets' className='modal fade' aria-hidden="true">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Nombre de la mascota</span>
                                <input type='text' id='nombre' className='form-control' autoFocus></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Especie</span>
                                <input type='text' id='especie' className='form-control'></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Edad</span>
                                <input type='number' id='edad' className='form-control'></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>Dueño</span>
                                <input type='text' id='dueño' className='form-control'></input>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                            <button type='button' className='btn btn-primary' onClick={saveNewPet}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowPets