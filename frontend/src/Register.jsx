import React, { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from './api/axios';
import axios  from 'axios'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PWD_REGEX = /^(?=.*[a-z]).{1,24}$/;

// const REGISTER_URL = 'http://localhost:3500'
const REGISTER_URL = '/'


const Register = () => {
  const userRef = useRef() //focus on the user input when components load
  const errRef = useRef() //if we get an error we need to put a focus so taht it can be announced by screen reader for acccesibility

  //below: state for user fields
  const [name, setName] = useState('')
  const [validName, setValidName] = useState('')
  const [nameFocus, setNamefocus] = useState('')

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState('')
  const [pwdFocus, setPwdFocus] = useState('')

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch,  setValidMatch] = useState('')
  const [matchFocus, setMatchFocus] = useState('')

  const [errMsg, setErrMsg] = useState('')   //Error message
  const [success, setSuccess] = useState('') //Success message in submitting reg. form

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    const result = USER_REGEX.test(name)
    console.log(result)
    console.log(name);
    setValidName(USER_REGEX.test(name));
  }, [name])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {  //for error message
    setErrMsg('');
  }, [name, pwd, matchPwd]) //every time user changes user,pwd, matchpwd. And then clear out the error message cos user has read the error message
  

  const handleSubmit = async (e) => {
    console.log(`${process.env.REACT_APP_API_KEY}`);
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(name);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
        setErrMsg("Invalid Entry");
        return;
    }
    try {
        const response = await axios.post(REGISTER_URL,
            JSON.stringify({ name, pwd }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        console.log(response?.data);
        console.log(response?.accessToken);
        console.log(JSON.stringify(response))
        setSuccess(true);
        //clear state and controlled inputs
        //need value attrib on inputs for this
        setName('');
        setPwd('');
        setMatchPwd('');
    } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 409) {
            setErrMsg('Username Taken');
        } else {
            setErrMsg('Registration Failed')
        }
        errRef.current.focus();
    }
}

return (
 <>
  {success ? (
    <section>
      <h1>Success!</h1>
      <p>
        <a href="#">Sign In</a>
      </p>
    </section>
  ) : (
  <section>
      <p ref={errRef} className={errMsg ? "errmsg" :
        "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>REGISTER</h1>
        <form onSubmit={handleSubmit}>
         <label htmlFor="username">
           Username:
          <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
          <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
         </label> 
         <input 
          type="text" placeholder='Username..' 
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(event) => {
          setName(event.target.value)
          }}
          value = {name}
          required
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote" //user id note
          onFocus={() => setNamefocus(true)}
          onBlur={() => setNamefocus(false)} //when leaving input field
        />
          <p id="uidnote" className={nameFocus && name && 
            !validName ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
            4 to 24 characters.<br />
            Must begin with a letter.<br />
            Letters, numbers, underscores, hyphens allowed.
          </p>

          <label htmlFor="password">
            Password:
            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
           <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            aria-invalid={validPwd ? "false" : "true"}
            aria-describedby="pwdnote"
            onFocus={() => setPwdFocus(true)}
            onBlur={() => setPwdFocus(false)}
          />
          <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.<br />
              Must include uppercase and lowercase letters, a number and a special character.<br />
              Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
          </p>

          <label htmlFor="confirm_pwd">
            Confirm Password:
            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
          </label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(e) => setMatchPwd(e.target.value)}
            value={matchPwd}
            required
            aria-invalid={validMatch ? "false" : "true"}
            aria-describedby="confirmnote"
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
          />
          <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
            <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
          </p>

          <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
          </form>
          <p>
            Already registered?<br />
              <span className="line">
                {/*put router link here*/}
                <a href="#">Sign In</a>
              </span>
          </p>
    </section>
    )}
</>
  )
}

export default Register
