
import React, { useEffect, useState } from 'react'
import { Audio, Triangle} from 'react-loader-spinner';
import ReactStars from 'react-stars';
import {getDocs} from 'firebase/firestore'
import { booksRef } from '../firebase/firebase';
import { Link } from 'react-router-dom';

const Cards = () => {

    const [data, setData] = useState([
        // {
        //     name: "CITY OF ORANGE",
        //     rating: 4.2,
        //     img: "https://images2.penguinrandomhouse.com/cover/9780593422182",
        //     author: "David Yoon",
        // },
       
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getData(){
            setLoading(true);
            // to import data from db
            const _data=await getDocs(booksRef);
            _data.forEach((doc) => {
                setData((prv) => [...prv, {...(doc.data()), id: doc.id}])
            })
            setLoading(false);
        }
        getData();
    }, [])

    return (
        <div className='flex flex-wrap justify-between p-3 mt-2 '>
            {loading? <div className='w-full flex justify-center items-center h-60'><Triangle height={40} width={100} color='white'/></div> :
            data.map((e, i) => {
                return (
                    <Link to={`/detail/${e.id}`}>
                    <div key={i} className='card font-medium shadow-lg p-2 hover:-translate-y-3 cursor-pointer mt-6 transition-all duration-500'>
                        <img className='h-60 w-70 mb-3' src={e.img} />
                        <h1> {e.title}</h1>
                        <h1 className='flex items-center'> <span className='text-blue-500 mr-1'>Rating: </span> 
                            <ReactStars size={20} half={true} value={e.rating/e.rated} edit={false}/>
                        </h1>
                        <h1> <span className='text-blue-500 mr-1'>Author:</span> {e.author}</h1>
                    </div>
                    </Link>
                )
            })
            }
        </div>
    )
}
export default Cards