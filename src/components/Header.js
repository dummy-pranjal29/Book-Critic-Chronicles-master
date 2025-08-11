import React, { useContext } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import {Link } from 'react-router-dom';
import {Appstate} from '../App'

const Header=()=> {
  const useAppstate = useContext(Appstate);
  return (
    <div className='sticky z-10 bg-black top-0 text-3xl flex justify-between items-center text-blue-400 font-bold p-3 border-b-2 border-blue-50'>
        <Link to={'/'} ><span>Book<span className='text-white'>Review</span></span></Link>
        {useAppstate.login ?
          <Link to={'/addbook'}>
            <h1 className='text-lg text-white cursor-pointer flex items-center'>
            <Button><AddIcon className='mr-1' color='inherit'/><span className='text-white'>Add New</span></Button></h1>
        </Link>
        :
        <Link to={'/login'}>
            <h1 className='text-lg bg-blue-600 text-white cursor-pointer flex items-center'>
            <Button><span className='text-white font-medium capitalize'>Login</span></Button></h1>
        </Link>
      }
    </div>
  )
}
export default Header