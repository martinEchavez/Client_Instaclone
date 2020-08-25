import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../../gql/user';
import './RegisterForm.scss';

const RegisterForm = (props) => {
    const { setShowLogin } = props;

    const [register] = useMutation(REGISTER);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Debes rellenar este campo'),
            username: Yup.string()
                .matches(/^[a-zA-Z0-9-]*$/, 'El Nombre de usuario no debe tener espacios')
                .required('Debes rellenar este campo'),
            email: Yup.string()
                .email('El correo no es vaido')
                .required('Debes rellenar este campo'),
            password: Yup.string()
                .required('Debes rellenar este campo')
                .oneOf([Yup.ref("repeatPassword")], 'Las contraseñas no coinciden'),
            repeatPassword: Yup.string()
                .required('Debes rellenar este campo')
                .oneOf([Yup.ref("password")], 'Las contraseñas no coinciden'),
        }),
        onSubmit: async (formData) => {
            try {
                const newUser = formData;// Se asigna el valor a un objeto nuevo para relizar cambios sobre este.
                delete newUser.repeatPassword; // Se elimina el valor repeatPassword

                // Se envian los datos a Graphql
                await register({
                    variables: {
                        input: newUser,
                    }
                })
                toast.success("Usuario regístrado correctamente");
                setShowLogin(true);
            } catch (error) {
                toast.error(error.message);
            }
        }
    })

    return (
        <>
            <h2 className="register-form-title">
                Regístrate para ver fotos y vídeos de tus amigos
            </h2>
            <Form className="register-form" onSubmit={formik.handleSubmit}>
                <Form.Input
                    type="text"
                    placeholder="Nombre y Apellido"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    error={formik.errors.name}
                />
                <Form.Input
                    type="text"
                    placeholder="Nombre de usuario"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    error={formik.errors.username}
                />
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
                <Form.Input
                    type="password"
                    placeholder="Repetir contraseña"
                    name="repeatPassword"
                    onChange={formik.handleChange}
                    value={formik.values.repeatPassword}
                    error={formik.errors.repeatPassword}
                />
                <Button type="submit" className="btn-submit">Regístrarse</Button>
            </Form>
        </>
    );
};

export default RegisterForm;

const initialValues = () => {
    return {
        name: "",
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
    }
}