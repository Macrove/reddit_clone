import React from 'react'
import { Form, Formik } from 'formik'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Box } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button';
import { useRegisterMutation } from './../generated/graphql';

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
    const [, register] = useRegisterMutation();
    return <Wrapper variant="small">
        <Formik initialValues={{ username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
                const response = await register(values);
                if (response.data?.register.errors) {
                    setErrors({
                        username: "errorr!!!"
                    })
                }
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <InputField
                        name="username"
                        placeholder="username"
                        label="Username"
                    />

                    <Box mt={4}>
                        <InputField
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                        />
                    </Box>
                    <Button type="submit" mt={4} colorScheme="teal" isLoading={isSubmitting}>Register</Button>
                </Form>
            )}
        </Formik>
    </Wrapper>

}

export default Register