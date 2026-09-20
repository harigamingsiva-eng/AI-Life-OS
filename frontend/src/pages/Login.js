import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async () => {

    setLoading(true);
    setMessage('');

    const url = isLogin
      ? 'http://localhost:8081/api/auth/login'
      : 'http://localhost:8081/api/auth/register';


    try {

      const res = await fetch(url, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)

      });


      const data = await res.json();


      console.log(data);



      // LOGIN SUCCESS

      if (isLogin && data.message === "Login successful") {


        localStorage.setItem(
          'token',
          data.token
        );


        localStorage.setItem(
          'userId',
          data.userId
        );


        localStorage.setItem(
          'name',
          data.name
        );


        localStorage.setItem(
          'email',
          data.email
        );



        setUser({

          userId: data.userId,

          name: data.name,

          email: data.email

        });



        navigate("/dashboard");


      }



      // REGISTER SUCCESS

      else if (!isLogin && data.message === "Registration successful") {


        setMessage(
          "Registration successful. Please login."
        );


        setIsLogin(true);


      }



      else {

        setMessage(
          data.error || "Something went wrong"
        );

      }


    }

    catch(err) {

      console.log(err);

      setMessage(
        "Server error, try again"
      );

    }


    setLoading(false);

  };



  return (

    <div style={styles.container}>

      <div style={styles.card}>


        <div style={styles.logo}>
          ⚡ NEXUS
        </div>


        <div style={styles.tagline}>
          Neural EXperience & Unified System
        </div>



        <h2 style={styles.subtitle}>
          {isLogin ? 'Login' : 'Register'}
        </h2>



        {!isLogin && (

          <input

            style={styles.input}

            type="text"

            name="name"

            placeholder="Full Name"

            onChange={handleChange}

          />

        )}



        <input

          style={styles.input}

          type="email"

          name="email"

          placeholder="Email"

          onChange={handleChange}

        />



        <input

          style={styles.input}

          type="password"

          name="password"

          placeholder="Password"

          onChange={handleChange}

        />



        <button

          style={styles.button}

          onClick={handleSubmit}

          disabled={loading}

        >

          {
            loading
            ? "Please wait..."
            : isLogin
              ? "Login"
              : "Register"
          }


        </button>



        {
          message &&

          <p style={styles.message}>
            {message}
          </p>
        }



        <p style={styles.toggle}>

          {
            isLogin
            ? "Don't have an account? "
            : "Already have an account? "
          }


          <span

            style={styles.link}

            onClick={() => setIsLogin(!isLogin)}

          >

            {
              isLogin
              ? "Register"
              : "Login"
            }


          </span>


        </p>


      </div>

    </div>

  );

}



const styles = {

  container: {
    minHeight:'100vh',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    background:'#0a0a0f'
  },


  card:{
    background:'#12121a',
    padding:'40px',
    borderRadius:'16px',
    width:'380px',
    boxShadow:'0 0 40px #00f5ff22',
    border:'1px solid #00f5ff33'
  },


  logo:{
    textAlign:'center',
    fontSize:'32px',
    fontWeight:'bold',
    color:'#00f5ff',
    marginBottom:'4px'
  },


  tagline:{
    textAlign:'center',
    color:'#444',
    fontSize:'12px',
    marginBottom:'24px'
  },


  subtitle:{
    textAlign:'center',
    color:'#aaa'
  },


  input:{
    width:'100%',
    padding:'12px',
    marginBottom:'16px',
    borderRadius:'8px',
    background:'#0a0a0f',
    color:'#00f5ff',
    border:'1px solid #00f5ff33',
    boxSizing:'border-box'
  },


  button:{
    width:'100%',
    padding:'14px',
    background:'linear-gradient(135deg,#00f5ff,#7b2fff)',
    color:'white',
    border:'none',
    borderRadius:'8px',
    cursor:'pointer'
  },


  message:{
    textAlign:'center',
    color:'#ff6b6b'
  },


  toggle:{
    textAlign:'center',
    color:'#666'
  },


  link:{
    color:'#00f5ff',
    cursor:'pointer'
  }

};



export default Login;