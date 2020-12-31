import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import NavBar from './Navbar'
import FormError from '../addOns/fromError-com';
import FormSuccess from '../addOns/SigninSuccess';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from 'react-loader-spinner';

function SignIn() {
    const authContext = useContext(AuthContext);
    const [redirectOnLogin, setRedirectOnLogin] = useState(false);
    const [signInError, setSignInError] = useState(false);
    const [signInSuccess, setSignInSuccess] = useState(false);
    const [loading, setLoading] = useState(false)
    const [signInErrorText, setSignInErrorText] = useState();
    const [signInSuccessText, setSignInSuccessText] = useState();



    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    function changeHandle(e) {
        const { name, value } = e.target;

        setUser(prevValue => {
            if (name === "email") {
                return {
                    email: value,
                    password: prevValue.password
                }
            } else if (name === "password") {
                return {
                    email: prevValue.email,
                    password: value
                }
            }
        })
    };



    async function clickHandle(e) {
        try {
            e.preventDefault();
            const { data } = await axios.post("http://localhost:5000/signin", user)
            authContext.setAuthState(data);
            setSignInError(false);
            setSignInSuccessText(data.message);
            setLoading(true)
            setTimeout(() => {
                setLoading(false)
                setSignInSuccess(true)
            }, 1100)
            setTimeout(() => {
                setRedirectOnLogin(true)
            },2000)
        } catch (error) {
            const { data } = error.response;
            setSignInError(true);
            setSignInSuccess(false)
            setSignInErrorText(data.message);
        }

    }

    return (
        <>
            {redirectOnLogin && <Redirect to="/dashboard" />}
            <div>


                <NavBar />

                <form>
                    <br />
                    <br />
                    <div>

                        <h3 className="not-sh" >Sign In</h3>
                        {signInError && <FormError text={signInErrorText} />}
                        {loading && <Loader
                            type="Oval"
                            color="black"
                            height={50}
                            width={50}
                        />}
                        {signInSuccess && <FormSuccess text={signInSuccessText} />}
                        <div className="form-group">
                            <label className="not" htmlFor="email">Email</label>
                            <br />
                            <input type="email" onChange={changeHandle} name="email" id="email" className="form-control-lg" placeholder="Enter email" />
                        </div>

                        <div className="form-group">
                            <label className="not" htmlFor="password">Password</label>
                            <br />
                            <input type="password" onChange={changeHandle} name="password" id="password" className="form-control-lg" placeholder="Enter password" />
                        </div>

                        <button type="submit" onClick={clickHandle} className="btn btn-primary btn-success">Login <FontAwesomeIcon icon={faSignInAlt} /></button>
                        <br />
                        <br />



                    </div>
                </form>
            </div>

        </>
    )
}




export default SignIn;