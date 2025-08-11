import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import app from '../firebase/firebase';
import swal from "sweetalert";
import { usersRef } from '../firebase/firebase';
import { addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';


const auth = getAuth(app);

const Signup = () => {
  const navigate=useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecaptha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          }
        });
      } catch (error) {
        console.error("Error initializing reCAPTCHA: ", error);
      }
    }
  };

  const requestOtp = () => {
    setLoading(true);
    generateRecaptha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then(confirmationResult => {
        window.confirmationResult = confirmationResult;
        swal({
          text: "OTP Sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      }).catch((error) => {
        console.error("Error sending OTP: ", error);
        setLoading(false);
        swal({
          text: "Failed to send OTP. Please try again.",
          icon: "error",
          buttons: false,
          timer: 3000,
        });
      });
  };

  const verifyOTP= () => {
    try{
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
       
        swal({
          text: "Sucessfully Registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate('/login')
        setLoading(false); })
    }catch(error){
      console.log(error);
    }
  }

  const uploadData = async () => {
    try {
      const salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(form.password, salt);
      await addDoc(usersRef, {
        name: form.name,
        password: hash,
        mobile: form.mobile
      });
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className='w-full flex flex-col mt-8 items-center'>
      <h1 className='text-xl font-bold'>Sign up</h1>
      {otpSent ?
        <>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label htmlFor="otp" className="leading-7 text-sm text-gray-300">OTP</label>
              <input id="otp" name="otp"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
          <div className="p-2 w-full">
            <button onClick={verifyOTP} className="flex mx-auto text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
              {loading ? <TailSpin height={25} color='white' /> : 'Confirm OTP'}
            </button>
          </div>
        </>
        :
        <>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label htmlFor="name" className="leading-7 text-sm text-gray-300">Name</label>
              <input type="text" id="name" name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label htmlFor="mobile" className="leading-7 text-sm text-gray-300">Mobile No.</label>
              <input type="text" id="mobile" name="mobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
          <div className="p-2 w-full md:w-1/3">
            <div className="relative">
              <label htmlFor="password" className="leading-7 text-sm text-gray-300">Password</label>
              <input type="password" id="password" name="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
          </div>
          <div className="p-2 w-full">
            <button onClick={requestOtp}
              className="flex mx-auto text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
              {loading ? <TailSpin height={25} color='white' /> : 'Request OTP'}
            </button>
          </div>
        </>
      }
      <div>
        <p>Already have an account?<Link to={'/login'}><span className='text-blue-500'> Login</span></Link></p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;



// import React, { useState } from 'react'
// import { TailSpin } from 'react-loader-spinner';
// import { Link } from 'react-router-dom';
// import {getAuth, RecaptchaVerifier , signInWithPhoneNumber} from 'firebase/auth';
// import app from '../firebase/firebase'
// import swal from "sweetalert";

// const auth=getAuth(app);

// const Signup = () => {
//   const [form, setForm] = useState({
//     name: "",
//     mobile: "",
//     password: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [OTP, setOTP]= useState("");

// //   const generateRecaptha = () => {
// //     window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
// //       'size': 'invisible',
// //       'callback': (response) => {
// //         // reCAPTCHA solved, allow signInWithPhoneNumber.
// //       }
// //     }, auth);
// //   }

// //   const requestOtp = () => {
// //     setLoading(true);
// //     generateRecaptha();
// //     let appVerifier = window.recaptchaVerifier;
// //       signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
// //       .then(confirmationResult => {
// //         window.confirmationResult = confirmationResult;
// //         swal({
// //           text: "OTP Sent",
// //           icon: "success",
// //           buttons: false,
// //           timer: 3000,
// //         });
// //         setOtpSent(true);
// //         setLoading(false);
// //       }).catch((error) => {
// //         console.log(error)
// //       })
// // }

//   return (
//     <div className='w-full flex flex-col mt-8 items-center'>
//       <h1 className='text-xl font-bold'>Sign up</h1>
//       {otpSent ?
//         <>
//           <div class="p-2 w-full md:w-1/3">
//             <div class="relative">
//               <label for="email" class="leading-7 text-sm text-gray-300">OTP</label>
//               <input id="email" name="email"
//                 value={OTP}
//                 onChange={(e) => setOTP(e.target.value)}
//                 class="w-full bg-gray-100  rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//             </div>
//           </div>
//           <div class="p-2  w-full">
//                 <button class="flex mx-auto text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
//                     {loading ? <TailSpin height={25} color='white' /> : 'Confirm OTP'}</button>
//             </div>
//         </>
//         :
//         <>
          
//           <div class="p-2 w-full md:w-1/3">
//             <div class="relative">
//               <label for="email" class="leading-7 text-sm text-gray-300">Name</label>
//               <input type="email" id="email" name="email"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 class="w-full bg-gray-100  rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//             </div>
//           </div>
//           <div class="p-2 w-full md:w-1/3">
//             <div class="relative">
//               <label for="email" class="leading-7 text-sm text-gray-300">Mobile No.</label>
//               <input type={"number"} id="email" name="email"
//                 value={form.mobile}
//                 onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//                 class="w-full bg-gray-100  rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//             </div>
//           </div>

//           <div class="p-2 w-full md:w-1/3">
//             <div class="relative">
//               <label for="email" class="leading-7 text-sm text-gray-300">Password</label>
//               <input type="email" id="email" name="email"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 class="w-full bg-gray-100  rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
//             </div>
//           </div>
//           <div class="p-2  w-full">
//             <button 
//             // onClick={requestOtp}
//             class="flex mx-auto text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
//               {loading ? <TailSpin height={25} color='white' /> : 'Request OTP'}</button>
//           </div>
//         </>
//       }
//       <div>
//         <p>Already have an account?<Link to={'/login'}><span className='text-blue-500'> Login</span></Link></p>
//       </div>
//       {/* <div id="recaptcha-container"></div> */}
//     </div>
//   )
// }

// export default Signup