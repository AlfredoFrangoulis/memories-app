import React, { useState, useEffect } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import jwt_decode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useStyles from './styles'
import Input from './Input'
import { signin, signup } from '../../actions/auth'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Auth = () => {
    const classes = useStyles()
    const [isSignUp, setIsSignUp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [user, setUser] = useState({})
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()
    
    const handleSubmit = (e) => {
        e.preventDefault()

        if(isSignUp) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp)
        setShowPassword(false)
    }
    
    useEffect(() => {
      /* global google */
      google.accounts.id.initialize({
        client_id: "390653991227-pnemreobtj6kla09o4n0epk7b9itkc7s.apps.googleusercontent.com",
        callback: handleCallBackResponse
      })

      google.accounts.id.renderButton(
        document.getElementById("signIn"),
        { theme: "outline", size: "large" }
      )
    }, [])

    const handleCallBackResponse = (response) => {
        console.log("Encoded JWT ID token : " + response.credential)
        var userObject = jwt_decode(response.credential)
        console.log(userObject)
        setUser(userObject)
        document.getElementById("signIn").hidden = true

        const result = userObject
        const token = response?.credential

        console.log(userObject)

        try {
            dispatch({ type: 'AUTH', data: { result, token } })
            history.push('/')
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>

                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignUp && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                                </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        { isSignUp && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
                    </Grid>

                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>

                    <Button fullWidth className={classes.googleButton}>
                        <div id="signIn"></div>
                    </Button>
                    
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Button onClick={switchMode} justifycontent="center">
                                {isSignUp ? (<Typography variant="caption" style={{ textTransform: "capitalize" }}>Already have an account? Sign In</Typography>) : (<Typography variant="caption" style={{ textTransform: "capitalize" }}>Don't have an account yet? Sign Up</Typography>)}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth