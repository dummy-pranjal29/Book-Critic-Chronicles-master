import React, { useContext, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import { reviewsRef, db } from '../firebase/firebase';
import { addDoc, Timestamp, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert'
import { Appstate } from '../App';
import { useNavigate } from 'react-router-dom';


const Reviews = ({id, prevRating, userRated}) => {

    const navigate= useNavigate();
    const useAppstate=useContext(Appstate);
    const [rating, setRating]=useState(0);
    const [loading, setLoading]=useState(false);
    const [reviewsLoading, setReviewsLoading]=useState(false);
    const [form, setForm]=useState("");
    const [data, setData]= useState([]);
    const [newAdded, setNewAdded]=useState(0);
    const sendReview = async () => {
        setLoading(true);
        try{
            if(useAppstate.login){
            await addDoc(reviewsRef, {
                bookid:id,
                name: useAppstate.userName,
                rating:rating,
                thought:form,
                timestamp:new Date().getTime()
            })
            const ref=doc(db, "books", id);
            await updateDoc(ref, {
                rating: prevRating +rating,
                rated: userRated +1
            })
            setRating(0);
            setForm("");
            setNewAdded(newAdded+1);
            swal({
                title:"Review Sent",
                icon: "success",
                buttons: false,
                timer: 3000
            })
        }
        else{
            navigate('/login')
        }
        }
        catch(error){
            swal({
                title:error.message,
                icon: "error",
                buttons: false,
                timer: 3000
            })
        }
        setLoading(false);
    }

    useEffect(()=> {
        async function getData(){
            setReviewsLoading(true);
            setData([]);
            let quer = query(reviewsRef, where('bookid','==',id))
            const querySnapshot=await getDocs(quer);
            querySnapshot.forEach((doc)=> {
                setData((prev)=> [...prev,doc.data()])
            })
            setReviewsLoading(false);
        }
        getData();
    },[newAdded])

  return (
    <div className='mt-4 py-1 border-t-2 border-blue-400 w-full'>
        <ReactStars size={25} half={true} value={rating} onChange={(rate) => setRating(rate)}/>
        <input
            value={form}
            onChange={(e) => setForm(e.target.value)}
            placeholder='Add your review...'
            className='w-full p-2 outline-none text-black'
        />
        <button onClick={sendReview} className='bg-blue-500 flex justify-center w-full p-2'>
            {loading? <TailSpin height={25} color="white"/>:'Share'}
        </button>

        {reviewsLoading? <div className='mt-3 flex justify-center'><ThreeDots height={9} color='white'/></div>:
        <div className='mt-4'>
            {data.map((e,i) => {
                return(
                    <div className=' p-2 w-full border-b border-gray-400 mt-2' key={i}>
                        <div className='flex items-baseline'>
                        <p className='text-blue-800'>{e.name}</p>
                        <p className='ml-3 text-xs'>{new Date(e.timestamp).toLocaleString()}</p>
                        </div>
                        <ReactStars size={15} half={true} value={e.rating} edit={false}/>
                        <p>{e.thought}</p>
                    </div>
                )
            })}
        </div>
        }
    </div>
  )
}

export default Reviews