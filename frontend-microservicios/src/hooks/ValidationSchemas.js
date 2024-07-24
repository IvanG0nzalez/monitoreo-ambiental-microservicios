import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    correo: Yup.string().email('El correo no es válido').required('El correo es requerido'),
    clave: Yup.string().required('La contraseña es requerida')
});



