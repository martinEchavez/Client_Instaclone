import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../../gql/user';
import { setToken, decodeToken } from '../../../utils/token';
import useAuth from '../../../hooks/useAuth';
import './LoginForm.scss';

const LoginForm = () => {
    const [error, setError] = useState('')
    const [login] = useMutation(LOGIN);
    const { setUser } = useAuth();

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object({
            email: Yup.string()
                .email('El email no es valido')
                .required('Debes llenar este campo'),
            password: Yup.string()
                .required('Debes llenar este campo'),
        }),
        onSubmit: async (formData) => {
            setError('');
            try {
                const { data } = await login({
                    variables: {
                        input: formData,
                    }
                })
                const { token } = data.login;
                setToken(token);
                setUser(decodeToken(token));
            } catch (error) {
                setError(error.message);
            }
        }
    })

    return (
        <Form className="login-form" onSubmit={formik.handleSubmit}>
            <h2>Ingresa para ver fotos y vídeos de tus amigos</h2>
            <Form.Input
                type="text"
                placeholder="Correo electrónico"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.errors.email}
            />
            <Form.Input
                type="password"
                placeholder="Contraseña"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                error={formik.errors.password}
            />
            <Button type="submit" className="btn-submit">Iniciar Sesión</Button>
            {error && <p className="submit-error">{error}</p>}
        </Form>
    );
};

export default LoginForm;

const initialValues = () => {
    return {
        email: "",
        password: "",
    }
}