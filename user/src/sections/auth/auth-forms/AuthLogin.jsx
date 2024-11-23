import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { fetcher } from 'utils/axios';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { Image } from 'react-bootstrap';

// ============================|| JWT - LOGIN ||============================ //


export default function AuthLogin({ forgot }) {

  const [checked, setChecked] = useState(false);
  const [device_token, setdevice_token] = useState('');
  const { isLoggedIn, login } = useAuth();
  const scriptedRef = useScriptRef();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    async function fetchDeviceToken() {
      try {
        const token = window.device_token || localStorage.getItem('device_token') || '';

        console.log('Fetched Device Token:', token);
        setdevice_token(token);
      } catch (error) {
        console.error('Failed to fetch device token:', error);
      }
    }
    fetchDeviceToken();
  }, []);

  return <>
    <Formik
      enableReinitialize
      initialValues={{
        email: '',
        password: '',
        device_token: device_token || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address')
          .required('Email is required'),
        password: Yup.string().required('Password is required'),
        // device_token: Yup.string().required('device_token is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {

          await login(values.email, values.password, values.device_token);
          if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }

        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">Email Address</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
              </Stack>
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="-password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="h6">Keep me sign in</Typography>}
                />

                <Link variant="h6" component={RouterLink} to={isLoggedIn && forgot ? forgot : '/forgot-password'} color="text.primary">
                  Forgot Password?

                </Link>
              </Stack>
            </Grid>
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            {device_token !== '' ? (
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <AnimateButton>
                  <a
                    href="/upittech.apk"
                    download
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color="secondary"

                      style={{ background: '#5b8c00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >

                      <Image
                        src="https://cdn.pixabay.com/photo/2016/12/18/13/45/download-1915753_960_720.png"
                        alt="App Logo"
                        width={30}
                        height={30}
                        style={{ marginRight: 10 }}
                      />  Download
                      <Image
                        src="https://cdn-icons-png.flaticon.com/512/314/314670.png"
                        alt="App Logo"
                        width={30}
                        height={30}
                        style={{}}
                      /> our app to continue Login
                    </Button>
                  </a>
                </AnimateButton>
              </Grid>
            )}

            <br />
          </Grid>
        </form>
      )}
    </Formik>
  </>

}

AuthLogin.propTypes = { forgot: PropTypes.string };