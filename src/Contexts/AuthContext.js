import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const config = {
    region: 'ap-southeast-4',
    userPoolId: 'ap-southeast-4_QUxlltswc',
    clientId: '1skrql570uvrsk9nld7m856sc9',
};

const getCognitoUrl = () => {
    return `https://cognito-idp.${config.region}.amazonaws.com/`;
};

const signUp = async (email, password, firstName, lastName) => {
    const url = getCognitoUrl('signup');
    const data = {
        ClientId: config.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'given_name', Value: firstName },
            { Name: 'family_name', Value: lastName },
        ],
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error during sign up');
    }
};

const confirmSignUp = async (email, confirmationCode) => {
    const url = getCognitoUrl();
    const data = {
        ClientId: config.clientId,
        Username: email,
        ConfirmationCode: confirmationCode,
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error during confirmation');
    }
};

const setAuthInfo = (authInfo) => {
    const { AccessToken, IdToken, RefreshToken } = authInfo;
    localStorage.setItem('accessToken', AccessToken);
    localStorage.setItem('idToken', IdToken);
    localStorage.setItem('refreshToken', RefreshToken);
}

const unsetAuthInfo = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
}

const signIn = async (username, password) => {
    const url = getCognitoUrl();
    const data = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: config.clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/x-amz-json-1.1',
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
            },
        });
        setAuthInfo(response.data.AuthenticationResult);
        return true;
    } catch (error) {
        throw new Error(error.response.data.message || 'Error during sign in');
    }
};

const signOut = () => {
    unsetAuthInfo();
};

const hasValidAuthToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        try {
            const decodedToken = jwtDecode(accessToken);
            if (decodedToken.exp * 1000 > Date.now()) {
                return true;
            } else {
                signOut();
            }
        } catch (error) {
            signOut();
        }
    }
    return false;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        if (hasValidAuthToken()) {
            setIsAuthenticated(true);
            setAccessToken(localStorage.getItem('accessToken'));
        }
    }, [setIsAuthenticated, setAccessToken]);

    const handleSignUp = useCallback(async (email, password, firstName, lastName) => {
        await signUp(email, password, firstName, lastName);
    }, []);

    const handleConfirmSignUp = useCallback(async (email, confirmationCode) => {
        await confirmSignUp(email, confirmationCode);
    }, []);

    const handleSignIn = useCallback(async (username, password) => {
        if (await signIn(username, password)) {
            setIsAuthenticated(true);
            setAccessToken(localStorage.getItem('accessToken'));
            console.log('Access token:', localStorage.getItem('accessToken'));
        }
    }, [setIsAuthenticated, setAccessToken]);

    const handleSignOut = useCallback(() => {
        signOut();
        setIsAuthenticated(false);
        setAccessToken(null);
    }, [setIsAuthenticated, setAccessToken]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            accessToken,
            signUp: handleSignUp,
            confirmSignUp: handleConfirmSignUp,
            signIn: handleSignIn,
            signOut: handleSignOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
