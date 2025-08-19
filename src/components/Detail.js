import React, { useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { Description, Title } from '@mui/icons-material'
import { Triangle } from 'react-loader-spinner'
import Reviews from './Reviews'

const Details = () => {
    const {id }= useParams(); //id destructing
    const [data, setData]= useState({
        Title:"",
        author:"",
        img: "",
        description: "",
        rating:0,
        rated:0
    });
    const [loading, setLoading]=useState(false);

    useEffect(() => {
        async function getData(){
            setLoading(true);
            const _doc= doc(db, "books", id);
            const _data=await getDoc(_doc);
            setData(_data.data());
            setLoading(false);
        }
        getData();
    },[])

  return (
    <div className='p-4 mt-4 flex w-full flex-col md:flex-row items-center md:items-start w-full justify-center'>
        { loading? <div className='h-96 flex w-full justify-center items-center'><Triangle height={25} color='white'/></div>:
        <>
        <img className='h-96 block md:sticky top-24' src={data.img} />
        < div className='md:ml-4 ml-0 w-full md:w-1/2'>
            <h1 className='text-3xl font-bold text-white '>{data.title} <span className='text-xl'>({data.author})</span></h1>
            <ReactStars size={20} half={true} value={data.rating/data.rated} edit={false}/>
            <p className='mt-3'>{data.description}</p>
            <Reviews id={id} prevRating={data.rating} userRated={data.rated}/>
        </div>
        </>
        }
    </div>
  )
}

export default Details