import React from 'react'
import { Form, Formik } from 'formik'
import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { Box } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { useMutation } from 'urql'

interface registerProps {

}

const RegisterMutation = `

mutation Register($username : String!, $password : String!){
    register(options : {username : $username, password : $password}) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }

`
const Register: React.FC<registerProps> = ({ }) => {
    const [, register] = useMutation(RegisterMutation)
    return <Wrapper variant="small">
        <Formik initialValues={{ username: "", password: "" }}
            onSubmit={async (values) => {
                console.log(values)
                const response = await register(values)
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